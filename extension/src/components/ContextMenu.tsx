// src/components/ContextMenu.tsx
import React, { useEffect, useRef } from "react";

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

  // 색상 — 동적이라 인라인 style로 처리
  const bg     = dark ? '#1c1c1e'              : '#ffffff';
  const border = dark ? 'rgba(255,255,255,0.1)': 'rgba(0,0,0,0.1)';
  const text   = dark ? '#f5f5f7'              : '#1c1c1e';
  const hover  = dark ? 'rgba(255,255,255,0.08)': 'rgba(0,0,0,0.05)';
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
  const menuH = items.length * 36 + 16;
  const left  = Math.min(x, window.innerWidth  - menuW - 8);
  const top   = Math.min(y, window.innerHeight - menuH - 8);

  return (
    <div
      ref={menuRef}
      className="fixed p-1 rounded-lg pointer-events-auto"
      style={{ left, top, width: menuW, background: bg, border: `0.5px solid ${border}`, boxShadow: shadow, zIndex: 2147483647 }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          onClick={() => { item.onClick(); onClose(); }}
          className="flex items-center gap-2 px-2.5 py-2 rounded-md text-[13px] font-medium cursor-pointer transition-colors"
          style={{ color: text }}
          onMouseEnter={e => (e.currentTarget.style.background = hover)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <span className="w-4 text-center text-sm shrink-0">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
}