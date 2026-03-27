import React, { useEffect, useRef, useState } from 'react';
import { FrameDetail } from '@/types/tamagotchi';

interface Props {
  characterId: string;
  anim: string;
  frameConfig: Record<string, FrameDetail>;
  scale?: number;
}

export default function SpriteCanvas({
  characterId,
  anim,
  frameConfig,
  scale = 2
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<number | null>(null);
  const [rawSize, setRawSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const animKey = anim.replace('anim-', '').toUpperCase();
    const fileName = animKey === 'ATTACK' ? 'ATTACK 1' : animKey;
    const folderName = characterId === 'gray_cat' ? 'Graycat' : 'Cat';
    
    const { frames, fps } = frameConfig[animKey] || { frames: 1, fps: 8 };

    const img = new Image();
    img.src = chrome.runtime.getURL(`Sprites/${folderName}/${fileName}.png`);

    let currentFrame = 0;

    // 렌더링 루프 설정
    const startAnimation = () => {
      const canvas = canvasRef.current;
      if (!canvas || img.width === 0) return;

      const frameWidth = img.width / frames;
      const frameHeight = img.height;
      
      // 캔버스 실제 픽셀 해상도 동기화 
      canvas.width = frameWidth;
      canvas.height = frameHeight;
      setRawSize({ w: frameWidth, h: frameHeight });

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 도트 그래픽 안티앨리어싱 비활성화 (선명도 유지)
      ctx.imageSmoothingEnabled = false;

      // 기존 중복 타이머 정리
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }

      const drawNextFrame = () => {
        if (!canvasRef.current) return;
        
        ctx.clearRect(0, 0, frameWidth, frameHeight);
        ctx.drawImage(
          img, 
          currentFrame * frameWidth, 0, frameWidth, frameHeight, 
          0, 0, frameWidth, frameHeight                           
        );
        
        currentFrame = (currentFrame + 1) % frames;
      };

      // 첫 프레임 즉시 렌더링 후 타이머 시작
      drawNextFrame();
      timerRef.current = window.setInterval(drawNextFrame, 1000 / fps);
    };

    img.onload = startAnimation;

    // 언마운트 및 의존성 변경 시 클린업
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [anim, characterId, frameConfig]);

  return (
    <div className="flex items-center justify-center overflow-hidden w-full h-full">
      <canvas
        ref={canvasRef}
        style={{
          width: rawSize.w * scale,
          height: rawSize.h * scale,
          imageRendering: 'pixelated', // CSS 레벨 픽셀 아트 최적화
        }}
        className="block"
      />
    </div>
  );
}