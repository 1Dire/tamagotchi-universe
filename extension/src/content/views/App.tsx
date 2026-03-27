// src/content/views/App.tsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import SpriteCanvas from "@/components/SpriteCanvas";
import SpeechBubble from "@/components/SpeechBubble";
import { useBubbles } from "@/hooks/useBubbles";
import { CHARACTERS } from "@/components/CharacterSelect";
import { TamagotchiData } from "@/types/tamagotchi";  // ✅ 타입 중앙 관리

export default function App() {
  const { t } = useTranslation();
  const { bubbles, addBubble, removeBubble, langReady } = useBubbles();
  const [characterId, setCharacterId] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!langReady || initialized.current) return;
    initialized.current = true;

    addBubble(t("msg_hungry"));

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get("tamagotchi_data", (res: { tamagotchi_data?: TamagotchiData }) => {
        if (chrome.runtime.lastError) {
          addBubble(t("msg_storage_error"), true);
          setCharacterId("cat");
          return;
        }
        setCharacterId(res?.tamagotchi_data?.characterId ?? "cat");
      });
    } else {
      addBubble(t("msg_storage_error"), true);
      setCharacterId("cat");
    }
  }, [langReady]);

  const config = CHARACTERS.find((c) => c.id === characterId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {bubbles.map((b) => (
        <SpeechBubble
          key={b.id}
          message={b.message}
          isError={b.isError}
          onClose={() => removeBubble(b.id)}
        />
      ))}
      {config && characterId && (
        <div style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
          <SpriteCanvas
            characterId={characterId}
            anim="IDLE"
            frameConfig={config.frameConfig}
            scale={1.5}
          />
        </div>
      )}
    </div>
  );
}