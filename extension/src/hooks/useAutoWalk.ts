// src/hooks/useAutoWalk.ts
import { useState, useEffect, useRef, useCallback } from "react";

type Anim = "IDLE" | "WALK" | "RUN" | "JUMP" | "HURT";

export interface Platform {
  id:    number;
  x:     number;
  y:     number;
  width: number;
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
const GRAVITY     = 0.5;
const BOUNCE      = 0.1;
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

const getFloorY = (h: number) => window.innerHeight - h - 20;
const getMinX   = () => EDGE_MARGIN;
const getMaxX   = (w: number) => window.innerWidth - w - EDGE_MARGIN;

export function useAutoWalk(
  characterW = 48,
  characterH = 48,
  platforms:  Platform[] = [],
  platOffset  = 0,
  initialX?:  number,
  initialY?:  number,
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

  const isDragging   = useRef(false);
  const isFalling    = useRef(false);
  const isPaused     = useRef(false);
  const velocityY    = useRef(0);
  const animTimerRef = useRef<number | null>(null);
  const rafRef       = useRef<number | null>(null); // ✅ rAF 핸들

  const scheduleBehaviorRef = useRef<() => void>(() => {});
  const startFallingRef     = useRef<() => void>(() => {});

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

  // initialX/Y 복원
  useEffect(() => {
    if (initialX === undefined && initialY === undefined) return;
    isPaused.current = true;
    setState((prev) => ({
      ...prev,
      ...(initialX !== undefined ? { x: initialX } : {}),
      ...(initialY !== undefined ? { screenY: initialY } : {}),
    }));
    requestAnimationFrame(() => {
      isPaused.current = false;
      const { x, screenY } = stateRef.current;
      const offset = platOffsetRef.current;
      const onPlatform = getStandingPlatform(x, screenY, characterW, characterH, platformsRef.current, offset);
      const onFloor    = Math.abs(screenY - getFloorY(characterH)) < LAND_TOL;
      if (!onPlatform && !onFloor) startFallingRef.current();
      else scheduleBehaviorRef.current();
    });
  }, [initialX, initialY, characterW, characterH]);

  // ✅ 메인 루프 — setInterval 대신 rAF, 값 변할 때만 setState
  useEffect(() => {
    let lastTime = 0;

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);

      const dt = now - lastTime;
      if (dt < 16) return; // 60fps 이상 건너뜀
      lastTime = now;

      const { anim, facingLeft, x, screenY } = stateRef.current;

      // 낙하 물리
      if (isFalling.current && !isDragging.current) {
        velocityY.current += GRAVITY;
        const nextY  = screenY + velocityY.current;
        const floor  = getFloorY(characterH);
        const offset = platOffsetRef.current;

        // 플랫폼 착지 체크
        for (const p of platformsRef.current) {
          const xOverlap = x + characterW > p.x + 4 && x < p.x + p.width - 4;
          if (xOverlap && screenY + characterH + offset <= p.y + LAND_TOL && nextY + characterH + offset >= p.y) {
            const bounce = Math.abs(velocityY.current) * BOUNCE;
            if (bounce < 1) {
              velocityY.current = 0;
              isFalling.current = false;
              setState((prev) => ({ ...prev, screenY: p.y - characterH - offset, anim: "IDLE" }));
              scheduleBehaviorRef.current();
            } else {
              velocityY.current = -bounce;
              setState((prev) => ({ ...prev, screenY: p.y - characterH - offset }));
            }
            return;
          }
        }

        // 바닥 착지
        if (nextY >= floor) {
          const bounce = Math.abs(velocityY.current) * BOUNCE;
          if (bounce < 1) {
            velocityY.current = 0;
            isFalling.current = false;
            setState((prev) => ({ ...prev, screenY: floor, anim: "IDLE" }));
            scheduleBehaviorRef.current();
          } else {
            velocityY.current = -bounce;
            setState((prev) => ({ ...prev, screenY: floor }));
          }
          return;
        }

        // ✅ 천장 충돌 — 위로 날아가도 튕겨서 내려옴
        if (nextY < 0) {
          velocityY.current = Math.abs(velocityY.current) * 0.5;
          setState((prev) => ({ ...prev, screenY: 0 }));
          return;
        }

        setState((prev) => ({ ...prev, screenY: nextY }));
        return;
      }

      // 이동
      if (isDragging.current || isPaused.current || isFalling.current) return;
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
        else if (nx !== x)   setState((p) => ({ ...p, x: nx })); // ✅ 변할 때만
      } else {
        const min = getMinX();
        const max = getMaxX(characterW);
        if      (nx <= min) setState((p) => ({ ...p, x: min, facingLeft: false }));
        else if (nx >= max) setState((p) => ({ ...p, x: max, facingLeft: true }));
        else if (nx !== x)  setState((p) => ({ ...p, x: nx })); // ✅ 변할 때만
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [characterW, characterH]);

  // 행동 스케줄 시작
  useEffect(() => {
    scheduleBehavior();
    return () => { if (animTimerRef.current) window.clearTimeout(animTimerRef.current); };
  }, [scheduleBehavior]);

  const startFalling = useCallback(() => {
    isFalling.current = true;
    if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
    setState((prev) => ({ ...prev, anim: "HURT" }));
  }, []);

  startFallingRef.current = startFalling;

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
      localStorage.setItem('tamagotchi_pos_ratio',   String(x / window.innerWidth));
      localStorage.setItem('tamagotchi_pos_ratio_y', String(screenY / window.innerHeight));

      velocityY.current = Math.max(velocityY.current, -8);

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