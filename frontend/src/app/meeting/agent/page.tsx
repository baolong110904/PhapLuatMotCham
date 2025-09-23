"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";

// Add type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onerror: (event: Event) => void;
  onend: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onstart: (event: Event) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function MascotPage() {
  const [isListening, setIsListening] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recog = new (window as any).webkitSpeechRecognition();
      recog.lang = "vi-VN";
      recog.continuous = false;
      recog.interimResults = false;

      recog.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        console.log("User said:", text);
        setIsListening(false);

        // Send to your DeepSeek model
        const reply = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text }),
        }).then((res) => res.json());

        console.log("Agent reply:", reply.answer);

        // TTS
        const utterance = new SpeechSynthesisUtterance(reply.answer);
        utterance.lang = "vi-VN";
        utterance.onstart = () => setIsTalking(true);
        utterance.onend = () => setIsTalking(false);
        window.speechSynthesis.speak(utterance);
      };

      recog.onend = () => setIsListening(false);
      setRecognition(recog);
    }
  }, []);

  const toggleMic = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#3576e5] via-blue-300 to-blue-50 p-6">
      {/* Mascot GIF */}
      <div className="w-128 h-128 flex items-center justify-center rounded-full bg-yellow-200 shadow-lg overflow-hidden">
        <img
          src={isTalking ? "/assets/mascot_speaking.gif" : "/assets/mascot_idle.gif"}
          alt="Mascot"
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Button */}
      <button
        onClick={toggleMic}
        className={`mt-10 flex items-center gap-3 px-6 py-3 rounded-full text-lg font-bold text-white shadow-md transition-all cursor-pointer ${
          isListening
            ? "bg-red-500 hover:bg-red-600"
            : "bg-indigo-500 hover:bg-indigo-600"
        }`}
      >
        {isListening ? <MicOff /> : <Mic />}
        {isListening ? "Đang nghe..." : "Nói chuyện với Tâm Lạc Nhí"}
      </button>
    </div>
  );
}
