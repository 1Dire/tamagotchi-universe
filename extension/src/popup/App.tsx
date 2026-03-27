// src/popup/App.tsx
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { THEME } from "@/popup/theme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CharacterSelect from "@/components/CharacterSelect";

export default function App() {
  const { i18n } = useTranslation();
  const [dark, setDark] = useState<boolean>(true);

  // ─── 초기 설정 로드 (다크모드 + 언어) ─────────────────
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage?.sync) {
      chrome.storage.sync.get(["darkMode", "language"], (result) => {
        if (typeof result.darkMode === "boolean") {
          setDark(result.darkMode);
        }
        // ✅ 저장된 언어 복원 (새로고침해도 유지)
        if (
          typeof result.language === "string" &&
          result.language !== i18n.language
        ) {
          i18n.changeLanguage(result.language);
        }
      });
    }
  }, []);

  const toggleDark = () => {
    setDark((prev) => {
      const next = !prev;
      if (typeof chrome !== "undefined" && chrome.storage?.sync) {
        chrome.storage.sync.set({ darkMode: next });
      }
      return next;
    });
  };

  const T = useMemo(() => (dark ? THEME.dark : THEME.light), [dark]);

  return (
    <div
      className={`
      w-[320px] h-[480px] flex flex-col
      ${T.bg} ${T.text} overflow-hidden select-none transition-colors duration-300
    `}
    >
      <Header T={T} />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <CharacterSelect
          T={T}
          onConfirm={(id) => console.log("선택된 캐릭터 ID:", id)}
        />
      </main>
      <Footer T={T} dark={dark} onToggleDark={toggleDark} />
    </div>
  );
}
