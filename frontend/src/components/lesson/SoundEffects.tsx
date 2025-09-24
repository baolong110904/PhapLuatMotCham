"use client";

import { useCallback, useRef } from "react";

export function useSoundEffect() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((path: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(path);
    audio.volume = 0.6;
    audioRef.current = audio;
    try {
      audio.play();
    } catch (error) {
      console.warn(error);
    }
  }, []);

  const stopAll = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (e) {
        // ignore
      }
      audioRef.current = null;
    }
  }, []);

  return {
    playCorrect: () => playSound("/minigame/correct.wav"),
    playWrong: () => playSound("/minigame/wrong.wav"),
    playReward: () => playSound("/minigame/correct-reward.wav"),
    playEnding: () => playSound("/minigame/ending.wav"),
    stopAll,
  };
}
