"use client";

import { useState, useEffect, useRef } from "react";

type Props = { onStart: () => void };

export default function CicIntro({ onStart }: Props) {
  const [showBubble, setShowBubble] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Play greeting audio (best-effort; may be blocked by autoplay rules)
    try {
      const audio = new Audio('/minigame/xinchao.mp3');
      audioRef.current = audio;
      audio.play().catch(() => {});
    } catch {
      // ignore
    }

    const t1 = setTimeout(() => setShowBubble(true), 2000);
    const t2 = setTimeout(() => setShowSecondText(true), 7000);
    timersRef.current.push(t1, t2);

    // allow muted autoplay on mobile by ensuring the element is muted; still lower volume if unmuted later
    try {
      if (videoRef.current) {
        // ensure the element is muted so browsers permit autoplay on mobile
        videoRef.current.muted = true;
        // keep a low volume in case it's unmuted later
        try { videoRef.current.volume = 0.15; } catch {}
      }
    } catch {}

    return () => {
      timersRef.current.forEach((id) => clearTimeout(id));
      timersRef.current = [];
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
  } catch {}
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <div className="w-full flex items-center justify-center">
        <div className="relative w-full max-w-2xl">
          <video
            ref={videoRef}
            src="https://res.cloudinary.com/ddul274oe/video/upload/v1759063440/1_ukrap1.mp4"
            className="w-full h-auto object-contain"
            playsInline
            autoPlay
            muted
            preload="auto"
            loop
          />

          <div
            aria-hidden={!showBubble}
            className={`absolute right-20 md:right-36 lg:right-44 top-6 transform transition-all duration-500 ${showBubble ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
            style={{ pointerEvents: showBubble ? 'auto' : 'none' }}
          >
            <div className="relative">
              <div className="bg-white border border-gray-200 rounded-2xl px-8 py-4 text-gray-800 shadow-lg text-center" style={{ minWidth: 280 }}>
                <div className="text-xl md:text-2xl font-semibold">Tâm Lạc xin kính chào Cô/Chú!</div>
                {showSecondText && (
                  <div className="mt-2 text-lg md:text-xl text-gray-700">Nhấn vào nút Bắt đầu để vào phần câu hỏi</div>
                )}
              </div>
              <div className="absolute -bottom-3 right-20 md:right-32 lg:right-40 w-5 h-5 bg-white border border-gray-200 rotate-45" />
            </div>
          </div>
          {/* Start button positioned inside the video container, bottom-right */}
          <div className="absolute right-15 md:bottom-6 md:right-0 lg:right-0 translate-x-12 md:translate-x-20 lg:translate-x-28">
            <div className="bg-white rounded-full px-3 py-2 shadow-md">
              <button
                onClick={onStart}
                aria-label="Bắt đầu - vào phần câu hỏi"
                className="bg-[#3576e5] cursor-pointer text-white font-semibold text-lg md:text-xl py-3 px-6 min-w-[140px] rounded-full hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-[#3576e5]/30"
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
