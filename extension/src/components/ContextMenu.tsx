// src/components/ContextMenu.tsx
import  { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface MenuItem {
  icon: string;
  label: string;
  onClick: () => void;
}

interface Props {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
  dark: boolean;
}

export default function ContextMenu({ x, y, items, onClose, dark }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  const bg     = dark ? '#1c1c1e'               : '#ffffff';
  const border = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const text   = dark ? '#f5f5f7'               : '#1c1c1e';
  const hover  = dark ? 'rgba(255,255,255,0.12)': 'rgba(0,0,0,0.08)';
  const shadow = dark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.12)';

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown",   onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown",   onKey);
    };
  }, [onClose]);

  const menuW = 168;
  const menuH = items.length * 40 + 8;
  const left  = Math.min(x, window.innerWidth  - menuW - 8);
  const top   = Math.min(y, window.innerHeight - menuH - 8);

  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      style={{
        position:     'fixed',
        left, top,
        width:        menuW,
        background:   bg,
        border:       `0.5px solid ${border}`,
        borderRadius: 8,
        overflow:     'hidden',
        boxShadow:    shadow,
        zIndex:       2147483647,
        fontFamily:   "'Noto Sans KR', 'Noto Sans', sans-serif",
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          onClick={() => { item.onClick(); onClose(); }}
          style={{
            display:     'flex',
            alignItems:  'center',
            gap:         8,
            padding:     '10px 12px',
            fontSize:    13,
            fontWeight:  500,
            color:       text,
            cursor:      'pointer',
            transition:  'background 0.15s',
            background:  'transparent',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = hover)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{ fontSize: 14, width: 16, textAlign: 'center', flexShrink: 0 }}>
            {item.icon}
          </span>
          {item.label}
        </div>
      ))}
    </div>,
    document.body  // ✅ body에 직접 마운트
  );
}