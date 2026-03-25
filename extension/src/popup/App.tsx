// src/popup/App.tsx
import { useState, useEffect } from 'react'
import { THEME } from '@/popup/theme'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CharacterSelect from '@/components/CharacterSelect'
export default function App() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.storage) return
    chrome.storage.sync.get('darkMode', (data) => {
      if (data.darkMode !== undefined) setDark(data.darkMode as boolean)
    })
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    if (typeof chrome === 'undefined' || !chrome.storage) return
    chrome.storage.sync.set({ darkMode: next })
  }

  const T = dark ? THEME.dark : THEME.light

  return (
    <div className={`w-[320px] ${T.bg} ${T.text} overflow-hidden select-none transition-colors duration-200`}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        * { font-family: 'Pretendard', sans-serif; }
      `}</style>

      <Header T={T} />
      <CharacterSelect T={T} onConfirm={(id) => console.log(id)} />
      <Footer T={T} dark={dark} onToggleDark={toggleDark} />
    </div>
  )
}