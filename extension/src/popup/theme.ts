export interface ThemeType {
  bg: string;
  surface: string;
  surface2: string;
  divider: string;
  text: string;
  textMid: string;
  textFaint: string;
  toolIdle: string;
  statBorder: string;
  btnGhost: string;
  charBtn: string;
}

export const THEME: { dark: ThemeType; light: ThemeType } = {
  dark: {
    bg: 'bg-[#121212]',
    surface: 'bg-[#1e1e1e]',
    surface2: 'bg-[#2d2d2d]',
    divider: 'border-[#333333]',
    text: 'text-[#ffffff]',
    textMid: 'text-[#aaaaaa]',
    textFaint: 'text-[#666666]',
    toolIdle: 'bg-[#2a2a2a]',
    statBorder: 'border-[#444444]',
    btnGhost: 'hover:bg-[#333333]',
    charBtn: 'bg-[#3d3d3d] hover:bg-[#4d4d4d]'
  },
  light: {
    bg: 'bg-[#f0f0f0]',
    surface: 'bg-[#ffffff]',
    surface2: 'bg-[#f8f8f8]',
    divider: 'border-[#e0e0e0]',
    text: 'text-[#1a1a1a]',
    textMid: 'text-[#666666]',
    textFaint: 'text-[#999999]',
    toolIdle: 'bg-[#eeeeee]',
    statBorder: 'border-[#cccccc]',
    btnGhost: 'hover:bg-[#f0f0f0]',
    charBtn: 'bg-[#e0e0e0] hover:bg-[#d0d0d0]'
  }
};