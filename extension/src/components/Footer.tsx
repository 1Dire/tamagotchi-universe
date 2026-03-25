// src/components/Footer.tsx
import { FaMoon, FaSun } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Theme } from "@/popup/theme";

interface Props {
  T: Theme;
  dark: boolean;
  onToggleDark: () => void;
}

export default function Footer({ T, dark, onToggleDark }: Props) {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === "ko" ? "en" : "ko";
    i18n.changeLanguage(next);
    chrome.storage.sync.set({ language: next });
  };

  const openLogin = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("src/login/index.html") });
  };

  return (
   <div className="flex items-center justify-between px-[18px] py-3">
      {/* 왼쪽 그룹: 다크모드 & 언어 설정 (서로 붙어 있음) */}
      <div className="flex gap-1.5">
        <button
          onClick={onToggleDark}
          className={`w-9 h-9 rounded-lg border ${T.divider} flex items-center justify-center transition-all hover:border-[#FF6B00]/40 hover:text-[#FF6B00] ${T.textMid}`}
        >
          {dark ? <FaMoon size={14} /> : <FaSun size={14} />}
        </button>

        <button
          onClick={toggleLang}
          className={`w-9 h-9 rounded-lg border ${T.divider} flex items-center justify-center text-[11px] font-bold transition-all hover:border-[#FF6B00]/40 hover:text-[#FF6B00] ${T.textMid}`}
        >
          {i18n.language === "ko" ? "EN" : "KO"}
        </button>
      </div>

  
      <div className="flex-1 ml-10"> {/* ml-4로 최소 간격 확보 후 나머지 공간 채우기 */}
        <button 
          onClick={openLogin}
          className="w-full h-9 bg-gradient-to-r from-[#FF6B00] to-[#FF9500] border-none rounded-lg text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
        >
          {i18n.language === "ko" ? "로그인" : "Login"}
        </button>
      </div>
    </div>
  );
}
