"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

export default function MascotPage() {
  const [isListening, setIsListening] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Setup speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recog = new (window as any).webkitSpeechRecognition();
      recog.lang = "vi-VN"; // Vietnamese, change if needed
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

        // Play TTS
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
      {/* Mascot */}
      <motion.div
        animate={
          isTalking
            ? { scale: [1, 1.1, 1], y: [0, -10, 0] } // talking
            : { y: [0, -5, 0] } // idle
        }
        transition={{ repeat: Infinity, duration: isTalking ? 0.6 : 2 }}
        className="w-48 h-48 rounded-full bg-yellow-300 shadow-lg flex items-center justify-center"
      >
        🐻 {/* placeholder mascot (teddy bear emoji). Replace with image/gif */}
      </motion.div>

      {/* Button */}
      <button
        onClick={toggleMic}
        className={`mt-10 flex items-center gap-3 px-6 py-3 rounded-full text-lg font-bold text-white shadow-md transition ${
          isListening ? "bg-red-500 hover:bg-red-600" : "bg-indigo-500 hover:bg-indigo-600"
        }`}
      >
        {isListening ? <MicOff /> : <Mic />}
        {isListening ? "Đang nghe..." : "Nói chuyện với Tâm Lạc Nhí"}
      </button>
    </div>
  );
}
