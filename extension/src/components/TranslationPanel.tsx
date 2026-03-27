// src/components/TranslationPanel.tsx
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface Props {
  text: string;
  loading: boolean;
  dark: boolean;
  onClose: () => void;
}

export default function TranslationPanel({ text, loading, dark, onClose }: Props) {
  const bg     = dark ? '#1c1c1e' : '#ffffff';
  const border = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const color  = dark ? '#f5f5f7' : '#1c1c1e';
  const muted  = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const shadow = dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return ReactDOM.createPortal(
    <>
      <style>{`
        @keyframes panelSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
      <div style={{
        position:     'fixed',
        top:          60,
        right:        0,
        width:        320,
        maxHeight:    'calc(100vh - 80px)',
        background:   bg,
        border:       `0.5px solid ${border}`,
        borderRight:  'none',
        borderRadius: '12px 0 0 12px',
        boxShadow:    shadow,
        zIndex:       2147483646,
        display:      'flex',
        flexDirection:'column',
        animation:    'panelSlideIn 0.3s cubic-bezier(0.34,1.2,0.64,1) forwards',
        fontFamily:   "'Noto Sans KR','Noto Sans',sans-serif",
        pointerEvents:'auto',
      }}>
        {/* 헤더 */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          justifyContent:'space-between',
          padding:      '12px 16px',
          borderBottom: `0.5px solid ${border}`,
          flexShrink:   0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>🌐</span>
            <span style={{ fontSize: 13, fontWeight: 600, color }}>번역</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              color: muted, fontSize: 16, cursor: 'pointer',
              padding: '2px 6px', borderRadius: 4,
            }}
          >✕</button>
        </div>

        {/* 내용 */}
        <div style={{
          padding:    '14px 16px',
          overflowY:  'auto',
          flex:       1,
          lineHeight: 1.75,
          fontSize:   13,
          color,
        }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[80, 100, 60, 90, 70].map((w, i) => (
                <div key={i} style={{
                  height: 12, borderRadius: 6,
                  width: `${w}%`,
                  background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  animation: 'pulse 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.1}s`,
                }} />
              ))}
              <style>{`@keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
            </div>
          ) : (
            <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {text}
            </p>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}