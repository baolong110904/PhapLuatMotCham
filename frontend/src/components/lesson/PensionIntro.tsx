"use client";

import { useState, useEffect, useRef } from "react";
import GameData from "@/mock/minigame2.json";

type Props = { onStart: () => void };

export default function PensionIntro({ onStart }: Props) {
  const [showBubble, setShowBubble] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    try {
      const audio = new Audio('/minigame/xinchao.mp3');
      audioRef.current = audio;
      audio.play().catch(() => {});
    } catch (err) {}

    const t1 = setTimeout(() => setShowBubble(true), 2000);
    const t2 = setTimeout(() => setShowSecondText(true), 7000);
    timersRef.current.push(t1, t2);

    try {
      // Ensure video is muted so mobile browsers allow autoplay.
      if (videoRef.current) {
        try { videoRef.current.muted = true; } catch {}
        try { videoRef.current.volume = 0.15; } catch {}
        // attempt to play programmatically (best-effort)
        try { videoRef.current.play().catch(() => {}); } catch {}
      }
    } catch (e) {}

    return () => {
      timersRef.current.forEach((id) => clearTimeout(id));
      timersRef.current = [];
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch (e) {}
        audioRef.current = null;
      }
    };
  }, []);

  const intro = (GameData as any).pensionIntro;

  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <div className="w-full flex items-center justify-center">
        <div className="relative w-full max-w-2xl">
          <video
            ref={videoRef}
            src="/mascot/1.mp4"
            className="w-full h-auto object-contain"
            playsInline
            autoPlay
            loop
            muted
            preload="auto"
          />

          <div
            aria-hidden={!showBubble}
            className={`absolute right-20 md:right-36 lg:right-44 top-6 transform transition-all duration-500 ${showBubble ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
            style={{ pointerEvents: showBubble ? 'auto' : 'none' }}
          >
            <div className="relative">
              <div className="bg-white border border-gray-200 rounded-2xl px-8 py-4 text-gray-800 shadow-lg text-center" style={{ minWidth: 280 }}>
                <div className="text-xl md:text-2xl font-semibold">{intro?.mascot ?? 'Tâm Lạc xin kính chào Cô/Chú!'}</div>
                {showSecondText && (
                  <div className="mt-2 text-lg md:text-xl text-gray-700">{intro?.chooseScenario ?? 'Nhấn vào nút Bắt đầu để vào phần câu hỏi'}</div>
                )}
                {/* options are shown by Minigame's JSON intro stage; PensionIntro only triggers UI intro completion */}
              </div>
              <div className="absolute -bottom-3 right-20 md:right-32 lg:right-40 w-5 h-5 bg-white border border-gray-200 rotate-45" />
            </div>
          </div>

          <div className="absolute bottom-4 right-0 md:bottom-6 md:right-0 lg:right-0 translate-x-12 md:translate-x-20 lg:translate-x-28">
            <div className="bg-white rounded-full px-3 py-2 shadow-md">
              <button
                onClick={() => onStart()}
                aria-label="Bắt đầu - vào phần câu hỏi"
                className="bg-[#3576e5] text-white font-semibold text-lg md:text-xl py-3 px-6 min-w-[140px] rounded-full hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-[#3576e5]/30"
              >
                Bắt đầu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}