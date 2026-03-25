// src/components/SpriteCanvas.tsx
import { useEffect, useRef } from 'react'

const FRAME_W = 80
const FRAME_H = 64

const ANIM_FRAMES: Record<string, number> = {
  IDLE: 8, WALK: 12, RUN: 8,
  JUMP: 3, ATTACK: 8, HURT: 4,
  RUNNING_JUMP: 3,
}

const ANIM_FPS: Record<string, number> = {
  IDLE: 8, WALK: 10, RUN: 12,
  JUMP: 6, ATTACK: 10, HURT: 8,
  RUNNING_JUMP: 6,
}

interface Props {
  anim: string
  scale?: number
}

export default function SpriteCanvas({ anim, scale = 2 }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const frameRef   = useRef(0)
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const imgRef     = useRef<HTMLImageElement | null>(null)
  const animRef    = useRef(anim)

  useEffect(() => {
    animRef.current = anim
    frameRef.current = 0

    const animName = anim.replace('anim-', '').toUpperCase()
    const fileName = animName === 'ATTACK' ? 'ATTACK 1' : animName

    const img = new Image()
   img.src = chrome.runtime.getURL(`Sprites/Cat/${fileName}.png`)
    imgRef.current = img

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    if (timerRef.current) clearInterval(timerRef.current)

    const frames = ANIM_FRAMES[animName] ?? 8
    const fps    = ANIM_FPS[animName]   ?? 8

    timerRef.current = setInterval(() => {
      if (!imgRef.current?.complete) return
      ctx.clearRect(0, 0, FRAME_W, FRAME_H)
      ctx.drawImage(
        imgRef.current,
        frameRef.current * FRAME_W, 0, FRAME_W, FRAME_H,
        0, 0, FRAME_W, FRAME_H,
      )
      frameRef.current = (frameRef.current + 1) % frames
    }, 1000 / fps)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [anim])

  return (
    <canvas
      ref={canvasRef}
      width={FRAME_W}
      height={FRAME_H}
      style={{
        width:  FRAME_W * scale,
        height: FRAME_H * scale,
        imageRendering: 'pixelated',
      }}
    />
  )
}