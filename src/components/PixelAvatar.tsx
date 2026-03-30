import { useRef, useEffect, memo } from 'react';
import type { AgentName, AgentState } from '../types';

interface PixelAvatarProps {
  agent: AgentName;
  state: AgentState;
  size?: number; // px, default 48
  direction?: 'down' | 'up' | 'left' | 'right';
  isMoving?: boolean;
}

// Agent color palettes (skin, hair, accent, shirt)
const PALETTES: Record<AgentName, { skin: string; hair: string; accent: string; shirt: string; pants: string }> = {
  Alex: { skin: '#FFDBAC', hair: '#3B3024', accent: '#3B82F6', shirt: '#2563EB', pants: '#1E3A5F' },
  Kai:  { skin: '#F5D0A9', hair: '#1A1A2E', accent: '#EAB308', shirt: '#CA8A04', pants: '#4A4A4A' },
  Mia:  { skin: '#FFE0BD', hair: '#8B4513', accent: '#22C55E', shirt: '#16A34A', pants: '#2D5A3D' },
  Nova: { skin: '#FFDBB4', hair: '#2D1B4E', accent: '#A855F7', shirt: '#7C3AED', pants: '#3B2063' },
  Rex:  { skin: '#F0C8A0', hair: '#4A2800', accent: '#EF4444', shirt: '#DC2626', pants: '#5C2020' },
};

function drawPixelChar(
  ctx: CanvasRenderingContext2D,
  agent: AgentName,
  state: AgentState,
  size: number,
  frame: number,
  direction: string,
  isMoving: boolean
) {
  const p = PALETTES[agent];
  const s = size / 16; // pixel unit (16x16 grid scaled up)
  ctx.imageSmoothingEnabled = false;

  const px = (x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x * s), Math.floor(y * s), Math.ceil(s), Math.ceil(s));
  };

  // Clear
  ctx.clearRect(0, 0, size, size);

  // Body bounce for walking
  const bounce = isMoving ? (frame % 2 === 0 ? -1 : 0) : 0;
  const yOff = bounce;

  // === HEAD (rows 2-5) ===
  // Hair top
  for (let x = 5; x <= 10; x++) px(x, 2 + yOff, p.hair);
  // Hair sides + face
  px(4, 3 + yOff, p.hair); px(5, 3 + yOff, p.hair);
  for (let x = 6; x <= 9; x++) px(x, 3 + yOff, p.skin);
  px(10, 3 + yOff, p.hair); px(11, 3 + yOff, p.hair);

  // Face row (eyes)
  px(4, 4 + yOff, p.hair);
  px(5, 4 + yOff, p.skin);
  if (direction !== 'up') {
    px(6, 4 + yOff, '#2D2D2D'); // left eye
    px(7, 4 + yOff, p.skin);
    px(8, 4 + yOff, p.skin);
    px(9, 4 + yOff, '#2D2D2D'); // right eye
  } else {
    for (let x = 6; x <= 9; x++) px(x, 4 + yOff, p.skin);
  }
  px(10, 4 + yOff, p.skin);
  px(11, 4 + yOff, p.hair);

  // Face bottom (mouth)
  px(5, 5 + yOff, p.skin);
  for (let x = 6; x <= 9; x++) px(x, 5 + yOff, p.skin);
  if (state === 'done') {
    px(7, 5 + yOff, '#2D2D2D'); px(8, 5 + yOff, '#2D2D2D'); // smile
  }
  px(10, 5 + yOff, p.skin);

  // === BODY (rows 6-10) ===
  // Neck
  px(7, 6 + yOff, p.skin); px(8, 6 + yOff, p.skin);

  // Shirt
  for (let y = 7; y <= 9; y++) {
    for (let x = 5; x <= 10; x++) {
      px(x, y + yOff, p.shirt);
    }
  }
  // Accent (tie/badge)
  px(7, 7 + yOff, p.accent); px(8, 7 + yOff, p.accent);
  px(7, 8 + yOff, p.accent);

  // Arms
  const armSwing = isMoving ? (frame % 4 < 2 ? 0 : 1) : 0;
  // Left arm
  px(4, 7 + yOff + armSwing, p.shirt);
  px(4, 8 + yOff + armSwing, p.shirt);
  px(4, 9 + yOff, p.skin); // hand

  // Right arm
  px(11, 7 + yOff + (isMoving ? 1 - armSwing : 0), p.shirt);
  px(11, 8 + yOff + (isMoving ? 1 - armSwing : 0), p.shirt);
  px(11, 9 + yOff, p.skin); // hand

  // Typing animation (hands on keyboard level)
  if (state === 'working' && !isMoving) {
    const typFrame = frame % 4;
    if (typFrame < 2) {
      px(4, 9 + yOff, p.skin);
      px(5, 10 + yOff, p.skin);
    } else {
      px(11, 9 + yOff, p.skin);
      px(10, 10 + yOff, p.skin);
    }
  }

  // === LEGS (rows 10-12) ===
  const legFrame = isMoving ? frame % 4 : 0;

  px(6, 10 + yOff, p.pants); px(7, 10 + yOff, p.pants);
  px(8, 10 + yOff, p.pants); px(9, 10 + yOff, p.pants);

  if (isMoving) {
    // Walking legs
    if (legFrame < 2) {
      px(6, 11, p.pants); px(7, 11, p.pants);
      px(9, 12, p.pants); px(8, 11, p.pants);
      px(6, 12, '#444'); px(9, 13, '#444'); // shoes
    } else {
      px(9, 11, p.pants); px(8, 11, p.pants);
      px(6, 12, p.pants); px(7, 11, p.pants);
      px(9, 12, '#444'); px(6, 13, '#444'); // shoes
    }
  } else {
    // Standing/sitting legs
    px(6, 11, p.pants); px(7, 11, p.pants);
    px(8, 11, p.pants); px(9, 11, p.pants);
    px(6, 12, '#444'); px(7, 12, '#444'); // shoes
    px(8, 12, '#444'); px(9, 12, '#444');
  }

  // === STATUS INDICATOR ===
  if (state === 'working' && !isMoving) {
    // Small blinking dot
    if (frame % 6 < 4) {
      px(12, 2 + yOff, '#3B82F6');
      px(13, 2 + yOff, '#3B82F6');
    }
  } else if (state === 'done') {
    // Checkmark
    px(12, 3 + yOff, '#22C55E');
    px(13, 2 + yOff, '#22C55E');
    px(14, 1 + yOff, '#22C55E');
  } else if (state === 'waiting') {
    // Hourglass dots
    if (frame % 4 < 2) {
      px(12, 2 + yOff, '#EAB308');
    } else {
      px(12, 3 + yOff, '#EAB308');
    }
  }
}

const PixelAvatar = memo(function PixelAvatar({
  agent,
  state,
  size = 48,
  direction = 'down',
  isMoving = false,
}: PixelAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fps = 8; // pixel art standard
    const interval = 1000 / fps;

    const animate = (time: number) => {
      if (time - lastTimeRef.current >= interval) {
        lastTimeRef.current = time;
        frameRef.current++;
        drawPixelChar(ctx, agent, state, size, frameRef.current, direction, isMoving);
      }
      animRef.current = requestAnimationFrame(animate);
    };

    // Initial draw
    drawPixelChar(ctx, agent, state, size, 0, direction, isMoving);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [agent, state, size, direction, isMoving]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="pixelated"
      style={{ imageRendering: 'pixelated' }}
    />
  );
});

export default PixelAvatar;
