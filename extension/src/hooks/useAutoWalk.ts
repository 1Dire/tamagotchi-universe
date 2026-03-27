// src/hooks/useAutoWalk.ts
import { useState, useEffect, useRef } from "react";

type Anim = "IDLE" | "WALK" | "RUN" | "JUMP";

interface WalkState {
  x: number;
  anim: Anim;
  facingLeft: boolean;
}

const BEHAVIOR_DURATION: Record<Anim, [number, number]> = {
  IDLE: [1500, 4000],
  WALK: [2000, 5000],
  RUN:  [1000, 2500],
  JUMP: [600,  600],
};

const SPEED: Record<Anim, number> = {
  IDLE: 0,
  WALK: 1.2,
  RUN:  2.8,
  JUMP: 0,
};

const EDGE_MARGIN = 20;

function pickNextAnim(): Anim {
  const roll = Math.random();
  if (roll < 0.35) return "IDLE";
  if (roll < 0.75) return "WALK";
  if (roll < 0.93) return "RUN";
  return "JUMP";
}

function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function useAutoWalk(characterW = 48) {
  const [state, setState] = useState<WalkState>({
    x: window.innerWidth - characterW - EDGE_MARGIN,
    anim: "IDLE",
    facingLeft: false,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const animTimerRef = useRef<number | null>(null);
  const moveTimerRef = useRef<number | null>(null);

  const minX = () => EDGE_MARGIN;
  const maxX = () => window.innerWidth - characterW - EDGE_MARGIN;

  const scheduleBehavior = () => {
    const next = pickNextAnim();
    const duration = randBetween(...BEHAVIOR_DURATION[next]);

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
  };

  useEffect(() => {
    const tick = () => {
      const { anim, facingLeft, x } = stateRef.current;
      const speed = SPEED[anim];
      if (speed === 0) return;

      let nx = facingLeft ? x - speed : x + speed;

      if (nx > maxX()) {
        setState((prev) => ({ ...prev, x: maxX(), facingLeft: true }));
      } else if (nx < minX()) {
        setState((prev) => ({ ...prev, x: minX(), facingLeft: false }));
      } else {
        setState((prev) => ({ ...prev, x: nx }));
      }
    };

    moveTimerRef.current = window.setInterval(tick, 1000 / 60);
    return () => { if (moveTimerRef.current) window.clearInterval(moveTimerRef.current); };
  }, [characterW]);

  useEffect(() => {
    scheduleBehavior();
    return () => { if (animTimerRef.current) window.clearTimeout(animTimerRef.current); };
  }, []);

  return {
    ...state,
    x: Math.max(minX(), Math.min(state.x, maxX())),
  };
}