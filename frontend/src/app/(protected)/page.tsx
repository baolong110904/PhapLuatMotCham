"use client";
import Banner from "../../components/Home/Banner";
import CoreValues from "../../components/Home/CoreValues";
import { Services } from "../../components/Home/Services";
import { HowItWorks } from "../../components/Home/HowItWorks";
import { useState, useMemo } from "react";
import { LangContext } from "@/components/LangContext";

export default function Home() {
  const [lang, setLang] = useState("vi");
  
  // Memoize context value to prevent unnecessary rerenders
  const langContextValue = useMemo(() => ({ lang, setLang }), [lang]);
  
  return (
      <LangContext.Provider value={langContextValue}>
        <div className="font-sans min-h-screen bg-[#f8fafc] flex flex-col items-center p-0">
          <Banner />
          <CoreValues />
          <Services />
          <HowItWorks />
        </div>
      </LangContext.Provider>
  );
}
