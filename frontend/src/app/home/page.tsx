
"use client";
import Banner from "../../components/Home/Banner";
import Procedure from "../../components/Home/Procedure";
import { useState } from "react";
import { LangContext } from "../../components/LangContext";

export default function Home() {
  const [lang, setLang] = useState("vi");
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="font-sans min-h-screen bg-[#f8fafc] flex flex-col items-center p-0">
        <Banner />
        <main className="flex flex-col items-center justify-center w-full max-w-3xl py-10 px-4">
          <Procedure />
        </main>
      </div>
    </LangContext.Provider>
  );
}
