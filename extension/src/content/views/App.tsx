// src/content/views/App.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import SpriteCanvas from "@/components/SpriteCanvas";
import SpeechBubble from "@/components/SpeechBubble";
import ContextMenu from "@/components/ContextMenu";
import { useBubbles } from "@/hooks/useBubbles";
import { useAutoWalk, Platform } from "@/hooks/useAutoWalk";
import { CHARACTERS } from "@/components/CharacterSelect";
import { TamagotchiData } from "@/types/tamagotchi";
import TranslationPanel from "@/components/TranslationPanel";

const CHAR_SCALE = 1.5;
const CHAR_W     = 32 * CHAR_SCALE;
const CHAR_H     = 32 * CHAR_SCALE;
const PLAT_H     = 14;
const MIN_W      = 40;

const isChromeStorage = typeof chrome !== "undefined" && !!chrome.storage;

export default function App() {
  const { t, i18n } = useTranslation();
  const { bubbles, addBubble, removeBubble, langReady } = useBubbles();

  const [characterId, setCharacterId] = useState<string | null>(null);
  const [dark, setDark]               = useState(false);
  const [menu, setMenu]               = useState<{ x: number; y: number } | null>(null);
  const [drawMode, setDrawMode]       = useState(false);
  const [platforms, setPlatforms]     = useState<Platform[]>([]);
  const [preview, setPreview]         = useState<{ x: number; y: number; width: number } | null>(null);
  const [initialX, setInitialX]       = useState<number | undefined>(undefined);
  const [initialY, setInitialY]       = useState<number | undefined>(undefined);
  const [ready, setReady]             = useState(false);

  // 번역
  const [translationText, setTranslationText]   = useState('');
  const [translationLoading, setTranslationLoading] = useState(false);
  const [showTranslation, setShowTranslation]   = useState(false);
  const [partialMode, setPartialMode]           = useState(false);

  // 발판 변경 시 localStorage에 저장 (도메인별)
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem('tamagotchi_platforms', JSON.stringify(platforms));
  }, [platforms, ready]);

  const drawModeRef  = useRef(false);
  const drawStart    = useRef<{ x: number; y: number } | null>(null);
  const initialized  = useRef(false);

  const config     = CHARACTERS.find((c) => c.id === characterId);
  const platOffset = config?.platOffset ?? 0;

  const { x, screenY, anim, facingLeft, onDragStart, pause, resume, checkFall } =
    useAutoWalk(CHAR_W, CHAR_H, platforms, platOffset, ready ? initialX : undefined, ready ? initialY : undefined);

  // x 위치 + 발판 복원 — localStorage (도메인별)
  useEffect(() => {
    const ratio = parseFloat(localStorage.getItem('tamagotchi_pos_ratio') ?? '');
    if (!isNaN(ratio)) setInitialX(ratio * window.innerWidth);

    const ratioY = parseFloat(localStorage.getItem('tamagotchi_pos_ratio_y') ?? '');
    if (!isNaN(ratioY)) setInitialY(ratioY * window.innerHeight);

    const saved = localStorage.getItem('tamagotchi_platforms');
    if (saved) { try { setPlatforms(JSON.parse(saved)); } catch {} }

    setReady(true);
  }, []);

  // darkMode 로드 + 실시간 반영
  useEffect(() => {
    if (!isChromeStorage) return;
    chrome.storage.sync.get("darkMode", (res) => {
      if (typeof res.darkMode === "boolean") setDark(res.darkMode);
    });
    const onChange = (changes: Record<string, chrome.storage.StorageChange>) => {
      if (typeof changes.darkMode?.newValue === "boolean") setDark(changes.darkMode.newValue);
    };
    chrome.storage.onChanged.addListener(onChange);
    return () => chrome.storage.onChanged.removeListener(onChange);
  }, []);

  // 캐릭터 로드
  useEffect(() => {
    if (!langReady || initialized.current) return;
    initialized.current = true;
    addBubble(t("msg_hungry"));
    if (isChromeStorage) {
      chrome.storage.sync.get("tamagotchi_data", (res: { tamagotchi_data?: TamagotchiData }) => {
        if (chrome.runtime.lastError) { addBubble(t("msg_storage_error"), true); setCharacterId("cat"); return; }
        setCharacterId(res?.tamagotchi_data?.characterId ?? "cat");
      });
    } else {
      addBubble(t("msg_storage_error"), true);
      setCharacterId("cat");
    }
  }, [langReady, addBubble, t]);

  const setDrawModeSync = useCallback((val: boolean) => {
    drawModeRef.current = val;
    setDrawMode(val);
  }, []);

  // 번역 실행 (Claude API)
  const translate = useCallback(async (textToTranslate: string) => {
    if (!textToTranslate.trim()) return;
    setShowTranslation(true);
    setTranslationLoading(true);
    setTranslationText('');
    try {
      const targetLang = i18n.language === 'ko' ? '한국어' : i18n.language === 'ja' ? '일본어' : i18n.language === 'zh' ? '중국어' : 'English';
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `다음 텍스트를 ${targetLang}로 번역해줘. 번역 결과만 출력하고 다른 말은 하지 마.\n\n${textToTranslate.slice(0, 2000)}`,
          }],
        }),
      });
      const data = await res.json();
      setTranslationText(data.content?.[0]?.text ?? '번역 실패');
    } catch {
      setTranslationText('번역 중 오류가 발생했어요.');
    } finally {
      setTranslationLoading(false);
    }
  }, [i18n.language]);

  // 페이지 전체 번역
  const translatePage = useCallback(() => {
    const text = document.body.innerText.slice(0, 2000);
    translate(text);
  }, [translate]);

  // 부분 번역 모드 — 마법봉 커서 + mouseup 시 선택 텍스트 번역
  useEffect(() => {
    if (!partialMode) return;
    document.body.style.cursor = 'crosshair';

    const onMouseUp = () => {
      const selected = window.getSelection()?.toString().trim();
      setPartialMode(false);
      document.body.style.cursor = '';
      if (selected) translate(selected);
    };

    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
    };
  }, [partialMode, translate]);

  const enterDrawMode = useCallback(() => {
    setDrawModeSync(true);
    pause();
  }, [pause, setDrawModeSync]);

  const exitDrawMode = useCallback(() => {
    setDrawModeSync(false);
    resume();
  }, [resume, setDrawModeSync]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    pause();
    setMenu({ x: e.clientX, y: e.clientY });
  }, [pause]);

  const handleMenuClose = useCallback(() => {
    setMenu(null);
    if (!drawModeRef.current) resume();
  }, [resume]);

  const menuItems = [
    { icon: '🪵', label: t("ctx_platform_create"), onClick: enterDrawMode },
    { icon: '🌐', label: t("ctx_translate_page"),    onClick: translatePage },
    { icon: '🪄', label: t("ctx_translate_partial"), onClick: () => setPartialMode(true) },
  ];

  if (!config || !characterId || !ready) return null;

  return (
    <>
      {/* 번역 패널 */}
      {showTranslation && (
        <TranslationPanel
          text={translationText}
          loading={translationLoading}
          dark={dark}
          onClose={() => setShowTranslation(false)}
        />
      )}

      {/* 부분 번역 모드 안내 */}
      {partialMode && ReactDOM.createPortal(
        <div style={{
          position: 'fixed', bottom: 24, left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.75)', color: '#fff',
          fontSize: 13, fontWeight: 500, padding: '8px 18px',
          borderRadius: 20, zIndex: 2147483646, pointerEvents: 'none',
          fontFamily: "'Noto Sans KR',sans-serif",
          backdropFilter: 'blur(8px)',
        }}>
          🪄 {t("translate_partial_hint")}
        </div>,
        document.body
      )}

      {/* 플랫폼 */}
      {platforms.map((p) => (
        <div
          key={p.id}
          onDoubleClick={() => {
            setPlatforms((ps) => ps.filter((pl) => pl.id !== p.id));
            setTimeout(checkFall, 50);
          }}
          title="더블클릭으로 삭제"
          style={{
            position: 'fixed', left: p.x, top: p.y,
            width: p.width, height: PLAT_H,
            background: 'rgba(80,60,40,0.85)', borderRadius: 4,
            border: '1px solid rgba(120,90,50,0.9)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            pointerEvents: 'auto', cursor: 'pointer', zIndex: 2147483640,
          }}
        />
      ))}

      {/* 드로우 미리보기 */}
      {preview && preview.width > 4 && ReactDOM.createPortal(
        <div style={{
          position: 'fixed', left: preview.x, top: preview.y,
          width: preview.width, height: PLAT_H,
          background: 'rgba(80,60,40,0.5)',
          border: '2px dashed rgba(120,90,50,0.9)',
          borderRadius: 4, pointerEvents: 'none', zIndex: 2147483648,
        }} />,
        document.body
      )}

      {/* 컨텍스트 메뉴 */}
      {menu && (
        <ContextMenu x={menu.x} y={menu.y} items={menuItems} dark={dark} onClose={handleMenuClose} />
      )}

      {/* 플랫폼 추가 모드 */}
      {drawMode && ReactDOM.createPortal(
        <>
          <div
            onMouseDown={(e) => {
              if (e.button !== 0) return;
              drawStart.current = { x: e.clientX, y: e.clientY };
              setPreview({ x: e.clientX, y: e.clientY, width: 0 });
            }}
            onMouseMove={(e) => {
              if (!drawStart.current) return;
              setPreview({
                x:     Math.min(drawStart.current.x, e.clientX),
                y:     drawStart.current.y,
                width: Math.abs(e.clientX - drawStart.current.x),
              });
            }}
            onMouseUp={(e) => {
              const start = drawStart.current;
              drawStart.current = null;
              setPreview(null);
              if (start) {
                const width = Math.abs(e.clientX - start.x);
                if (width >= MIN_W) {
                  setPlatforms((ps) => [...ps, {
                    id: Date.now(), x: Math.min(start.x, e.clientX), y: start.y, width,
                  }]);
                  addBubble(t("msg_platform_created"));
                }
              }
              exitDrawMode();
            }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              zIndex: 2147483644, cursor: 'crosshair', pointerEvents: 'auto',
            }}
          />
          <style>{`@keyframes slideUp{from{transform:translate(-50%,40px);opacity:0}to{transform:translate(-50%,0);opacity:1}}`}</style>
          <div style={{
            position: 'fixed', bottom: 48, left: '50%',
            zIndex: 2147483646, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 12, pointerEvents: 'none',
            animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
          }}>
            <p style={{ color: '#fff', fontSize: 13, fontWeight: 500, margin: 0, opacity: 0.7, whiteSpace: 'nowrap', fontFamily: "'Noto Sans KR',sans-serif" }}>
              {t("draw_hint")}
            </p>
            <button
              onClick={exitDrawMode}
              style={{
                pointerEvents: 'auto', cursor: 'pointer',
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 500,
                padding: '8px 24px', backdropFilter: 'blur(8px)', transition: 'background 0.15s',
                fontFamily: "'Noto Sans KR',sans-serif",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            >
              {t("draw_cancel")}
            </button>
          </div>
        </>,
        document.body
      )}

      {/* 캐릭터 + 말풍선 */}
      <div style={{
        position: 'fixed', top: screenY, left: x,
        width: CHAR_W, overflow: 'visible',
        zIndex: 2147483645, pointerEvents: 'none',
      }}>
        {bubbles.length > 0 && (
          <div style={{
            position: 'absolute', bottom: '100%', left: '50%',
            transform: 'translateX(-50%)', marginBottom: 8,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>
            {bubbles.map((b) => (
              <SpeechBubble key={b.id} message={b.message} isError={b.isError} onClose={() => removeBubble(b.id)} />
            ))}
          </div>
        )}
        <div
          onMouseDown={onDragStart}
          onContextMenu={handleContextMenu}
          style={{
            transform: facingLeft ? 'scaleX(1)' : 'scaleX(-1)',
            pointerEvents: 'auto', cursor: 'grab', userSelect: 'none',
          }}
        >
          <SpriteCanvas characterId={characterId} anim={anim} frameConfig={config.frameConfig} scale={CHAR_SCALE} />
        </div>
      </div>
    </>
  );
}