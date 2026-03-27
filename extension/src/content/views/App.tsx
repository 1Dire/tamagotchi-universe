// src/content/views/App.tsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import SpriteCanvas from "@/components/SpriteCanvas";
import SpeechBubble from "@/components/SpeechBubble";
import { useBubbles } from "@/hooks/useBubbles";
import { useAutoWalk } from "@/hooks/useAutoWalk";
import { CHARACTERS } from "@/components/CharacterSelect";
import { TamagotchiData } from "@/types/tamagotchi";

const CHAR_SCALE = 1.5;
const CHAR_W = 32 * CHAR_SCALE;
const BUBBLE_W = 220;
const SCREEN_MARGIN = 8;

export default function App() {
  const { t } = useTranslation();
  const { bubbles, addBubble, removeBubble, langReady } = useBubbles();
  const [characterId, setCharacterId] = useState<string | null>(null);
  const initialized = useRef(false);
  const { x, anim, facingLeft } = useAutoWalk(CHAR_W);

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

  const containerW = Math.max(CHAR_W, BUBBLE_W);
  const containerLeft = Math.max(
    SCREEN_MARGIN,
    Math.min(
      x + CHAR_W / 2 - containerW / 2,
      window.innerWidth - containerW - SCREEN_MARGIN
    )
  );

  if (!config || !characterId) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: containerLeft,
      width: containerW,
      zIndex: 2147483645,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pointerEvents: 'none',
    }}>
      {bubbles.map((b) => (
        <SpeechBubble
          key={b.id}
          message={b.message}
          isError={b.isError}
          onClose={() => removeBubble(b.id)}
        />
      ))}
      <div style={{
        transform: facingLeft ? 'scaleX(1)' : 'scaleX(-1)',
        pointerEvents: 'auto',
        cursor: 'pointer',
      }}>
        <SpriteCanvas
          characterId={characterId}
          anim={anim}
          frameConfig={config.frameConfig}
          scale={CHAR_SCALE}
        />
      </div>
    </div>
  );
}