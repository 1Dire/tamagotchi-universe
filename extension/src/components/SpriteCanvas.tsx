import React, { useEffect, useRef, useState } from 'react';
import { FrameDetail } from '@/types/tamagotchi';

interface Props {
  characterId: string;
  anim: string;
  frameConfig: Record<string, FrameDetail>;
  scale?: number;
}

export default function SpriteCanvas({ characterId, anim, frameConfig, scale = 2 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef  = useRef<number | null>(null);
  const [rawSize, setRawSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const animKey    = anim.replace('anim-', '').toUpperCase();
    const fileName   = animKey === 'ATTACK' ? 'ATTACK 1' : animKey;
    const folderName = characterId === 'gray_cat' ? 'Graycat' : 'Cat';
    const { frames, fps } = frameConfig[animKey] || { frames: 1, fps: 8 };

    const img = new Image();
    img.src = chrome.runtime.getURL(`Sprites/${folderName}/${fileName}.png`);

    let currentFrame = 0;

    const startAnimation = () => {
      const canvas = canvasRef.current;
      if (!canvas || img.width === 0) return;

      const frameWidth  = img.width / frames;
      const frameHeight = img.height;

      canvas.width  = frameWidth;
      canvas.height = frameHeight;
      setRawSize({ w: frameWidth, h: frameHeight });

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;

      if (timerRef.current !== null) window.clearInterval(timerRef.current);

      const drawNextFrame = () => {
        if (!canvasRef.current) return;
        ctx.clearRect(0, 0, frameWidth, frameHeight);
        ctx.drawImage(img, currentFrame * frameWidth, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
        currentFrame = (currentFrame + 1) % frames;
      };

      drawNextFrame();
      timerRef.current = window.setInterval(drawNextFrame, 1000 / fps);
    };

    img.onload = startAnimation;
    return () => { if (timerRef.current !== null) window.clearInterval(timerRef.current); };
  }, [anim, characterId, frameConfig]);

  return (
    <div className="flex items-center justify-center overflow-hidden w-full h-full">
      <canvas ref={canvasRef} style={{ width: rawSize.w * scale, height: rawSize.h * scale, imageRendering: 'pixelated' }} className="block" />
    </div>
  );
}