// src/components/CharacterSelect.tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Theme } from '@/popup/theme'

const CHARACTERS = [
  {
    id: 'cat',
    emoji: '🐱',
    pro: false,
    anims: ['IDLE', 'WALK', 'RUN', 'JUMP', 'ATTACK', 'HURT'],
  },
  {
    id: 'cyber',
    emoji: '🤖',
    pro: true,
    anims: ['IDLE', 'WALK', 'RUN', 'ATTACK', 'SPECIAL'],
  },
  {
    id: 'ninja',
    emoji: '🥷',
    pro: true,
    anims: ['IDLE', 'WALK', 'RUN', 'DASH', 'HIDE'],
  },
] as const

type CharId = typeof CHARACTERS[number]['id']

interface Props {
  T: Theme
  onConfirm: (id: string) => void
}

export default function CharacterSelect({ T, onConfirm }: Props) {
  const { t } = useTranslation()
  const [cur, setCur] = useState(0)
  const c = CHARACTERS[cur]

  const navigate = (dir: number) => {
    const next = cur + dir
    if (next < 0 || next >= CHARACTERS.length) return
    setCur(next)
  }

  const handleConfirm = () => {
    if (c.pro) return
    chrome.storage.sync.set({ character: c.id, characterEmoji: c.emoji }, () => {
      onConfirm(c.id)
    })
  }

  return (
    <div className={`w-[320px] ${T.bg} ${T.text} overflow-hidden select-none`}>

      {/* Title */}
      <div className={`px-[18px] pt-5 pb-3 border-b ${T.divider}`}>
        <div className="text-[11px] text-[#FF6B00] font-semibold tracking-[0.06em] mb-1">
          CHARACTER SELECT
        </div>
        <div className="text-[16px] font-bold tracking-tight">
          {t('character.select')}
        </div>
      </div>

      {/* Stage */}
      <div className="flex items-center gap-3 px-[18px] py-6">

        {/* Left arrow */}
        <button
          onClick={() => navigate(-1)}
          disabled={cur === 0}
          className={`w-9 h-9 rounded-full border ${T.divider} bg-transparent ${T.textMid} flex items-center justify-center cursor-pointer transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed hover:enabled:border-[#FF6B00]/40 hover:enabled:text-[#FF6B00] flex-shrink-0`}
        >
          <FaChevronLeft size={12} />
        </button>

        {/* Character display */}
        <div className="flex-1 flex flex-col items-center gap-3">

          {/* Sprite box */}
          <div className={`w-[130px] h-[110px] ${T.surface} border ${T.divider} rounded-2xl flex items-center justify-center relative overflow-hidden`}>
            <span className="text-[48px] relative z-10" key={cur}
              style={{ animation: 'float 3s ease-in-out infinite' }}>
              {c.emoji}
            </span>
            {c.pro && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center text-2xl z-20">
                🔒
              </div>
            )}
          </div>

          {/* Name + badge */}
          <div className="flex items-center gap-2">
            <span className={`text-[15px] font-bold tracking-tight ${c.pro ? T.textFaint : T.text}`}>
              {t(`character.names.${c.id}`)}
            </span>
            <span className={`text-[9px] font-semibold px-[7px] py-px rounded border tracking-wider
              ${c.pro
                ? 'text-[#FF6B00] bg-[#FF6B00]/10 border-[#FF6B00]/25'
                : 'text-green-400 bg-green-400/10 border-green-400/20'
              }`}>
              {c.pro ? t('character.pro') : t('character.free')}
            </span>
          </div>

          {/* Desc */}
          <div className={`text-[11px] ${T.textFaint} text-center`}>
            {t(`character.desc.${c.id}`)}
          </div>

          {/* Anim tags */}
          <div className="flex flex-wrap gap-1 justify-center">
            {c.anims.map(a => (
              <span key={a} className={`text-[9px] ${T.surface} border ${T.divider} ${c.pro ? T.textFaint : T.textMid} px-2 py-0.5 rounded`}>
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={() => navigate(1)}
          disabled={cur === CHARACTERS.length - 1}
          className={`w-9 h-9 rounded-full border ${T.divider} bg-transparent ${T.textMid} flex items-center justify-center cursor-pointer transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed hover:enabled:border-[#FF6B00]/40 hover:enabled:text-[#FF6B00] flex-shrink-0`}
        >
          <FaChevronRight size={12} />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 pb-4">
        {CHARACTERS.map((_, i) => (
          <div
            key={i}
            onClick={() => setCur(i)}
            className={`h-1.5 rounded-full cursor-pointer transition-all duration-200
              ${i === cur ? 'w-4 bg-[#FF6B00]' : `w-1.5 ${T.surface}`}`}
          />
        ))}
      </div>

      {/* Footer */}
      <div className={`flex gap-2 px-[18px] pb-4 pt-3 border-t ${T.divider}`}>
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

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>
    </div>
  )
}