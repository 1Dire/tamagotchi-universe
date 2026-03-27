// src/components/SpeechBubble.tsx
import React, { useEffect } from "react";

interface Props {
  message: string;
  onClose: () => void;
  isError?: boolean;
}

export default function SpeechBubble({ message, onClose, isError }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, isError ? 6000 : 4000);
    return () => clearTimeout(timer);
  }, [onClose, isError]);

  return (
    <div
      onClick={onClose}
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
        marginBottom: '10px',
        pointerEvents: 'auto',
        whiteSpace: 'nowrap',
        maxWidth: '220px',
        lineHeight: '1.4',
        border: `1.5px solid ${isError ? '#ffcccc' : '#eee'}`,
        cursor: 'pointer',
      }}
    >
      {isError ? '⚠️ ' : ''}{message}
      <div style={{
        position: 'absolute', bottom: '-8px', right: '24px',
        width: 0, height: 0,
        borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
        borderTop: `8px solid ${isError ? '#ffcccc' : '#eee'}`,
      }} />
      <div style={{
        position: 'absolute', bottom: '-6px', right: '25px',
        width: 0, height: 0,
        borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
        borderTop: `7px solid ${isError ? '#fff0f0' : '#ffffff'}`,
      }} />
    </div>
  );
}