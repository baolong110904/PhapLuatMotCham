"use client";
import Image from "next/image";
import { useState } from "react";

const defaultTexts = {
  vi: {
    title: "Pháp Luật Một Chạm",
  },
  en: {
    title: "One-Touch Law",
  },
};

import { useContext } from "react";
import { LangContext } from "./LangContext";

export default function Header() {
  const { lang, setLang } = useContext(LangContext);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value);
  };

  const title = lang === "vi" ? "Pháp Luật Một Chạm" : "One-Touch Law";

  return (
    <header className="w-full bg-[#233a5e] py-4 px-6 flex flex-col sm:flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src="/file.svg" alt="Logo" width={40} height={40} />
        <span className="text-white text-2xl font-bold">{title}</span>
      </div>
      <div className="flex items-center gap-4 mt-2 sm:mt-0">
        <select className="rounded px-2 py-1 text-base" value={lang} onChange={handleLangChange}>
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>
        <div className="flex gap-1">
          <button className="bg-white text-[#233a5e] px-2 py-1 rounded text-lg">A-</button>
          <button className="bg-white text-[#233a5e] px-2 py-1 rounded text-lg">A</button>
          <button className="bg-white text-[#233a5e] px-2 py-1 rounded text-lg">A+</button>
        </div>
      </div>
    </header>
  );
}
