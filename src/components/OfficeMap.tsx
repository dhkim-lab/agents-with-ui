import { useRef, useEffect, memo } from 'react';

interface OfficeMapProps {
  width: number;
  height: number;
}

// Tile types
const FLOOR = 0;
const WALL = 1;
const DESK = 2;
const CHAIR = 3;
const MEETING_TABLE = 4;
const PLANT = 5;
const WHITEBOARD = 6;
const CORRIDOR = 7;
const MONITOR = 8;

// Colors
const TILE_COLORS: Record<number, string> = {
  [FLOOR]: '#2A3444',
  [WALL]: '#1A2332',
  [DESK]: '#5C4033',
  [CHAIR]: '#3D3D3D',
  [MEETING_TABLE]: '#6B4423',
  [PLANT]: '#2D5A3D',
  [WHITEBOARD]: '#E8E8E8',
  [CORRIDOR]: '#232D3B',
  [MONITOR]: '#1E293B',
};

// 20x12 tilemap
const MAP: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 8, 0, 0, 7, 7, 7, 0, 0, 2, 8, 0, 0, 5, 0, 0, 0, 1],
  [1, 0, 3, 0, 0, 0, 7, 7, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 8, 0, 0, 7, 7, 7, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0, 1],
  [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 8, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 5, 0, 0, 1],
  [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function drawTile(ctx: CanvasRenderingContext2D, x: number, y: number, tile: number, ts: number) {
  const px = x * ts;
  const py = y * ts;

  // Base floor
  ctx.fillStyle = TILE_COLORS[FLOOR];
  ctx.fillRect(px, py, ts, ts);

  // Grid lines (subtle)
  ctx.strokeStyle = '#1F2937';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(px, py, ts, ts);

  switch (tile) {
    case WALL:
      ctx.fillStyle = TILE_COLORS[WALL];
      ctx.fillRect(px, py, ts, ts);
      // Wall texture
      ctx.fillStyle = '#151D29';
      ctx.fillRect(px, py, ts, 2);
      break;

    case DESK:
      ctx.fillStyle = TILE_COLORS[DESK];
      ctx.fillRect(px + 2, py + 2, ts - 4, ts - 4);
      // Wood grain
      ctx.fillStyle = '#4A3228';
      ctx.fillRect(px + 4, py + ts / 2, ts - 8, 1);
      break;

    case MONITOR:
      // Desk base
      ctx.fillStyle = TILE_COLORS[DESK];
      ctx.fillRect(px + 2, py + 2, ts - 4, ts - 4);
      // Screen
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(px + 4, py + 3, ts - 8, ts - 10);
      // Screen glow
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(px + 5, py + 4, ts - 10, ts - 12);
      ctx.fillStyle = '#1E40AF';
      ctx.fillRect(px + 6, py + 5, ts - 12, 2);
      break;

    case CHAIR:
      ctx.fillStyle = TILE_COLORS[CHAIR];
      ctx.fillRect(px + 4, py + 4, ts - 8, ts - 8);
      ctx.fillStyle = '#4A4A4A';
      ctx.fillRect(px + 6, py + 2, ts - 12, 3);
      break;

    case MEETING_TABLE:
      ctx.fillStyle = TILE_COLORS[MEETING_TABLE];
      ctx.fillRect(px + 1, py + 1, ts - 2, ts - 2);
      // Table shine
      ctx.fillStyle = '#7C5A38';
      ctx.fillRect(px + 3, py + 3, ts - 6, 2);
      break;

    case PLANT:
      // Pot
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(px + ts / 2 - 4, py + ts - 8, 8, 6);
      // Leaves
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(px + ts / 2 - 6, py + ts - 14, 4, 6);
      ctx.fillRect(px + ts / 2 - 2, py + ts - 16, 4, 8);
      ctx.fillRect(px + ts / 2 + 2, py + ts - 14, 4, 6);
      ctx.fillStyle = '#16A34A';
      ctx.fillRect(px + ts / 2 - 1, py + ts - 18, 2, 4);
      break;

    case WHITEBOARD:
      ctx.fillStyle = TILE_COLORS[WHITEBOARD];
      ctx.fillRect(px + 1, py + 2, ts - 2, ts - 6);
      // Content lines
      ctx.fillStyle = '#CBD5E1';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(px + 4, py + 5 + i * 5, ts - 8, 1);
      }
      // Frame
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 1, py + 2, ts - 2, ts - 6);
      break;

    case CORRIDOR:
      ctx.fillStyle = TILE_COLORS[CORRIDOR];
      ctx.fillRect(px, py, ts, ts);
      // Path markers
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(px + ts / 2 - 1, py, 2, ts);
      break;
  }
}

const OfficeMap = memo(function OfficeMap({ width, height }: OfficeMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cols = MAP[0].length;
    const rows = MAP.length;
    const ts = Math.min(width / cols, height / rows);

    canvas.width = cols * ts;
    canvas.height = rows * ts;

    ctx.imageSmoothingEnabled = false;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        drawTile(ctx, x, y, MAP[y][x], ts);
      }
    }

    // Room labels
    ctx.fillStyle = '#475569';
    ctx.font = `${Math.max(10, ts * 0.4)}px monospace`;
    ctx.fillText('OFFICE', ts * 1, ts * 1.5);
    ctx.fillText('Meeting Room', ts * 10, ts * 7.5);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated',
      }}
      className="absolute inset-0"
    />
  );
});

export default OfficeMap;
