import React, { useState } from 'react';

const SECTIONS = ['CONCEPT', 'MARKET', 'TARGET', 'USERFLOW', 'FEATURES', 'CHARACTER', 'UIUX', 'PLAZA', 'ARCHITECTURE', 'BUSINESS', 'ROADMAP', 'APPENDIX'];

// 🎨 모던 다크 & 오렌지 팔레트 (사용자 맞춤 가독성 최적화)
const C = {
  bg:         '#050505', // 매우 깊은 블랙 (배경)
  surface:    '#121212', // 어두운 차콜 (기본 카드)
  surfaceDim: '#0a0a0a', // 배경과 카드 사이의 깊이감
  text:       '#F5F5F7', // 깨끗한 화이트 (타이틀)
  textMid:    '#A1A1A6', // 밝은 그레이 (본문)
  textFaint:  '#6E6E73', // 딥 그레이 (부가 설명)
  textGhost:  '#333336', // 비활성/경계 라인
  accent1:    '#FF6B00', // 메인 오렌지
  accent2:    '#FF9500', // 서브 오렌지 (그라데이션용)
  accent3:    '#FF4500', // 딥 오렌지 (강조용)
  rule:       '#222225', // 세련된 구분선
};

export default function App() {
  return (
    <div style={{
      background: C.bg,
      minHeight: '100vh',
      color: C.text,
      fontFamily: '"Pretendard", "Inter", sans-serif',
      overflowX: 'hidden',
    }}>
      <style>{`
        /* 폰트 임포트: 영문은 Inter, 한글은 Pretendard, 코드는 Space Mono */
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(255, 107, 0, 0.3); color: #fff; }
        
        /* 세련된 스크롤바 */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.textFaint}; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.accent1}; }

        /* 타이포그래피 클래스 */
        .font-eng { font-family: 'Inter', sans-serif; letter-spacing: -0.02em; }
        .font-kor { font-family: 'Pretendard', sans-serif; letter-spacing: -0.02em; }
        .font-mono { font-family: 'Space Mono', monospace; letter-spacing: -0.05em; }

        /* 그라데이션 텍스트 유틸리티 */
        .text-gradient {
          background: linear-gradient(135deg, ${C.accent1}, ${C.accent2});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* 애니메이션 */
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 15px rgba(255, 107, 0, 0.2); } 50% { box-shadow: 0 0 30px rgba(255, 107, 0, 0.5); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        /* 모던 카드 컴포넌트 */
        .card {
          background: ${C.surface};
          border: 1px solid ${C.rule};
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          overflow: hidden;
        }
        .card:hover {
          border-color: rgba(255, 107, 0, 0.5);
          box-shadow: 0 10px 40px rgba(255, 107, 0, 0.08);
          transform: translateY(-4px);
        }
        
        /* 강조형 모던 카드 */
        .card-hi {
          background: linear-gradient(180deg, rgba(255,107,0,0.05) 0%, rgba(255,149,0,0.01) 100%);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 16px;
          transition: all 0.3s ease;
          position: relative;
        }
        .card-hi::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, ${C.accent1}, transparent);
        }
        .card-hi:hover {
          border-color: ${C.accent1};
          box-shadow: 0 10px 40px rgba(255, 107, 0, 0.15);
          transform: translateY(-4px);
        }

        /* 배경 블러 효과 */
        .bg-glow {
          position: fixed; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(255, 107, 0, 0.05) 0%, transparent 70%);
          top: -200px; right: -200px; border-radius: 50%; pointer-events: none; z-index: 0;
        }

        a { text-decoration: none; }
      `}</style>

      {/* Background Ambience */}
      <div className="bg-glow"></div>

      {/* 🟢 TOP NAVIGATION */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid rgba(255, 107, 0, 0.2)`,
        padding: '0 40px', height: 64,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span className="font-eng" style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
          TAMA<span className="text-gradient">.UNIVERSE</span>
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {SECTIONS.map(s => (
            <a key={s} href={`#${s}`} className="font-eng"
              style={{ 
                padding: '6px 12px', fontSize: 11, fontWeight: 500, color: C.textMid, 
                borderRadius: '20px', transition: 'all 0.2s' 
              }}
              onMouseEnter={e => { e.target.style.color = C.text; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.target.style.color = C.textMid; e.target.style.background = 'transparent'; }}
            >{s}</a>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 36px', position: 'relative', zIndex: 1 }}>

        {/* ══ HERO SECTION ══ */}
        <section style={{ paddingTop: 180, paddingBottom: 120 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 60, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 500px' }}>
              
              <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="font-eng" style={{
                  background: `rgba(255, 107, 0, 0.1)`, color: C.accent1, border: `1px solid rgba(255, 107, 0, 0.3)`,
                  fontSize: 11, fontWeight: 600, padding: '6px 16px', borderRadius: '20px'
                }}>PRODUCT SPEC v3.0</span>
                {['Chrome Extension', 'Dev-Companion', 'Utility & Social'].map(t => (
                  <span key={t} className="font-eng" style={{ fontSize: 11, padding: '6px 14px', borderRadius: '20px', border: `1px solid ${C.rule}`, color: C.textMid }}>{t}</span>
                ))}
              </div>

              <h1 className="font-eng" style={{ fontSize: 'clamp(40px, 6vw, 56px)', fontWeight: 800, lineHeight: 1.1, color: C.text, marginBottom: 8 }}>
                TAMAGOTCHI
              </h1>
              <h1 className="font-eng text-gradient" style={{ fontSize: 'clamp(40px, 6vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 32 }}>
                UNIVERSE
              </h1>

              <p className="font-kor" style={{ fontSize: 18, color: C.textMid, lineHeight: 1.6, maxWidth: 500, marginBottom: 48, fontWeight: 400 }}>
                AI 코드 생성을 기다리는 찰나의 시간, <br />
                당신의 데스크탑에 <span style={{ color: C.text, fontWeight: 600 }}>감성적인 인터랙션</span>과 <span style={{ color: C.text, fontWeight: 600 }}>강력한 유틸리티</span>를 더하는 올인원 개발 컴패니언.
              </p>

              <div style={{ display: 'flex', gap: 16 }}>
                {[['5', 'CORE TOOLS'], ['∞', 'REACTIONS'], ['2.5D', 'PLAZA']].map(([n, l]) => (
                  <div key={l} style={{ flex: 1, padding: '24px', background: C.surface, borderRadius: '16px', border: `1px solid ${C.rule}` }}>
                    <div className="font-eng" style={{ fontSize: 24, fontWeight: 700, color: C.accent1, marginBottom: 8 }}>{n}</div>
                    <div className="font-eng" style={{ fontSize: 11, color: C.textFaint, fontWeight: 500, letterSpacing: '0.05em' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SLEEK MASCOT ORB */}
            <div style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
              <div style={{
                width: 280, height: 280, borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${C.surface}, ${C.bg})`,
                border: `1px solid rgba(255, 107, 0, 0.2)`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.5), inset 0 0 40px rgba(255, 107, 0, 0.1)`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                animation: 'float 6s ease-in-out infinite, pulseGlow 4s ease-in-out infinite',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '15%', right: '20%', width: 8, height: 8, borderRadius: '50%', background: C.accent1, boxShadow: `0 0 10px ${C.accent1}` }} />
                <span className="font-mono" style={{ fontSize: 32, color: C.text, fontWeight: 700, opacity: 0.9 }}>
                  ( •_• )<br />
                </span>
                <span className="font-eng text-gradient" style={{ fontSize: 12, fontWeight: 600, marginTop: 16, letterSpacing: '0.2em' }}>
                  AWAITING INPUT
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div style={{ overflow: 'hidden', borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}`, padding: '20px 0', marginBottom: 120 }}>
          <div style={{ display: 'flex', animation: 'marquee 25s linear infinite', width: 'max-content' }}>
            {[...Array(2)].map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 64, paddingRight: 64, whiteSpace: 'nowrap' }}>
                {['COLOR EXTRACTOR', 'PIXEL RULER', 'AI TRANSLATOR', 'SITE ANALYZER', 'FONT INSPECTOR', 'LIVE COMPANION', 'GLOBAL PLAZA'].map(t => (
                  <span key={t} className="font-eng" style={{ fontSize: 12, fontWeight: 600, color: C.textGhost, letterSpacing: '0.1em' }}>{t}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ══ 01. CONCEPT ══ */}
        <section id="CONCEPT" style={{ marginBottom: 120 }}>
          <SL num="01" label="CONCEPT & BACKGROUND" />
          <h2 className="font-kor" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: C.text, marginBottom: 20 }}>기획 배경 및 핵심 컨셉</h2>
          <p className="font-kor" style={{ color: C.textMid, fontSize: 16, marginBottom: 56, maxWidth: 600, lineHeight: 1.6 }}>
            AI 기반 코드 생성 도구의 확산으로 발생하는 '미세한 대기 시간'을 타겟팅합니다. <br />단순한 유틸리티를 넘어, 데스크탑 환경에 감성적인 몰입감을 제공합니다.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { title: 'Micro-Wait Time 활용', desc: 'Copilot, Cursor 등 AI 도구가 코드를 생성하고 빌드하는 3~30초의 공백을 시각적 즐거움으로 채웁니다.' },
              { title: 'Companion + Utility', desc: '생산성을 강요하지 않습니다. 눈이 즐거운 컴패니언이자, 필요할 때 즉시 꺼내 쓰는 프론트엔드 도구 세트입니다.' },
              { title: 'Organic Interaction', desc: '사용자가 보고 있는 웹사이트의 컨텍스트, 추출한 컬러 등 모든 행동이 캐릭터의 리액션으로 직결됩니다.' },
            ].map(({ title, desc }) => (
              <div key={title} className="card" style={{ padding: 32 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: C.accent1, marginBottom: 24, boxShadow: `0 0 10px ${C.accent1}` }} />
                <h3 className="font-eng" style={{ fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 12 }}>{title}</h3>
                <p className="font-kor" style={{ fontSize: 15, color: C.textMid, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 02. MARKET ══ */}
        <section id="MARKET" style={{ marginBottom: 120 }}>
          <SL num="02" label="MARKET POSITIONING" />
          <h2 className="font-kor" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: C.text, marginBottom: 20 }}>시장 포지셔닝</h2>
          <p className="font-kor" style={{ color: C.textMid, fontSize: 16, marginBottom: 48, maxWidth: 600, lineHeight: 1.6 }}>
            기존의 파편화된 익스텐션 툴들을 하나의 세련된 UI로 통합하고, '캐릭터'라는 강력한 후킹 요소를 결합하여 독보적인 위치를 선점합니다.
          </p>

          <div className="card" style={{ overflowX: 'auto', marginBottom: 48, padding: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: C.surfaceDim }}>
                  {['기능 분류', '단일 유틸리티 (ColorZilla 등)', '개발자 도구 (DevTools)', 'TAMA. UNIVERSE'].map((h, i) => (
                    <th key={i} className="font-kor" style={{ padding: '20px 24px', color: i === 3 ? C.accent1 : C.textMid, fontSize: 14, fontWeight: 600, borderBottom: `1px solid ${C.rule}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['접근성 / 속도', '빠름 (클릭 1~2회)', '느림 (패널 오픈, 탐색 필요)', '매우 빠름 (오버레이 즉시 실행)'],
                  ['기능 통합 (All-in-One)', '불가 (기능별 개별 설치)', '가능 (단, UI가 무거움)', '가능 (5대 핵심 기능 통합)'],
                  ['감성 / 사용자 경험', '단순 목적 달성 후 이탈', '딱딱하고 전문적임', '캐릭터 리액션으로 체류 유도'],
                ].map((row, ri) => (
                  <tr key={ri} style={{ transition: 'background 0.2s', ':hover': { background: C.surfaceDim } }}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="font-kor" style={{ padding: '20px 24px', borderBottom: ri < 2 ? `1px solid ${C.rule}` : 'none', color: ci === 3 ? C.text : C.textFaint, fontSize: 14, fontWeight: ci === 3 ? 500 : 400 }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══ 03. TARGET ══ */}
        <section id="TARGET" style={{ marginBottom: 120 }}>
          <SL num="03" label="TARGET PERSONA" />
          <h2 className="font-kor" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: C.text, marginBottom: 40 }}>타겟 페르소나</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { label: 'PRIMARY TARGET', title: 'AI-Assisted Developer', desc: '생성형 AI로 코드를 작성하며 잦은 대기 시간을 경험하는 프론트엔드/풀스택 개발자. 빠르고 직관적인 돔(DOM) 인스펙팅 도구를 선호합니다.', hi: true },
              { label: 'SECONDARY TARGET', title: 'Product Designer', desc: '레퍼런스 사이트를 분석하고 벤치마킹하는 UI/UX 디자이너. 개발자 도구의 복잡함 없이 즉시 폰트와 컬러, 간격을 추출하길 원합니다.', hi: false },
              { label: 'TERTIARY TARGET', title: 'Desk-terior Enthusiast', desc: '귀엽고 트렌디한 데스크탑 환경을 꾸미기 좋아하는 사용자. 유틸리티의 필요성보다는 캐릭터와의 상호작용 자체에 매력을 느낍니다.', hi: false },
            ].map(({ label, title, desc, hi }) => (
              <div key={title} className={hi ? 'card-hi' : 'card'} style={{ padding: 36 }}>
                <div className="font-eng text-gradient" style={{ fontSize: 11, fontWeight: 700, marginBottom: 16 }}>{label}</div>
                <h3 className="font-eng" style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 16 }}>{title}</h3>
                <p className="font-kor" style={{ fontSize: 15, color: C.textMid, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 04. USER FLOW ══ */}
        <section id="USERFLOW" style={{ marginBottom: 120 }}>
          <SL num="04" label="EXPERIENCE FLOW" />
          <h2 className="font-kor" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: C.text, marginBottom: 40 }}>핵심 경험 플로우</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { phase: '01. Discovery & Install', title: '첫 만남', desc: '크롬 웹스토어 원클릭 설치 후, 브라우저 우측 하단에 조용히 렌더링되는 캐릭터 컴패니언 발견.' },
              { phase: '02. Micro-Interaction', title: '대기 시간의 활용', desc: 'AI 코드 빌드 대기 중 심심함에 캐릭터 클릭 → 세련된 래디얼(Radial) 메뉴가 오버레이로 부드럽게 펼쳐짐.' },
              { phase: '03. Utility Execution', title: '직관적인 도구 사용', desc: '컬러 피커 등 유틸리티 사용. 요소 추출 시 캐릭터가 해당 컬러나 폰트에 맞는 실시간 애니메이션 리액션 제공.' },
              { phase: '04. Social Expansion', title: '플라자 생태계 진입', desc: '익스텐션에 누적된 사용자 데이터(추출한 팔레트, 레벨)를 기반으로 3D 글로벌 플라자에 입장하여 타 유저와 소통.' },
            ].map((step, i) => (
              <div key={i} className="card" style={{ display: 'flex', padding: 0 }}>
                <div style={{ width: 120, background: C.surfaceDim, padding: 32, display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.rule}` }}>
                  <span className="font-eng" style={{ fontSize: 32, fontWeight: 800, color: C.textGhost }}>0{i+1}</span>
                </div>
                <div style={{ padding: 32, flex: 1 }}>
                  <div className="font-eng text-gradient" style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{step.phase}</div>
                  <h3 className="font-kor" style={{ fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 12 }}>{step.title}</h3>
                  <p className="font-kor" style={{ fontSize: 15, color: C.textMid, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 05. FEATURES ══ */}
        <section id="FEATURES" style={{ marginBottom: 120 }}>
          <SL num="05" label="CORE FEATURES" />
          <h2 className="font-kor" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: C.text, marginBottom: 20 }}>5대 핵심 유틸리티</h2>
          <p className="font-kor" style={{ color: C.textMid, fontSize: 16, marginBottom: 48, maxWidth: 600, lineHeight: 1.6 }}>
            디자인 추출과 웹 분석에 특화된 5가지 툴. 각각의 툴은 캐릭터의 고유한 리액션과 맞물려 작동합니다.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {[
              { title: 'Color Extractor', kor: '스마트 컬러 피커', desc: '화면 내 픽셀 클릭 시 HEX/RGB를 즉시 추출 및 복사. 추출된 색상은 나만의 글로벌 팔레트에 저장되며 캐릭터 테마에 즉각 반영됩니다.', tags: ['#HEX/RGB', '#Palette Sync'] },
              { title: 'Pixel Ruler', kor: '라이브 픽셀 자', desc: 'DOM 요소 위에 마우스를 올리면 Width, Height, Margin, Padding 치수가 세련된 툴팁으로 표시됩니다. 디자인 QA 속도를 혁신적으로 단축합니다.', tags: ['#Box Model', '#Realtime'] },
              { title: 'AI Translator', kor: '컨텍스트 번역기', desc: '드래그한 텍스트의 맥락을 파악해 화면 오버레이 말풍선으로 번역 결과를 제공합니다. 개발 문서 번역에 최적화되어 있습니다.', tags: ['#OpenAI', '#Contextual'] },
              { title: 'Site Analyzer', kor: '기술 스택 탐지기', desc: '현재 접속 중인 웹페이지의 프레임워크와 기술 스택을 사이드 패널에 분석해냅니다. 탐지된 스택에 따라 캐릭터가 코스튬을 갈아입습니다.', tags: ['#Tech Stack', '#React/Vue'] },
              { title: 'Font Inspector', kor: '폰트 인스펙터', desc: '클릭 한 번으로 웹폰트 패밀리, 사이즈, 웨이트, 행간을 스캔하여 복사 가능한 형태로 제공합니다.', tags: ['#Typography', '#CSS Copy'] },
            ].map(({ title, kor, desc, tags }, i) => (
              <div key={title} className={i === 0 ? "card-hi" : "card"} style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <h3 className="font-eng" style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 6 }}>{title}</h3>
                    <span className="font-kor" style={{ fontSize: 13, color: C.textFaint }}>{kor}</span>
                  </div>
                </div>
                <p className="font-kor" style={{ fontSize: 14, color: C.textMid, lineHeight: 1.6, flex: 1, marginBottom: 24 }}>{desc}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {tags.map(t => <span key={t} className="font-eng" style={{ fontSize: 11, padding: '6px 12px', background: C.surfaceDim, borderRadius: '6px', color: C.accent1 }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 06. ARCHITECTURE ══ */}
        <section id="ARCHITECTURE" style={{ marginBottom: 120 }}>
          <SL num="06" label="SYSTEM ARCHITECTURE" />
          <h2 className="font-kor" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: C.text, marginBottom: 40 }}>기술 아키텍처</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
            <div className="card" style={{ padding: 32 }}>
              <div className="font-eng text-gradient" style={{ fontSize: 12, fontWeight: 700, marginBottom: 24 }}>FRONTEND (EXTENSION)</div>
              <ul style={{ listStyle: 'none' }}>
                {[
                  { k: 'Framework', v: 'React 18 + Vite (CRXJS)' },
                  { k: 'Styling', v: 'Tailwind CSS + Framer Motion' },
                  { k: 'State', v: 'Zustand + Chrome Sync Storage' },
                  { k: 'Graphics', v: 'Canvas API / Lottie Animations' }
                ].map(item => (
                  <li key={item.k} style={{ display: 'flex', borderBottom: `1px solid ${C.rule}`, padding: '12px 0' }}>
                    <span className="font-eng" style={{ width: 100, color: C.textFaint, fontSize: 13 }}>{item.k}</span>
                    <span className="font-eng" style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{item.v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <div className="font-eng text-gradient" style={{ fontSize: 12, fontWeight: 700, marginBottom: 24 }}>BACKEND (PLAZA & AI)</div>
              <ul style={{ listStyle: 'none' }}>
                {[
                  { k: 'Server', v: 'Node.js (Express)' },
                  { k: 'Realtime', v: 'Socket.io (Redis Adapter)' },
                  { k: 'Database', v: 'MongoDB (Mongoose)' },
                  { k: 'AI Layer', v: 'OpenAI API (GPT-4o-mini)' }
                ].map(item => (
                  <li key={item.k} style={{ display: 'flex', borderBottom: `1px solid ${C.rule}`, padding: '12px 0' }}>
                    <span className="font-eng" style={{ width: 100, color: C.textFaint, fontSize: 13 }}>{item.k}</span>
                    <span className="font-eng" style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{item.v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ══ 07. BUSINESS ══ */}
        <section id="BUSINESS" style={{ marginBottom: 120 }}>
          <SL num="07" label="BUSINESS MODEL" />
          <h2 className="font-kor" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: C.text, marginBottom: 20 }}>수익 모델 (Freemium)</h2>
          <p className="font-kor" style={{ color: C.textMid, fontSize: 16, marginBottom: 48, maxWidth: 600, lineHeight: 1.6 }}>
            도구의 본질적인 기능은 100% 무료로 제공하여 압도적인 활성 사용자를 확보합니다. 수익은 캐릭터 커스터마이징과 프리미엄 소셜 기능에서 창출됩니다.
          </p>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { tier: 'FREE TIER', price: '$0', target: '일반 사용자', items: ['5대 핵심 도구 무제한 사용', '기본 캐릭터 (오리지널)', '글로벌 플라자 접속 (퍼블릭 룸)'] },
              { tier: 'PRO TIER', price: '$3.99', target: '월구독', items: ['고급 캐릭터 해금 (사이버펑크, 닌자 등)', '무제한 AI 번역 쿼리', '플라자 프라이빗 룸 생성 권한', '프리미엄 전용 이펙트'], hi: true }
            ].map((plan, i) => (
              <div key={plan.tier} className={plan.hi ? 'card-hi' : 'card'} style={{ flex: 1, minWidth: 300, padding: 40 }}>
                <div className="font-eng" style={{ fontSize: 13, fontWeight: 700, color: plan.hi ? C.accent1 : C.textFaint, marginBottom: 8 }}>{plan.tier}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 32 }}>
                  <span className="font-eng" style={{ fontSize: 40, fontWeight: 800, color: C.text }}>{plan.price}</span>
                  <span className="font-kor" style={{ fontSize: 14, color: C.textFaint }}>{plan.target}</span>
                </div>
                <ul style={{ listStyle: 'none' }}>
                  {plan.items.map((item, j) => (
                    <li key={j} className="font-kor" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, color: C.textMid, fontSize: 15 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={plan.hi ? C.accent1 : C.textGhost} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: `1px solid ${C.rule}`, paddingTop: 40, paddingBottom: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div className="font-eng" style={{ fontSize: 18, fontWeight: 800, color: C.text }}>
            TAMA<span style={{ color: C.accent1 }}>.UNIVERSE</span>
          </div>
          <div className="font-eng" style={{ fontSize: 12, color: C.textFaint, fontWeight: 500 }}>
            CONFIDENTIAL PRODUCT SPECIFICATION © 2026
          </div>
        </footer>

      </div>
    </div>
  );
}

// Section Label Component
function SL({ num, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
      <span className="font-eng text-gradient" style={{ fontSize: 14, fontWeight: 700 }}>{num}</span>
      <div style={{ height: 1, width: 40, background: `linear-gradient(90deg, ${C.accent1}, transparent)` }} />
      <span className="font-eng" style={{ fontSize: 12, fontWeight: 600, color: C.textFaint, letterSpacing: '0.1em' }}>{label}</span>
    </div>
  );
}