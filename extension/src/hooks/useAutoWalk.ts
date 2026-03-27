// src/hooks/useAutoWalk.ts
import { useState, useEffect, useRef, useCallback } from "react";

type Anim = "IDLE" | "WALK" | "RUN" | "JUMP" | "HURT";

export interface Platform {
  id:     number;
  x:      number;
  y:      number;
  width:  number;
}

interface CatState {
  x:          number;
  screenY:    number;
  anim:       Anim;
  facingLeft: boolean;
}

const BEHAVIOR_DURATION: Partial<Record<Anim, [number, number]>> = {
  IDLE: [1500, 4000],
  WALK: [2000, 5000],
  RUN:  [1000, 2500],
  JUMP: [600,  600],
};

const SPEED: Record<Anim, number> = {
  IDLE: 0, WALK: 1.2, RUN: 2.8, JUMP: 0, HURT: 0,
};

const EDGE_MARGIN = 20;
const GRAVITY     = 0.6;
const BOUNCE      = 0.2;
const LAND_TOL    = 8;

function pickNextAnim(): Anim {
  const r = Math.random();
  if (r < 0.35) return "IDLE";
  if (r < 0.75) return "WALK";
  if (r < 0.93) return "RUN";
  return "JUMP";
}

function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getStandingPlatform(
  catX: number, catY: number, catW: number, catH: number,
  platforms: Platform[], offset: number
): Platform | null {
  const catBottom = catY + catH + offset;
  for (const p of platforms) {
    if (catX + catW > p.x + 4 && catX < p.x + p.width - 4 && Math.abs(catBottom - p.y) <= LAND_TOL) {
      return p;
    }
  }
  return null;
}

// 자주 쓰는 계산 인라인 함수
const getFloorY   = (h: number) => window.innerHeight - h - 20;
const getMinX     = () => EDGE_MARGIN;
const getMaxX     = (w: number) => window.innerWidth - w - EDGE_MARGIN;

export function useAutoWalk(
  characterW = 48,
  characterH = 48,
  platforms:  Platform[] = [],
  platOffset  = 0,
  initialX?:  number
) {
  const platformsRef    = useRef(platforms);
  platformsRef.current  = platforms;
  const platOffsetRef   = useRef(platOffset);
  platOffsetRef.current = platOffset;

  const [state, setState] = useState<CatState>(() => ({
    x:          getMaxX(characterW),
    screenY:    getFloorY(characterH),
    anim:       "IDLE",
    facingLeft: false,
  }));

  const stateRef    = useRef(state);
  stateRef.current  = state;

  const isDragging  = useRef(false);
  const isFalling   = useRef(false);
  const isPaused    = useRef(false);
  const velocityY   = useRef(0);
  const animTimerRef = useRef<number | null>(null);
  const moveTimerRef = useRef<number | null>(null);
  const fallTimerRef = useRef<number | null>(null);

  const scheduleBehaviorRef = useRef<() => void>(() => {});
  scheduleBehaviorRef.current = () => {
    if (isFalling.current || isPaused.current) return;
    const next = pickNextAnim();
    const [min, max] = BEHAVIOR_DURATION[next] ?? [1000, 2000];
    const duration   = randBetween(min, max);

    if (next === "JUMP") {
      setState((prev) => ({ ...prev, anim: "JUMP" }));
      animTimerRef.current = window.setTimeout(() => {
        setState((prev) => ({ ...prev, anim: "IDLE" }));
        scheduleBehaviorRef.current();
      }, duration);
      return;
    }

    setState((prev) => ({ ...prev, anim: next, facingLeft: Math.random() < 0.5 }));
    animTimerRef.current = window.setTimeout(() => scheduleBehaviorRef.current(), duration);
  };

  const scheduleBehavior = useCallback(() => scheduleBehaviorRef.current(), []);

  // initialX 복원 — isPaused로 walk 잠깐 멈추고 적용
  useEffect(() => {
    if (initialX === undefined) return;
    isPaused.current = true;
    setState((prev) => ({ ...prev, x: initialX }));
    requestAnimationFrame(() => {
      isPaused.current = false;
      scheduleBehaviorRef.current();
    });
  }, [initialX]);

  // 이동 루프
  useEffect(() => {
    const tick = () => {
      if (isDragging.current || isFalling.current || isPaused.current) return;
      const { anim, facingLeft, x, screenY } = stateRef.current;
      const speed = SPEED[anim];
      if (speed === 0) return;

      const offset   = platOffsetRef.current;
      const platform = getStandingPlatform(x, screenY, characterW, characterH, platformsRef.current, offset);
      const nx       = facingLeft ? x - speed : x + speed;

      if (platform) {
        const pMin = platform.x;
        const pMax = platform.x + platform.width - characterW;
        if      (nx <= pMin) setState((p) => ({ ...p, x: pMin, facingLeft: false }));
        else if (nx >= pMax) setState((p) => ({ ...p, x: pMax, facingLeft: true }));
        else                 setState((p) => ({ ...p, x: nx }));
      } else {
        const min = getMinX();
        const max = getMaxX(characterW);
        if      (nx <= min) setState((p) => ({ ...p, x: min, facingLeft: false }));
        else if (nx >= max) setState((p) => ({ ...p, x: max, facingLeft: true }));
        else                setState((p) => ({ ...p, x: nx }));
      }
    };

    moveTimerRef.current = window.setInterval(tick, 1000 / 60);
    return () => { if (moveTimerRef.current) window.clearInterval(moveTimerRef.current); };
  }, [characterW, characterH]);

  // 행동 스케줄 시작
  useEffect(() => {
    scheduleBehavior();
    return () => { if (animTimerRef.current) window.clearTimeout(animTimerRef.current); };
  }, [scheduleBehavior]);

  // 낙하 물리
  const startFalling = useCallback(() => {
    isFalling.current = true;
    setState((prev) => ({ ...prev, anim: "HURT" }));
    if (fallTimerRef.current) window.clearInterval(fallTimerRef.current);

    fallTimerRef.current = window.setInterval(() => {
      velocityY.current += GRAVITY;
      setState((prev) => {
        const offset = platOffsetRef.current;
        const nextY  = prev.screenY + velocityY.current;
        const floor  = getFloorY(characterH);

        for (const p of platformsRef.current) {
          const xOverlap = prev.x + characterW > p.x + 4 && prev.x < p.x + p.width - 4;
          if (xOverlap && prev.screenY + characterH + offset <= p.y + LAND_TOL && nextY + characterH + offset >= p.y) {
            const bounce = Math.abs(velocityY.current) * BOUNCE;
            if (bounce < 1) {
              velocityY.current = 0;
              isFalling.current = false;
              if (fallTimerRef.current) window.clearInterval(fallTimerRef.current);
              scheduleBehavior();
              return { ...prev, screenY: p.y - characterH - offset, anim: "IDLE" };
            }
            velocityY.current = -bounce;
            return { ...prev, screenY: p.y - characterH - offset };
          }
        }

        if (nextY >= floor) {
          const bounce = Math.abs(velocityY.current) * BOUNCE;
          if (bounce < 1) {
            velocityY.current = 0;
            isFalling.current = false;
            if (fallTimerRef.current) window.clearInterval(fallTimerRef.current);
            scheduleBehavior();
            return { ...prev, screenY: floor, anim: "IDLE" };
          }
          velocityY.current = -bounce;
          return { ...prev, screenY: floor };
        }

        return { ...prev, screenY: nextY };
      });
    }, 1000 / 60);
  }, [characterW, characterH, scheduleBehavior]);

  const pause = useCallback(() => {
    isPaused.current = true;
    if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
    setState((prev) => ({ ...prev, anim: "IDLE" }));
  }, []);

  const resume = useCallback(() => {
    isPaused.current = false;
    scheduleBehavior();
  }, [scheduleBehavior]);

  const checkFall = useCallback(() => {
    if (isDragging.current || isFalling.current) return;
    const { x, screenY } = stateRef.current;
    const offset     = platOffsetRef.current;
    const onPlatform = getStandingPlatform(x, screenY, characterW, characterH, platformsRef.current, offset);
    const onFloor    = Math.abs(screenY - getFloorY(characterH)) < LAND_TOL;
    if (!onPlatform && !onFloor) startFalling();
  }, [characterW, characterH, startFalling]);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) return;
    e.preventDefault();
    isDragging.current = true;
    isFalling.current  = false;
    velocityY.current  = 0;
    if (fallTimerRef.current) window.clearInterval(fallTimerRef.current);
    if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
    setState((prev) => ({ ...prev, anim: "IDLE" }));

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startCharX  = stateRef.current.x;
    const startCharY  = stateRef.current.screenY;
    let prevY    = startCharY;
    let prevTime = Date.now();

    const onMouseMove = (me: MouseEvent) => {
      const nx  = Math.max(getMinX(), Math.min(me.clientX - startMouseX + startCharX, getMaxX(characterW)));
      const ny  = Math.max(0, Math.min(me.clientY - startMouseY + startCharY, getFloorY(characterH)));
      const now = Date.now();
      const dt  = Math.max(1, now - prevTime);
      velocityY.current = ((ny - prevY) / dt) * 16;
      prevY    = ny;
      prevTime = now;
      setState((prev) => ({ ...prev, x: nx, screenY: ny }));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);

      const { x, screenY } = stateRef.current;

      // 비율로 저장 — 화면 크기가 달라도 근사 위치 복원
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.sync.set({ tamagotchi_pos_ratio: x / window.innerWidth });
      }

      const offset     = platOffsetRef.current;
      const onPlatform = getStandingPlatform(x, screenY, characterW, characterH, platformsRef.current, offset);
      const onFloor    = Math.abs(screenY - getFloorY(characterH)) < LAND_TOL;
      if (!onPlatform && !onFloor) startFalling();
      else scheduleBehavior();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
  }, [characterW, characterH, scheduleBehavior, startFalling]);

  return { ...state, onDragStart, pause, resume, checkFall };
}