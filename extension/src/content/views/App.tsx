// src/content/views/App.tsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import SpriteCanvas from "@/components/SpriteCanvas";
import SpeechBubble from "@/components/SpeechBubble";
import ContextMenu from "@/components/ContextMenu";
import { useBubbles } from "@/hooks/useBubbles";
import { useAutoWalk } from "@/hooks/useAutoWalk";
import { CHARACTERS } from "@/components/CharacterSelect";
import { TamagotchiData } from "@/types/tamagotchi";

const CHAR_SCALE = 1.5;
const CHAR_W     = 32 * CHAR_SCALE;
const CHAR_H     = 32 * CHAR_SCALE;

export default function App() {
  const { t } = useTranslation();
  const { bubbles, addBubble, removeBubble, langReady } = useBubbles();
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const initialized = useRef(false);
  const { x, screenY, anim, facingLeft, onDragStart, pause, resume } = useAutoWalk(CHAR_W, CHAR_H);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

  // ✅ darkMode만 마운트 즉시 읽기 — langReady 기다리지 않음
  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.storage) return;

    chrome.storage.sync.get("darkMode", (res) => {
      if (typeof res.darkMode === "boolean") setDark(res.darkMode);
    });

    const handleChange = (changes: Record<string, chrome.storage.StorageChange>) => {
      if (typeof changes.darkMode?.newValue === "boolean") {
        setDark(changes.darkMode.newValue);
      }
    };
    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
  }, []);

  // 캐릭터 로드 — langReady 후
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
  if (!config || !characterId) return null;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    pause();
    setMenu({ x: e.clientX, y: e.clientY });
  };

  const handleMenuClose = () => {
    setMenu(null);
    resume();
  };

  const menuItems = [
    {
      icon: '🪵',
      label: '플랫폼 생성',
      onClick: () => {
        // 다음 단계에서 구현
      },
    },
  ];

  return (
    <>
      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          items={menuItems}
          dark={dark}
          onClose={handleMenuClose}
        />
      )}

      <div style={{
        position: 'fixed',
        top: screenY, left: x,
        width: CHAR_W,
        overflow: 'visible',
        zIndex: 2147483645,
        pointerEvents: 'none',
      }}>
        {bubbles.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '100%', left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 8,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            {bubbles.map((b) => (
              <SpeechBubble
                key={b.id}
                message={b.message}
                isError={b.isError}
                onClose={() => removeBubble(b.id)}
              />
            ))}
          </div>
        )}
        <div
          onMouseDown={onDragStart}
          onContextMenu={handleContextMenu}
          style={{
            transform: facingLeft ? 'scaleX(1)' : 'scaleX(-1)',
            pointerEvents: 'auto',
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          <SpriteCanvas
            characterId={characterId}
            anim={anim}
            frameConfig={config.frameConfig}
            scale={CHAR_SCALE}
          />
        </div>
      </div>
    </>
  );
}