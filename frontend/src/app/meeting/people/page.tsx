"use client"

import React, { useState } from "react";
import ChatBox from "@/components/Meeting/ChatBox";
import Mascot from "@/components/Meeting/Mascot";

// Main component
export default function MeetingPage() {
  const [messages, setMessages] = useState([
    { id: 1, from: "left", text: "Xin chào! Mình là Tâm.", time: new Date() },
    { id: 2, from: "right", text: "Chào bạn! Mình là Lạc.", time: new Date() },
  ]);

  const [input, setInput] = useState("");
  const [leftVoiceOn, setLeftVoiceOn] = useState(true);
  const [rightVoiceOn, setRightVoiceOn] = useState(false);
  // const [speaking, setSpeaking] = useState(false);

  function handleSend(from: "left" | "right") {
    if (!input.trim()) return;
    const next = {
      id: Date.now(),
      from,
      text: input.trim(),
      time: new Date(),
    };
    setMessages((m) => [...m, next]);
    setInput("");
  }


  return (
    <div className="min-h-screen p-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-center">
            <Mascot
              variant="left"
              leftVoiceOn={leftVoiceOn}
              rightVoiceOn={rightVoiceOn}
              setLeftVoiceOn={setLeftVoiceOn}
              setRightVoiceOn={setRightVoiceOn}
            />
          </div>

          <ChatBox
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={handleSend}
          />

          <div className="flex items-center justify-center">
            <Mascot
              variant="right"
              leftVoiceOn={leftVoiceOn}
              rightVoiceOn={rightVoiceOn}
              setLeftVoiceOn={setLeftVoiceOn}
              setRightVoiceOn={setRightVoiceOn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
