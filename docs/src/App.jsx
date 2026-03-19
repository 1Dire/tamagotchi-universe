import React, { useState, useEffect } from 'react';

// @ 별칭을 사용한 이미지 임포트
import overviewImg from '@/assets/img/image1.png'; 
import plazaImg from '@/assets/img/image2.png';    
import radialMenuImg from '@/assets/img/image3.png'; 

const App = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen transition-colors duration-700 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 font-sans selection:bg-amber-500/30">
      
      {/* --- 테마 토글 버튼 --- */}
      <div className="fixed top-8 right-8 z-50">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="group flex items-center gap-3 px-6 py-3 rounded-full border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-2xl hover:border-amber-500/50 transition-all duration-300"
        >
          <span className="text-xl transition-transform group-hover:rotate-12">{isDark ? '☀️' : '🌙'}</span>
          <span className="font-black text-xs tracking-[0.2em] text-slate-800 dark:text-slate-100">
            {isDark ? 'LIGHT' : 'DARK'}
          </span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 space-y-40">
        
        {/* --- Header Section --- */}
        <header className="relative space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-amber-600 dark:text-amber-400 uppercase">
              Project Specification v1.5
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white">
            2.5D AI <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              TAMAGOTCHI
            </span> PLAZA
          </h1>
          <p className="max-w-2xl text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            단순한 도구를 넘어 브라우저 화면 위에서 살아 숨 쉬는 자율형 동반자와 함께하는 차세대 멀티플레이어 플랫폼.
          </p>
        </header>

        {/* --- 01. Overview --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-2xl">
              <img src={overviewImg} alt="Overview" className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
          <div className="space-y-6">
            <span className="text-amber-500 font-mono text-sm tracking-widest">01 / CONCEPT</span>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">아바타의 자율 지능</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              사용자가 업무에 집중하는 동안 캐릭터는 화면 구석구석을 탐험합니다. 때로는 장난을 치고, 유용한 정보를 제안하며 정서적인 유대감을 형성합니다.
            </p>
          </div>
        </section>

        {/* --- 02. Core Features (Plaza) --- */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <span className="text-amber-500 font-mono text-sm tracking-widest">02 / EXPERIENCE</span>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">멀티플레이어 연회장</h3>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-2xl">
            <img src={plazaImg} alt="Plaza" className="w-full aspect-[21/9] object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
          </div>
        </section>

        {/* --- 03. Infrastructure (자네가 요청한 핵심 섹션!) --- */}
        <section className="space-y-12">
          <div className="max-w-3xl">
            <span className="text-amber-500 font-mono text-sm tracking-widest uppercase">03 / Infrastructure</span>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-4 mb-6">시스템 아키텍처 및 기반 시설</h3>
            <p className="text-slate-600 dark:text-slate-400">
              실시간 동기화와 AI 추론을 위한 강력한 서버 환경을 구축합니다. 끊김 없는 경험을 제공하기 위한 기술적 뿌리입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfraCard 
              icon="⚡" 
              title="Real-time Node Server" 
              desc="Socket.io 기반의 초저지연 양방향 통신 서버를 통해 수천 명의 위치를 동기화합니다." 
              tech="Node.js, Socket.io"
            />
            <InfraCard 
              icon="🧠" 
              title="AI Edge Computing" 
              desc="LLM API 응답 속도 최적화를 위한 벡터 DB 및 미들웨어 캐싱 계층을 운영합니다." 
              tech="OpenAI, Pinecone"
            />
            <InfraCard 
              icon="🗄️" 
              title="State Database" 
              desc="캐릭터의 상태와 유저 데이터를 안전하게 보관하고 빠른 읽기를 지원합니다." 
              tech="Redis, MongoDB"
            />
          </div>
        </section>

        {/* --- 04. Interaction UX --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <span className="text-amber-500 font-mono text-sm tracking-widest uppercase">04 / Interaction</span>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">전술 도구 및 상호작용</h3>
            <div className="grid gap-4">
              <FeatureItem title="Radial Menu System" desc="캐릭터 중심의 인터페이스로 즉각적인 도구 활용." />
              <FeatureItem title="Context Aware AI" desc="페이지 내용을 분석하여 지능형 비서 역할 수행." />
            </div>
          </div>
          <div className="order-1 lg:order-2 group">
             <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-2xl">
                <img src={radialMenuImg} alt="Interaction" className="w-full aspect-square object-cover group-hover:rotate-2 transition-transform duration-700" />
             </div>
          </div>
        </section>

        {/* --- Roadmap --- */}
        <section className="py-20 border-y border-slate-200 dark:border-white/5 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Roadmap</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RoadmapStep phase="01" title="Infra & Server" isDone={true} />
            <RoadmapStep phase="02" title="Interaction" isDone={false} />
            <RoadmapStep phase="03" title="AI Integration" isDone={false} />
            <RoadmapStep phase="04" title="Plaza Open" isDone={false} />
          </div>
        </section>

        <footer className="text-center opacity-30 pb-12">
          <p className="text-xs font-mono tracking-[0.5em] uppercase">Proprietary & Confidential © 2026</p>
        </footer>
      </div>
    </div>
  );
};

// --- Sub Components ---
const InfraCard = ({ icon, title, desc, tech }) => (
  <div className="group p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white/5 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-300">
    <div className="text-3xl mb-6">{icon}</div>
    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h4>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{desc}</p>
    <div className="text-[10px] font-bold tracking-widest text-amber-600 dark:text-amber-500 uppercase">{tech}</div>
  </div>
);

const FeatureItem = ({ title, desc }) => (
  <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5 hover:border-amber-500/30 transition-all">
    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h4>
    <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
  </div>
);

const RoadmapStep = ({ phase, title, isDone }) => (
  <div className={`relative p-8 rounded-[2rem] border transition-all duration-500 ${isDone ? 'bg-amber-500 text-white border-amber-600 shadow-xl shadow-amber-500/20' : 'bg-transparent border-slate-200 dark:border-white/10'}`}>
    <span className={`text-[10px] font-black tracking-widest uppercase mb-4 block ${isDone ? 'text-white/70' : 'text-slate-400'}`}>Phase {phase}</span>
    <h4 className="text-xl font-bold tracking-tight">{title}</h4>
  </div>
);

export default App;