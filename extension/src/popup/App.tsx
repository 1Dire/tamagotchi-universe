import { useState, useEffect, useMemo } from 'react';
import { THEME } from '@/popup/theme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CharacterSelect from '@/components/CharacterSelect';

export default function App() {
  // 기본 테마 상태 (초기값: 다크모드)
  // 명시적으로 boolean 타입을 지정하여 타입 안정성을 확보합니다.
  const [dark, setDark] = useState<boolean>(true);

  /**
   * 1. 초기 설정 로드 (Chrome Storage 동기화)
   * 확장 프로그램이 켜질 때 저장된 다크모드 설정을 불러옵니다.
   */
  useEffect(() => {
    // 크롬 확장 프로그램 환경(chrome API 존재 여부)을 확인하는 방어 코드입니다.
    if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
      // 'darkMode' 키로 저장된 값을 가져옵니다.
      chrome.storage.sync.get(['darkMode'], (result) => {
        // 저장된 값이 boolean 타입일 경우에만 상태를 업데이트합니다.
        if (typeof result.darkMode === 'boolean') {
          setDark(result.darkMode);
        }
      });
    }
  }, []);

  /**
   * 2. 다크 모드 토글 핸들러
   * 상태를 변경하고 동시에 Chrome Storage에 저장하여 설정을 유지합니다.
   */
  const toggleDark = () => {
    setDark((prev) => {
      const next = !prev;
      
      // 상태 변경과 함께 스토리지에 저장합니다.
      if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
        chrome.storage.sync.set({ darkMode: next });
      }
      
      return next;
    });
  };

  /**
   * 3. 테마 객체 메모이제이션 (성능 최적화)
   * dark 상태가 변할 때만 THEME 값을 다시 계산하여 불필요한 연산을 줄입니다.
   */
  const T = useMemo(() => (dark ? THEME.dark : THEME.light), [dark]);

  return (
    // 전체 레이아웃: 고정 크기(320x480), 테마 적용, 스크롤 방지, 선택 방지
    <div className={`
      w-[320px] h-[480px] flex flex-col 
      ${T.bg} ${T.text} 
      overflow-hidden select-none transition-colors duration-300
    `}>
      {/* 상단 헤더: 제목 및 상태 표시 */}
      <Header T={T} />
      
      {/* 메인 영역: 캐릭터 선택 리스트 (세로 스크롤 가능) */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <CharacterSelect 
          T={T} 
          // 선택 완료 시 실행될 콜백 함수입니다.
          onConfirm={(id) => console.log('✅ 선택된 다마고치 ID:', id)} 
        />
      </main>
      
      {/* 하단 푸터: 테마 토글 버튼 및 메뉴 */}
      <Footer 
        T={T} 
        dark={dark} 
        onToggleDark={toggleDark} 
      />
    </div>
  );
}