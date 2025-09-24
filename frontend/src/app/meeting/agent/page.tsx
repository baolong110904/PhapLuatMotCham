"use client";

import React, { useState } from "react";
import { Mic, MicOff } from "lucide-react";

export default function MascotPage() {
  const [isActive, setIsActive] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  const audios = [
    "/assets/greet.mp3",
    "/assets/pension_cic.mp3",
    "/assets/pension_cic_2.mp3",
    "/assets/pension_cic_3.mp3",

  ];
  const speakingMascots = [
    "/assets/mascot_speakings.gif",
    "/assets/mascot_speakings_2.gif",
    "/assets/mascot_speakings_3.gif",
  ];

  const handleClick = () => {
    if (isTalking) return;

    if (!isActive) {
      setIsActive(true);
    } else {
      setIsActive(false);

      const randomAudio = audios[Math.floor(Math.random() * audios.length)];
      const audio = new Audio(randomAudio);

      audio.onplay = () => setIsTalking(true);
      audio.onended = () => setIsTalking(false);

      audio.play().catch((err) => console.error("Audio play error:", err));
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/bg_mascot.svg')", // ← your background image
      }}
    >
      {/* Liquid Glass Circle */}
      <div className="lg:w-128 lg:h-128 md:h-100 md:w-100 sm:h-80 sm:w-80 h-64 w-64 flex items-center justify-center rounded-full shadow-2xl relative backdrop-blur-xs bg-white/20 border border-white/30">
        <img
          src={
            isTalking
              ? speakingMascots[
                  Math.floor(Math.random() * speakingMascots.length)
                ]
              : "/assets/mascot_idle.gif"
          }
          alt="Mascot"
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
        />

        {/* Extra glass shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
      </div>

      {/* Button */}
      <button
        onClick={handleClick}
        className={`mt-10 flex items-center gap-3 px-6 py-3 rounded-full text-lg font-bold text-white shadow-lg transition-all cursor-pointer ${
          isActive
            ? "bg-red-500 hover:bg-red-600"
            : "bg-indigo-500 hover:bg-indigo-600"
        }`}
      >
        {isActive ? <MicOff /> : <Mic />}
        {isActive ? "Đang nghe..." : "Nói chuyện với Tâm Lạc Nhí"}
      </button>
    </div>
  );
}
