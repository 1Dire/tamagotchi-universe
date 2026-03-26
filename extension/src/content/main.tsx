import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import SpriteCanvas from "@/components/SpriteCanvas";
import { CHARACTERS } from "@/components/CharacterSelect";
import { TamagotchiData } from "@/types/tamagotchi";

interface StorageResponse {
  tamagotchi_data?: TamagotchiData;
}

// 1. Shadow DOM 및 컨테이너 설정
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
const renderContainer = document.createElement("div");
shadowRoot.appendChild(renderContainer);

/**
 * 2. 메인 앱 컴포넌트
 */
const TamagotchiApp = () => {
  const [characterId, setCharacterId] = useState<string | null>(null);

  useEffect(() => {
    // 크롬 스토리지에서 다마고치 데이터 로드만 수행
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get("tamagotchi_data", (res: StorageResponse) => {
        if (res?.tamagotchi_data?.characterId) {
          setCharacterId(res.tamagotchi_data.characterId);
        } else {
          // 저장된 데이터가 없으면 기본 'cat' 로드
          setCharacterId("cat");
        }
      });
    }
  }, []);

  const config = CHARACTERS.find((c) => c.id === characterId);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
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
};

// 3. 렌더링 실행
const root = ReactDOM.createRoot(renderContainer);
root.render(<TamagotchiApp />);