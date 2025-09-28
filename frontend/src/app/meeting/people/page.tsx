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
    <div className="relative min-h-screen p-6 md:p-10 bg-white">
      {/* Mobile: mascots side-by-side on top, chatbox below (no horizontal scroll) */}
      <div className="md:hidden flex flex-col items-center gap-4 w-full">
        <div className="flex flex-row items-center justify-center gap-4 w-full px-4">
          <div className="flex-1 max-w-[220px] flex items-center justify-center">
            <div className="w-44 sm:w-48 rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-blue-100 to-blue-400 shadow-lg">
              <Mascot
                variant="left"
                leftVoiceOn={leftVoiceOn}
                rightVoiceOn={rightVoiceOn}
                setLeftVoiceOn={setLeftVoiceOn}
                setRightVoiceOn={setRightVoiceOn}
                bgClass="bg-transparent"
              />
            </div>
          </div>

          <div className="flex-1 max-w-[220px] flex items-center justify-center">
            <div className="w-44 sm:w-48 rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-yellow-100 to-yellow-400 shadow-lg">
              <Mascot
                variant="right"
                leftVoiceOn={leftVoiceOn}
                rightVoiceOn={rightVoiceOn}
                setLeftVoiceOn={setLeftVoiceOn}
                setRightVoiceOn={setRightVoiceOn}
                bgClass="bg-transparent"
              />
            </div>
          </div>
        </div>

        <div className="w-full px-4">
          <div className="mx-auto w-full max-w-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-4">
              <ChatBox messages={messages} input={input} setInput={setInput} onSend={handleSend} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop / md+: full-height side panels + centered chat area with transition background */}
      <div className="hidden md:block">
        {/* Left full-height panel */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-1/3">
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-400">
            <div className="w-72 lg:w-80 p-10">
              <Mascot
                variant="left"
                leftVoiceOn={leftVoiceOn}
                rightVoiceOn={rightVoiceOn}
                setLeftVoiceOn={setLeftVoiceOn}
                setRightVoiceOn={setRightVoiceOn}
                bgClass="bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Right full-height panel */}
        <div className="hidden md:block absolute inset-y-0 right-0 w-1/3">
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-yellow-100 to-yellow-400">
            <div className="w-72 lg:w-80 p-10">
              <Mascot
                variant="right"
                leftVoiceOn={leftVoiceOn}
                rightVoiceOn={rightVoiceOn}
                setLeftVoiceOn={setLeftVoiceOn}
                setRightVoiceOn={setRightVoiceOn}
                bgClass="bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Center transition area fills the space between left/right panels */}
        {/* Background layer: split in two halves so the center visually matches left/right panels */}
        <div className="absolute inset-y-0 left-1/3 right-1/3 z-0">
          <div className="h-full w-full flex">
            <div className="w-1/2 h-full bg-gradient-to-b from-blue-100 to-blue-400" />
            <div className="w-1/2 h-full bg-gradient-to-b from-yellow-100 to-yellow-400" />
          </div>
        </div>

        {/* Chat box sits above the background */}
        <div className="absolute inset-y-0 left-1/3 right-1/3 z-10 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-md mx-4">
            <ChatBox messages={messages} input={input} setInput={setInput} onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
}