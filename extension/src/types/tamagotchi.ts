// src/types/tamagotchi.ts

/**
 * 1. 애니메이션 프레임 설정
 */
export interface FrameDetail {
  frames: number;
  fps: number;
}

/**
 * 2. 캐릭터 기본 정보
 */
export interface Character {
  id: string;
  pro: boolean;
  anims: string[];
  frameConfig: Record<string, FrameDetail>;
}

/**
 * 3. 다마고치 상태 (Stats)
 */
export interface TamagotchiStats {
  hunger: number;
  happiness: number;
  energy: number;
  level: number;
  exp: number;
}

/**
 * 4. Chrome Storage에 저장될 최종 데이터 형태
 */
export interface TamagotchiData {
  characterId: string;
  stats: TamagotchiStats;
  lastUpdated: number;
}