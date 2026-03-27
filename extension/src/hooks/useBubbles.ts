// src/hooks/useBubbles.ts
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface Bubble {
  id: number;
  message: string;
  isError?: boolean;
}

export function useBubbles() {
  const { t, i18n } = useTranslation();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [langReady, setLangReady] = useState(false);  // ✅ 언어 동기화 완료 여부

  const addBubble = (message: string, isError = false) => {
    setBubbles((prev) => [...prev, { id: Date.now(), message, isError }]);
  };

  const removeBubble = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  // ─── 팝업에서 언어 변경 시 content script에도 동기화 ────
  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.storage) {
      setLangReady(true);  // chrome 없으면 바로 ready
      return;
    }

    // 초기 로드 시 저장된 언어 적용 후 ready
    chrome.storage.sync.get("language", (res) => {
      if (typeof res.language === "string" && res.language !== i18n.language) {
        i18n.changeLanguage(res.language).then(() => setLangReady(true));
      } else {
        setLangReady(true);  // 변경 불필요해도 ready
      }
    });

    // storage 변경 감지 → 언어 실시간 반영
    const handleStorageChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string
    ) => {
      if (area === "sync" && changes.language) {
        i18n.changeLanguage(changes.language.newValue as string);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, [i18n]);

  // ─── 전역 에러 감지 ─────────────────────────────────────
  useEffect(() => {
    const originalError = console.error;
    let isFiring = false;
    console.error = (...args) => {
      originalError(...args);
      if (isFiring) return;
      isFiring = true;
      addBubble(t("msg_error_console"), true);
      isFiring = false;
    };

    const handleError = () => addBubble(t("msg_error_console"), true);
    const handlePromise = () => addBubble(t("msg_error_console"), true);
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handlePromise);

    return () => {
      console.error = originalError;
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handlePromise);
    };
  }, [t]);

  return { bubbles, addBubble, removeBubble, langReady };  // ✅ langReady 반환
}