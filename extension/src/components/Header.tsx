// src/components/Header.tsx
import { Theme } from '@/popup/theme'

interface Props {
  T: Theme
}

export default function Header({ T }: Props) {
  return (
    <div className={`flex items-center justify-between px-[18px] py-4 border-b ${T.divider}`}>
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-[22px] h-[22px] rounded-[6px] bg-gradient-to-br from-[#FF6B00] to-[#FF9500] flex items-center justify-center text-[11px] font-bold text-white">
          T
        </div>
        <span className={`text-[13px] font-semibold tracking-tight ${T.text}`}>
          TAMA<span className="text-[#FF6B00]">.</span>UNIVERSE
        </span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className={`text-[11px] ${T.textMid}`}>v1.0.0</span>
      </div>
    </div>
  )
}