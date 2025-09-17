"use client";

import React, { useEffect, useRef } from "react";
import Fireworks, { FireworksOptions } from "fireworks-js";

interface FireworkProps {
  active: boolean; // control when fireworks should show
  duration?: number; // how long to run (ms)
}

const Firework: React.FC<FireworkProps> = ({ active, duration = 5000 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fireworksInstance = useRef<Fireworks | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const options: FireworksOptions = {
      rocketsPoint: { min: 50, max: 50 },
      hue: { min: 0, max: 360 },
      delay: { min: 15, max: 30 },
      traceSpeed: 1,
      acceleration: 1.05,
      friction: 0.98,
      gravity: 1.2,
      particles: 50,
      explosion: 5,
      autoresize: true,
      brightness: { min: 50, max: 80 },
      decay: { min: 0.015, max: 0.03 },
      mouse: { click: false, move: false, max: 1 },
      boundaries: {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    if (!fireworksInstance.current) {
      fireworksInstance.current = new Fireworks(containerRef.current, options);
    }

    if (active) {
      fireworksInstance.current.start();

      timerRef.current = setTimeout(() => {
        fireworksInstance.current?.stop();
      }, duration);
    } else {
      fireworksInstance.current.stop();
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      fireworksInstance.current?.stop();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, duration]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default Firework;
