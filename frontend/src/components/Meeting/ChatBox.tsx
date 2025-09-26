"use client";

import React, { useRef, useEffect } from "react";

export default function ChatBox({
  messages,
  input,
  setInput,
  onSend,
}: any) {
  const msgBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (msgBoxRef.current) {
      msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className=" col-span-1 md:col-span-1 flex flex-col bg-white rounded-2xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-18 h-18 rounded-full bg-[#0b3b8a]/10 flex items-center justify-center text-2xl text-[#0b3b8a] font-bold">
            TL
          </div>
          <div>
            <div className="text-lg font-bold">Trò Chuyện</div>
          </div>
        </div>
      </div>

      <div
        ref={msgBoxRef}
        className="overflow h-[500px] max-h-[1200px] p-3 border border-gray-100 rounded-lg mb-3"
      >
        <div className="flex flex-col gap-3">
          {messages.map((m: any) => (
            <div
              key={m.id}
              className={`flex ${
                m.from === "left" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w p-3 rounded-xl ${
                  m.from === "left"
                  ? "bg-[#e8f0ff] text-[#07305f]"
                  : "bg-[#fff7e0] text-[#0b3b8a]"
                }`}
              >
                <div className="text-lg">{m.text}</div>
                <div className="text-[12px] text-gray-400 mt-1 text-right">
                  {m.time.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend("left");
          }}
          placeholder="Gõ tin nhắn và nhấn Enter/Gửi"
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={() => onSend("left")}
          className="px-4 py-2 rounded-xl bg-[#0b3b8a] text-white font-bold shadow cursor-pointer"
        >
          Gửi
        </button>

      </div>
    </div>
  );
}
