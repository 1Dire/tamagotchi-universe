// src/components/Footer.tsx
import { FaMoon, FaSun } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { Theme } from '@/popup/theme'

interface Props {
  T: Theme
  dark: boolean
  onToggleDark: () => void
}

export default function Footer({ T, dark, onToggleDark }: Props) {
  const { i18n } = useTranslation()

  const toggleLang = () => {
    const next = i18n.language === 'ko' ? 'en' : 'ko'
    i18n.changeLanguage(next)
    chrome.storage.sync.set({ language: next })
  }

  const openLogin = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('src/login/index.html') })
  }

  return (
    <div className="flex gap-2 px-[18px] py-3">
      {/* 다크모드 토글 */}
      <button
        onClick={onToggleDark}
        className={`w-9 h-9 rounded-lg border ${T.divider} bg-transparent ${T.textMid} transition-all duration-200 cursor-pointer flex items-center justify-center flex-shrink-0 hover:border-[#FF6B00]/40 hover:text-[#FF6B00]`}
      >
        {dark ? <FaMoon size={14} /> : <FaSun size={14} />}
      </button>

      {/* 언어 변경 */}
      <button
        onClick={toggleLang}
        className={`w-9 h-9 rounded-lg border ${T.divider} bg-transparent ${T.textMid} transition-all duration-200 cursor-pointer flex items-center justify-center flex-shrink-0 hover:border-[#FF6B00]/40 hover:text-[#FF6B00] text-[11px] font-semibold`}
      >
        {i18n.language === 'ko' ? 'EN' : 'KO'}
      </button>

      <button
        onClick={openLogin}
        className={`flex-1 py-2.5 bg-transparent border rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 ${T.btnGhost}`}
      >
        {i18n.language === 'ko' ? '로그인' : 'Login'}
      </button>

      <button className="flex-[2] py-2.5 bg-gradient-to-r from-[#FF6B00] to-[#FF9500] border-none rounded-lg text-white text-xs font-semibold cursor-pointer tracking-tight">
        {i18n.language === 'ko' ? 'Plaza 입장' : 'Enter Plaza'}
      </button>
    </div>
  )
}