import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const RESULTS_KEY = 'campaign-results';
const TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return res.status(503).json({ error: 'Redis not configured' });
  }

  try {
    if (req.method === 'POST') {
      const result = req.body;
      if (!result?.id || !result?.brief) {
        return res.status(400).json({ error: 'Invalid result data' });
      }

      // Store individual result with TTL
      await redis.set(`result:${result.id}`, JSON.stringify(result), { ex: TTL_SECONDS });

      // Add to sorted set (score = timestamp for ordering)
      await redis.zadd(RESULTS_KEY, {
        score: Date.now(),
        member: result.id,
      });

      // Trim old entries (keep latest 100)
      const count = await redis.zcard(RESULTS_KEY);
      if (count > 100) {
        await redis.zremrangebyrank(RESULTS_KEY, 0, count - 101);
      }

      return res.status(201).json({ success: true, id: result.id });
    }

    if (req.method === 'GET') {
      const { id } = req.query;

      // Single result
      if (id && typeof id === 'string') {
        const data = await redis.get(`result:${id}`);
        if (!data) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json(typeof data === 'string' ? JSON.parse(data) : data);
      }

      // List all results (latest 50)
      const ids = await redis.zrange(RESULTS_KEY, 0, 49, { rev: true });
      if (!ids || ids.length === 0) return res.status(200).json([]);

      const pipeline = redis.pipeline();
      for (const rid of ids) {
        pipeline.get(`result:${rid}`);
      }
      const results = await pipeline.exec();

      const parsed = results
        .filter(Boolean)
        .map(r => {
          try {
            return typeof r === 'string' ? JSON.parse(r) : r;
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      return res.status(200).json(parsed);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
