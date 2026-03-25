// src/components/CharacterSelect.tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Theme } from '@/popup/theme'
import SpriteCanvas from './SpriteCanvas'

const CHARACTERS = [
  { id: 'cat',   emoji: '🐱', pro: false, anims: ['IDLE','WALK','RUN','JUMP','ATTACK','HURT'] },
  { id: 'cyber', emoji: '🤖', pro: true,  anims: ['IDLE','WALK','RUN','ATTACK','SPECIAL'] },
  { id: 'ninja', emoji: '🥷', pro: true,  anims: ['IDLE','WALK','RUN','DASH','HIDE'] },
] as const

const ANIM_CLASS: Record<string, string> = {
  IDLE: 'anim-idle', WALK: 'anim-walk', RUN: 'anim-run',
  JUMP: 'anim-jump', ATTACK: 'anim-attack', HURT: 'anim-hurt',
  SPECIAL: 'anim-attack', DASH: 'anim-run', HIDE: 'anim-hurt',
}

const ANIM_DUR: Record<string, number> = {
  JUMP: 700, ATTACK: 600, HURT: 500, SPECIAL: 600, DASH: 400, HIDE: 500,
}

interface Props {
  T: Theme
  onConfirm: (id: string) => void
}

export default function CharacterSelect({ T, onConfirm }: Props) {
  const { t } = useTranslation()
  const [cur, setCur]   = useState(0)
  const [anim, setAnim] = useState('anim-idle')

  const c = CHARACTERS[cur]

  const navigate = (dir: number) => {
    const next = cur + dir
    if (next < 0 || next >= CHARACTERS.length) return
    setCur(next)
    setAnim('anim-idle')
  }

  const playAnim = (name: string) => {
    if (c.pro) return
    setAnim(ANIM_CLASS[name] ?? 'anim-idle')
    const dur = ANIM_DUR[name]
    if (dur) setTimeout(() => setAnim('anim-idle'), dur)
  }

  const handleConfirm = () => {
    if (c.pro) return
    chrome.storage.sync.set({ character: c.id, characterEmoji: c.emoji }, () => {
      onConfirm(c.id)
    })
  }

  return (
    <div className={`w-[320px] ${T.bg} ${T.text} overflow-hidden select-none`}>
      <style>{`
        @keyframes idle   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-6px) rotate(2deg)} }
        @keyframes walk   { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-3px) rotate(3deg)} }
        @keyframes run    { 0%{transform:translateX(-4px) scaleX(1)} 50%{transform:translateX(4px) scaleX(-1)} 100%{transform:translateX(-4px) scaleX(1)} }
        @keyframes jump   { 0%,100%{transform:translateY(0) scaleY(1)} 40%{transform:translateY(-20px) scaleY(1.1)} 80%{transform:translateY(4px) scaleY(0.9)} }
        @keyframes attack { 0%,100%{transform:translateX(0) rotate(0deg)} 25%{transform:translateX(8px) rotate(-15deg)} 50%{transform:translateX(16px) rotate(-30deg)} 75%{transform:translateX(8px) rotate(-10deg)} }
        @keyframes hurt   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        .anim-idle   { animation: idle   1.2s ease-in-out infinite; }
        .anim-walk   { animation: walk   0.5s ease-in-out infinite; }
        .anim-run    { animation: run    0.4s ease-in-out infinite; }
        .anim-jump   { animation: jump   0.6s ease-in-out 1; }
        .anim-attack { animation: attack 0.3s ease-in-out 2; }
        .anim-hurt   { animation: hurt   0.3s ease-in-out 3; }
      `}</style>

      {/* Stage */}
      <div className={`relative h-[160px] flex items-center justify-center overflow-hidden ${T.surface2}`}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 60%, rgba(255,107,0,0.08), transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none z-10"
          style={{ background: `linear-gradient(transparent, var(--stage-bg))` }} />

        {c.pro && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-3xl z-20">
            🔒
          </div>
        )}

<SpriteCanvas anim={anim} scale={2} />
      </div>

      {/* Info + nav */}
      <div className={`flex items-center justify-between px-[18px] pt-3 pb-2 border-b ${T.divider}`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[16px] font-bold tracking-tight ${c.pro ? T.textFaint : T.text}`}>
              {t(`character.names.${c.id}`)}
            </span>
            <span className={`text-[9px] font-semibold px-[7px] py-px rounded border
              ${c.pro
                ? 'text-[#FF6B00] bg-[#FF6B00]/10 border-[#FF6B00]/25'
                : 'text-green-400 bg-green-400/10 border-green-400/20'
              }`}>
              {c.pro ? 'PRO' : 'FREE'}
            </span>
          </div>
          <div className={`text-[12px] ${T.textMid}`}>
            {t(`character.desc.${c.id}`)}
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            disabled={cur === 0}
            className={`w-7 h-7 rounded-full border ${T.divider} bg-transparent ${T.textMid} flex items-center justify-center cursor-pointer transition-all duration-150 text-xs disabled:opacity-20 disabled:cursor-not-allowed hover:enabled:border-[#FF6B00]/40 hover:enabled:text-[#FF6B00]`}
          >‹</button>
          <span className={`text-[11px] ${T.textFaint}`}>{cur + 1} / {CHARACTERS.length}</span>
          <button
            onClick={() => navigate(1)}
            disabled={cur === CHARACTERS.length - 1}
            className={`w-7 h-7 rounded-full border ${T.divider} bg-transparent ${T.textMid} flex items-center justify-center cursor-pointer transition-all duration-150 text-xs disabled:opacity-20 disabled:cursor-not-allowed hover:enabled:border-[#FF6B00]/40 hover:enabled:text-[#FF6B00]`}
          >›</button>
        </div>
      </div>

      {/* Anim buttons */}
      <div className="flex flex-wrap gap-1.5 px-[18px] py-3">
        {c.anims.map(a => (
          <button
            key={a}
            onClick={() => playAnim(a)}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border transition-all duration-150 cursor-pointer
              ${c.pro
                ? `${T.surface} ${T.divider} ${T.textFaint} cursor-not-allowed opacity-40`
                : `bg-transparent ${T.divider} ${T.textMid} hover:border-[#FF6B00]/40 hover:text-[#FF6B00]`
              }`}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Confirm */}
      <div className="px-[18px] pb-4 flex gap-2">
        {c.pro && (
          <button className={`flex-1 py-2.5 bg-transparent border ${T.divider} rounded-[9px] text-[#FF6B00] text-[11px] font-semibold cursor-pointer`}>
            {t('character.upgrade')}
          </button>
        )}
        <button
          onClick={handleConfirm}
          disabled={c.pro}
          className={`flex-[2] py-2.5 rounded-[9px] text-[13px] font-semibold border-none cursor-pointer transition-all duration-150
            ${c.pro
              ? `${T.surface} ${T.textFaint} cursor-not-allowed`
              : 'bg-gradient-to-r from-[#FF6B00] to-[#FF9500] text-white hover:opacity-90'
            }`}
        >
          {c.pro ? t('character.locked') : t('character.confirm')}
        </button>
      </div>
    </div>
  )
}