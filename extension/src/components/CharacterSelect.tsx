import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { THEME } from "@/popup/theme";
import SpriteCanvas from "./SpriteCanvas";
import { FrameDetail } from "@/types/tamagotchi";

type ThemeType = typeof THEME.light;

interface Props {
  T: ThemeType;
  onConfirm: (id: string) => void;
}

export const CHARACTERS = [
  {
    id: "cat",
    pro: false,
    platOffset: 24,  
    anims: ["IDLE", "WALK", "RUN", "JUMP", "ATTACK", "HURT"],
    frameConfig: {
      IDLE:   { frames: 8,  fps: 8  },
      WALK:   { frames: 12, fps: 10 },
      RUN:    { frames: 8,  fps: 12 },
      JUMP:   { frames: 3,  fps: 6  },
      ATTACK: { frames: 8,  fps: 10 },
      HURT:   { frames: 4,  fps: 8  },
    } as Record<string, FrameDetail>,
  },
  {
    id: "gray_cat",
    pro: false,
    platOffset: 8,   // ← 직접 조정하세요
    anims: ["IDLE"],
    frameConfig: {
      IDLE:   { frames: 4, fps: 6  },
      WALK:   { frames: 6, fps: 8  },
      RUN:    { frames: 4, fps: 10 },
      JUMP:   { frames: 2, fps: 6  },
      ATTACK: { frames: 4, fps: 10 },
      HURT:   { frames: 2, fps: 8  },
    } as Record<string, FrameDetail>,
  },
] as const;

const ANIM_DUR: Record<string, number> = {
  JUMP: 700, ATTACK: 600, HURT: 500,
};

export default function CharacterSelect({ T, onConfirm }: Props) {
  const { t } = useTranslation();
  const [cur, setCur]   = useState(0);
  const [anim, setAnim] = useState("IDLE");
  const timerRef        = useRef<number | null>(null);
  const c               = CHARACTERS[cur];

  const clearCurrentTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => clearCurrentTimer, []);

  const playAnim = (name: string) => {
    if (c.pro) return;
    clearCurrentTimer();
    setAnim(name);
    const dur = ANIM_DUR[name];
    if (dur) {
      timerRef.current = window.setTimeout(() => {
        setAnim("IDLE");
        timerRef.current = null;
      }, dur);
    }
  };

  const navigate = (dir: number) => {
    const next = cur + dir;
    if (next < 0 || next >= CHARACTERS.length) return;
    clearCurrentTimer();
    setCur(next);
    setAnim("IDLE");
  };

  const handleConfirm = () => {
    if (c.pro) return;
    const saveData = {
      characterId: c.id,
      stats: { hunger: 100, happiness: 100, energy: 100, level: 1, exp: 0 },
      lastUpdated: Date.now(),
    };
    if (typeof chrome !== "undefined" && chrome.storage?.sync) {
      chrome.storage.sync.set({ tamagotchi_data: saveData }, () => { onConfirm(c.id); });
    } else {
      console.warn("[Dev] Chrome Storage 미지원 환경입니다.");
      onConfirm(c.id);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className={`relative h-[180px] flex items-center justify-center border-b ${T.divider} ${T.surface2}`}>
        <SpriteCanvas characterId={c.id} anim={anim} frameConfig={c.frameConfig} scale={3} />
      </div>

      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight">
            {t(`character.names.${c.id}`)}
          </span>
          {c.pro && <span className="text-[9px] text-orange-500 font-bold">PRO ONLY</span>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} disabled={cur === 0}
            className={`p-1 transition-transform ${cur === 0 ? 'opacity-30' : 'hover:scale-110 active:scale-95'}`}>◀</button>
          <span className="text-xs font-medium min-w-[35px] text-center">{cur + 1} / {CHARACTERS.length}</span>
          <button onClick={() => navigate(1)} disabled={cur === CHARACTERS.length - 1}
            className={`p-1 transition-transform ${cur === CHARACTERS.length - 1 ? 'opacity-30' : 'hover:scale-110 active:scale-95'}`}>▶</button>
        </div>
      </div>

      <div className="px-4 pb-4 flex flex-wrap gap-1.5">
        {c.anims.map((a) => (
          <button key={a} onClick={() => playAnim(a)}
            className={`text-[10px] px-2.5 py-1 rounded border transition-all duration-150
              ${anim === a ? 'bg-orange-500 border-orange-500 text-white shadow-md' : `${T.divider} hover:bg-gray-100/10 active:bg-gray-100/20`}`}>
            {a}
          </button>
        ))}
      </div>

      <div className="p-4 pt-0 mt-auto">
        <button onClick={handleConfirm} disabled={c.pro}
          className={`w-full py-3 rounded-xl font-bold transition-all active:scale-[0.98]
            ${c.pro ? 'bg-gray-400 cursor-not-allowed opacity-60 text-gray-700' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'}`}>
          {t("character.confirm")}
        </button>
      </div>
    </div>
  );
}