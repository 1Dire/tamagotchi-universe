// src/hooks/useAutoWalk.ts
import { useState, useEffect, useRef, useCallback } from "react";

type Anim = "IDLE" | "WALK" | "RUN" | "JUMP" | "HURT";

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

export function useAutoWalk(characterW = 48, characterH = 48) {
  const floorY = useCallback(() => window.innerHeight - characterH - 20, [characterH]);
  const minX   = useCallback(() => EDGE_MARGIN, []);
  const maxX   = useCallback(() => window.innerWidth - characterW - EDGE_MARGIN, [characterW]);

  const [state, setState] = useState<CatState>(() => ({
    x:          window.innerWidth - characterW - EDGE_MARGIN,
    screenY:    window.innerHeight - characterH - 20,
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

  const scheduleBehavior = useCallback(() => {
    if (isFalling.current || isPaused.current) return;
    const next     = pickNextAnim();
    const [min, max] = BEHAVIOR_DURATION[next] ?? [1000, 2000];
    const duration = randBetween(min, max);

    if (next === "JUMP") {
      setState((prev) => ({ ...prev, anim: "JUMP" }));
      animTimerRef.current = window.setTimeout(() => {
        setState((prev) => ({ ...prev, anim: "IDLE" }));
        scheduleBehavior();
      }, duration);
      return;
    }

    setState((prev) => ({ ...prev, anim: next, facingLeft: Math.random() < 0.5 }));
    animTimerRef.current = window.setTimeout(scheduleBehavior, duration);
  }, []);

  // 이동 루프
  useEffect(() => {
    const tick = () => {
      if (isDragging.current || isFalling.current || isPaused.current) return;
      const { anim, facingLeft, x } = stateRef.current;
      const speed = SPEED[anim];
      if (speed === 0) return;

      const nx = facingLeft ? x - speed : x + speed;
      if (nx <= minX()) {
        setState((prev) => ({ ...prev, x: minX(), facingLeft: false }));
      } else if (nx >= maxX()) {
        setState((prev) => ({ ...prev, x: maxX(), facingLeft: true }));
      } else {
        setState((prev) => ({ ...prev, x: nx }));
      }
    };

    moveTimerRef.current = window.setInterval(tick, 1000 / 60);
    return () => { if (moveTimerRef.current) window.clearInterval(moveTimerRef.current); };
  }, [characterW, minX, maxX]);

  // 행동 스케줄 시작
  useEffect(() => {
    scheduleBehavior();
    return () => { if (animTimerRef.current) window.clearTimeout(animTimerRef.current); };
  }, [scheduleBehavior]);

  const startFalling = useCallback(() => {
    isFalling.current = true;
    setState((prev) => ({ ...prev, anim: "HURT" }));
    if (fallTimerRef.current) window.clearInterval(fallTimerRef.current);

    fallTimerRef.current = window.setInterval(() => {
      velocityY.current += GRAVITY;
      setState((prev) => {
        const nextY = prev.screenY + velocityY.current;
        const floor = floorY();
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
  }, [floorY, scheduleBehavior]);

  const pause = useCallback(() => {
    isPaused.current = true;
    if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
    setState((prev) => ({ ...prev, anim: "IDLE" }));
  }, []);

  const resume = useCallback(() => {
    isPaused.current = false;
    scheduleBehavior();
  }, [scheduleBehavior]);

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
      const nx  = Math.max(minX(), Math.min(me.clientX - startMouseX + startCharX, maxX()));
      const ny  = Math.max(0, Math.min(me.clientY - startMouseY + startCharY, floorY()));
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
      if (Math.abs(stateRef.current.screenY - floorY()) < 6) {
        scheduleBehavior();
      } else {
        startFalling();
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
  }, [minX, maxX, floorY, scheduleBehavior, startFalling]);

  return { ...state, onDragStart, pause, resume };
}