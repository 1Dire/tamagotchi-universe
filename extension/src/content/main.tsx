// src/content/main.tsx
import ReactDOM from "react-dom/client";
import "@/i18n";
import App from "@/content/views/App";
import tailwindStyles from '@/styles/tailwind.css?inline';

export const hostDiv = document.createElement("div");
hostDiv.id = "tamagotchi-universe-host";
hostDiv.style.cssText = `
  position: fixed !important;
  inset: 0 !important;
  z-index: 2147483645 !important;
  pointer-events: none;
`;
document.body.appendChild(hostDiv);

const shadowRoot = hostDiv.attachShadow({ mode: "open" });

const style = document.createElement("style");
style.textContent = tailwindStyles;
shadowRoot.appendChild(style);

const fontStyle = document.createElement("style");
fontStyle.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Sans+KR:wght@400;700&family=Noto+Sans+JP:wght@400;700&display=swap');
`;
shadowRoot.appendChild(fontStyle);

export const renderContainer = document.createElement("div");  // ✅ export
renderContainer.style.cssText = `
  position: fixed;
  inset: 0;
  pointer-events: none;
`;
shadowRoot.appendChild(renderContainer);

const root = ReactDOM.createRoot(renderContainer);
root.render(<App />);