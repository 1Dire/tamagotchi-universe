import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    48: "logo.png",
  },
  action: {
    default_icon: {
      48: "logo.png",
    },
    default_popup: "src/popup/index.html",
  },
  permissions: ["storage", "activeTab", "sidePanel"],
  content_security_policy: {
    extension_pages:
      "script-src 'self' 'wasm-unsafe-eval' http://localhost:5173 http://localhost:5174; object-src 'self'; connect-src 'self' ws://localhost:5173 ws://localhost:5174 http://localhost:5173 http://localhost:5174",
  },
  content_scripts: [
    {
      js: ["src/content/main.tsx"],
      matches: ["<all_urls>"],
      run_at: "document_end",
    },
  ],
  web_accessible_resources: [
    {
 resources: ["Sprites/**", "assets/**", "*.png", "src/styles/tailwind.css"],  // ← 추가
    matches: ["http://*/*", "https://*/*"],
    },
  ],
  side_panel: {
    default_path: "src/sidepanel/index.html",
  },
});
