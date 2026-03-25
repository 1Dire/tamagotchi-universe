import { useEffect, useRef, useState } from 'react'

// 프레임 크기(frameW, frameH)를 제거하고 수와 속도만 남깁니다.
export interface FrameDetail {
  frames: number
  fps: number
}

interface Props {
  characterId: string
  anim: string
  frameConfig: Record<string, FrameDetail>
  scale?: number
}

export default function SpriteCanvas({ characterId, anim, frameConfig, scale = 2 }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const frameRef   = useRef(0)
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const imgRef     = useRef<HTMLImageElement | null>(null)
  
  // 캔버스 크기를 동적으로 관리하기 위한 상태 (기본값 설정)
  const [size, setSize] = useState({ w: 80, h: 64 })

  useEffect(() => {
    frameRef.current = 0
    const animName = anim.replace('anim-', '').toUpperCase()
    const fileName = animName === 'ATTACK' ? 'ATTACK 1' : animName

    const folderName = characterId === 'gray_cat' ? 'Graycat' : 'Cat'
    
    // 현재 애니메이션의 설정값 가져오기
    const config = frameConfig[animName] || { frames: 8, fps: 8 }
    const { frames, fps } = config

    const img = new Image()
    img.src = chrome.runtime.getURL(`Sprites/${folderName}/${fileName}.png`)
    imgRef.current = img

    // [핵심] 이미지가 로드되면 자동으로 1프레임의 가로/세로 길이를 계산합니다.
    img.onload = () => {
      setSize({
        w: img.width / frames, // 전체 너비 ÷ 프레임 수 = 1프레임 너비
        h: img.height          // 높이는 이미지 높이 그대로 사용
      })
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    if (timerRef.current) clearInterval(timerRef.current)

    // 애니메이션 루프
    timerRef.current = setInterval(() => {
      if (!imgRef.current?.complete || imgRef.current.width === 0) return
      
      // 그릴 때도 자동으로 계산된 너비를 사용합니다.
      const fw = imgRef.current.width / frames
      const fh = imgRef.current.height

      ctx.clearRect(0, 0, fw, fh)
      ctx.drawImage(
        imgRef.current,
        frameRef.current * fw, 0, fw, fh, // 소스 영역 자르기
        0, 0, fw, fh                      // 캔버스에 그리기
      )
      frameRef.current = (frameRef.current + 1) % frames
    }, 1000 / fps)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [anim, characterId, frameConfig])

  return (
    <canvas
      ref={canvasRef}
      width={size.w}   // 상태로 관리되는 자동 계산된 너비
      height={size.h}  // 상태로 관리되는 자동 계산된 높이
      style={{
        width: size.w * scale,
        height: size.h * scale,
        imageRendering: 'pixelated',
      }}
    />
  )
}