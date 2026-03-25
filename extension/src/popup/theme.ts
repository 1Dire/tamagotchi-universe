// src/popup/theme.ts
export const THEME = {
  dark: {
    // 깊이감 있는 Slate-Grey 계열로 변경하여 눈의 피로도를 낮춤
    bg:         'bg-[#0F1115]',  // 가장 깊은 배경
    surface:    'bg-[#1A1D23]',  // 메인 카드/컨텐츠 영역
    surface2:   'bg-[#242932]',  // 호버 또는 강조 영역
    
    // 경계선은 살짝 더 밝게 하여 가독성 확보
    divider:    'border-[#2D333D]',
    
    // 텍스트 계층 구조 강화
    text:       'text-[#ECEFF4]', // 순수 화이트보다는 살짝 차분한 화이트
    textMid:    'text-[#9BA3AF]', // 설명글이나 비활성 텍스트
    textFaint:  'text-[#4B5563]', // 아주 흐린 텍스트 또는 비활성 요소
    
    // 도구 및 상태창
    toolIdle:   'bg-[#15181E] border-[#2D333D]',
    statBorder: 'border-[#262B35]',
    
    // 버튼 커스텀 (포인트 컬러와의 조화)
    btnGhost:   'border-[#2D333D] text-[#9BA3AF] hover:bg-[#FF6B00]/5 hover:border-[#FF6B00]/30 hover:text-[#FF6B00]',
    charBtn:    'border-[#2D333D] text-[#9BA3AF] hover:border-[#FF6B00]/40 hover:text-[#FF6B00]',
  },
  light: {
    // 기존 라이트 모드 설정 유지 (생략)
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