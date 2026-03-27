// src/components/SpeechBubble.tsx
import React, { useEffect, useRef } from "react";

interface Props {
  message: string;
  onClose: () => void;
  isError?: boolean;
  tailOffset?: number;  // 꼬리 left 위치 (px), 기본 버블 중앙
}

export default function SpeechBubble({ message, onClose, isError, tailOffset }: Props) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current(), isError ? 6000 : 4000);
    return () => clearTimeout(timer);
  }, []);

  const tail = tailOffset !== undefined ? tailOffset : undefined;
  const tailStyle = tail !== undefined
    ? { left: tail, transform: 'translateX(-50%)' }
    : { left: '50%',  transform: 'translateX(-50%)' };

  return (
    <div
      onClick={() => onCloseRef.current()}
      style={{
        position: 'relative',
        background: isError ? '#fff0f0' : '#ffffff',
        color: '#1a1a1a',
        fontSize: '12px',
        fontWeight: 500,
        fontFamily: "'Noto Sans KR', 'Noto Sans JP', 'Noto Sans', sans-serif",
        padding: '8px 12px',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        marginBottom: '6px',
        whiteSpace: 'nowrap',
        maxWidth: '220px',
        lineHeight: '1.4',
        border: `1.5px solid ${isError ? '#ffcccc' : '#eee'}`,
        cursor: 'pointer',
        pointerEvents: 'auto',
      }}
    >
      {isError ? '⚠️ ' : ''}{message}
      <div style={{
        position: 'absolute', bottom: '-8px',
        width: 0, height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: `8px solid ${isError ? '#ffcccc' : '#eee'}`,
        ...tailStyle,
      }} />
      <div style={{
        position: 'absolute', bottom: '-6px',
        width: 0, height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: `7px solid ${isError ? '#fff0f0' : '#ffffff'}`,
        ...tailStyle,
      }} />
    </div>
  );
}