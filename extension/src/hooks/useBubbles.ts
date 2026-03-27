// src/hooks/useBubbles.ts
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

export interface Bubble {
  id: number;
  message: string;
  isError?: boolean;
}

export function useBubbles() {
  const { t, i18n } = useTranslation();
  const [bubbles, setBubbles]   = useState<Bubble[]>([]);
  const [langReady, setLangReady] = useState(false);

  const addBubble = useCallback((message: string, isError = false) => {
    setBubbles((prev) => [...prev, { id: Date.now(), message, isError }]);
  }, []);

  const removeBubble = useCallback((id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // 초기 언어 + 팝업 언어 변경 실시간 반영
  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.storage) {
      setLangReady(true);
      return;
    }
    chrome.storage.sync.get("language", (res) => {
      if (typeof res.language === "string" && res.language !== i18n.language) {
        i18n.changeLanguage(res.language).then(() => setLangReady(true));
      } else {
        setLangReady(true);
      }
    });
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

  // 에러 감지
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
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);
    return () => {
      console.error = originalError;
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, [t, addBubble]);

  return { bubbles, addBubble, removeBubble, langReady };
}