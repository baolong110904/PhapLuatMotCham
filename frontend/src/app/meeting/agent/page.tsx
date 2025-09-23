"use client";

import React, { useState } from "react";
import { Mic, MicOff } from "lucide-react";

export default function MascotPage() {
  const [isActive, setIsActive] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  // Your 3 audio files
  const audios = [
    "/assets/greet.mp3",
    "/assets/sing.mp3",
    "/assets/pension_cic.mp3",
  ];
  const speakingMascots = [
    "/assets/mascot_speakings.gif",
    "/assets/mascot_speakings_2.gif"
  ]

  const handleClick = () => {
    if (isTalking) return; // prevent multiple clicks while TTS is playing

    if (!isActive) {
      // When user clicks button → activate (change appearance)
      setIsActive(true);
    } else {
      // When user unclicks button → play random audio
      setIsActive(false);

      const randomAudio = audios[Math.floor(Math.random() * audios.length)];
      const audio = new Audio(randomAudio);

      audio.onplay = () => setIsTalking(true);
      audio.onended = () => setIsTalking(false);

      audio.play().catch((err) => console.error("Audio play error:", err));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#3576e5] via-blue-300 to-blue-50 p-6">
      {/* Mascot GIF */}
      <div className="w-128 h-128 flex items-center justify-center rounded-full bg-yellow-200 shadow-lg overflow-hidden">
        <img
          src={
            isTalking
              ? speakingMascots[Math.floor(Math.random() * speakingMascots.length)]
              : "/assets/mascot_idle.gif"
          }
          alt="Mascot"
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Button */}
      <button
        onClick={handleClick}
        className={`mt-10 flex items-center gap-3 px-6 py-3 rounded-full text-lg font-bold text-white shadow-md transition-all cursor-pointer ${
          isActive ? "bg-red-500 hover:bg-red-600" : "bg-indigo-500 hover:bg-indigo-600"
        }`}
      >
        {isActive ? <MicOff /> : <Mic />}
        {isActive ? "Đang nghe..." : "Nói chuyện với Tâm Lạc Nhí"}
      </button>
    </div>
  );
}
