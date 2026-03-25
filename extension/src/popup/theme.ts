// src/popup/theme.ts
export const THEME = {
  dark: {
  bg:      'bg-[#1a1a1a]',  
  surface: 'bg-[#222222]',  
  surface2:'bg-[#2a2a2a]', 
    divider:    'border-[#222]',
    text:       'text-[#F0F0F0]',
    textMid:    'text-[#888]',
    textFaint:  'text-[#444]',
    toolIdle:   'bg-[#111] border-[#222]',
    statBorder: 'border-[#222]',
    btnGhost:   'border-[#222] text-[#888] hover:bg-[#FF6B00]/10 hover:border-[#333]',
    charBtn:    'border-[#222] text-[#888] hover:border-[#FF6B00]/25 hover:text-[#FF6B00]',
  },
  light: {
    bg:         'bg-[#F5F5F5]',
    surface:    'bg-white',
    surface2:   'bg-[#F0F0F0]',
    divider:    'border-[#E5E5E5]',
    text:       'text-[#111]',
    textMid:    'text-[#666]',
    textFaint:  'text-[#999]',
    toolIdle:   'bg-white border-[#E5E5E5]',
    statBorder: 'border-[#E5E5E5]',
    btnGhost:   'border-[#E5E5E5] text-[#666] hover:bg-[#FF6B00]/10 hover:border-[#ccc]',
    charBtn:    'border-[#E5E5E5] text-[#666] hover:border-[#FF6B00]/35 hover:text-[#FF6B00]',
  },
}

export type Theme = typeof THEME.dark