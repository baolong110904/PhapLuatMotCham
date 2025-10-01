"use client";
import Banner from "../../components/Home/Banner";
import CoreValues from "../../components/Home/CoreValues";
import { Services } from "../../components/Home/Services";
import { HowItWorks } from "../../components/Home/HowItWorks";
import { useState } from "react";
import { LangContext } from "@/components/LangContext";
import ProtectedLayout from "@/components/Private/ProtectedLayout";

export default function Home() {
  const [lang, setLang] = useState("vi");
  return (
    <ProtectedLayout>
      <LangContext.Provider value={{ lang, setLang }}>
        <div className="font-sans min-h-screen bg-[#f8fafc] flex flex-col items-center p-0">
          <Banner />
          <CoreValues />
          <Services />
          <HowItWorks />
        </div>
      </LangContext.Provider>
    </ProtectedLayout>
  );
}
