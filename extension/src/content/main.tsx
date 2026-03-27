// src/content/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "@/i18n";                         
import App from "@/content/views/App";
import tailwindStyles from '@/styles/tailwind.css?inline';

// ─── Shadow DOM 마운트 ────────────────────────────────────
const hostDiv = document.createElement("div");
hostDiv.id = "tamagotchi-universe-host";
hostDiv.style.cssText = `
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  z-index: 2147483647 !important;
  pointer-events: none;
`;
document.body.appendChild(hostDiv);

const shadowRoot = hostDiv.attachShadow({ mode: "open" });

// ─── Tailwind CSS 주입 ─────────────────────────────────
const style = document.createElement("style");
style.textContent = tailwindStyles;
shadowRoot.appendChild(style);

// ─── Noto Sans 폰트 주입 ───────────────────────────────
const fontStyle = document.createElement("style");
fontStyle.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Sans+KR:wght@400;700&family=Noto+Sans+JP:wght@400;700&display=swap');
`;
shadowRoot.appendChild(fontStyle);

const renderContainer = document.createElement("div");
shadowRoot.appendChild(renderContainer);

// ─── 렌더 ─────────────────────────────────────────────
const root = ReactDOM.createRoot(renderContainer);
root.render(<App />);