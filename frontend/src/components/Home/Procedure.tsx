"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { LangContext } from "../LangContext";

type ProcedureType = {
  title: string;
  img: string;
  description: string;
  audio: string;
};

const procedures: ProcedureType[] = [
  {
    title: "Sao y giấy tờ",
    img: "/file.svg",
    description: "Hướng dẫn từng bước sao y giấy tờ quan trọng.",
    audio: "/audio/saoy.mp3",
  },
  {
    title: "Công chứng",
    img: "/window.svg",
    description: "Các bước công chứng giấy tờ, hợp đồng.",
    audio: "/audio/congchung.mp3",
  },
  {
    title: "Cấp lại CCCD",
    img: "/globe.svg",
    description: "Thủ tục cấp lại căn cước công dân khi bị mất hoặc hỏng.",
    audio: "/audio/cccd.mp3",
  },
  {
    title: "Cấp lại giấy đăng ký kết hôn",
    img: "/next.svg",
    description: "Hướng dẫn xin cấp lại giấy đăng ký kết hôn.",
    audio: "/audio/dk_kethon.mp3",
  },
];

const playAudio = (src: string) => {
  const audio = new Audio(src);
  audio.play();
};

export default function Procedure() {
  const { lang } = useContext(LangContext);
  const [items, setItems] = useState<ProcedureType[]>(procedures);

  useEffect(() => {
    if (lang === "vi") {
      setItems(procedures);
    } else {
      Promise.all(
        procedures.map(async (item) => {
          const titleRes = await fetch("https://libretranslate.com/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: item.title, source: "vi", target: "en", format: "text" }),
          });
          const titleData = await titleRes.json();
          const descRes = await fetch("https://libretranslate.com/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: item.description, source: "vi", target: "en", format: "text" }),
          });
          const descData = await descRes.json();
          return {
            ...item,
            title: titleData.translatedText || item.title,
            description: descData.translatedText || item.description,
          };
        })
      ).then(setItems);
    }
  }, [lang]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
      {items.map((item) => (
        <div key={item.title} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center gap-3">
          <Image src={item.img} alt={item.title} width={48} height={48} />
          <h2 className="text-xl font-semibold text-[#233a5e] text-center">{item.title}</h2>
          <p className="text-base text-[#233a5e] text-center">{item.description}</p>
          <button
            className="mt-2 px-4 py-2 bg-[#233a5e] text-white rounded-full text-base font-medium flex items-center gap-2 hover:bg-[#1a2b47]"
            onClick={() => playAudio(item.audio)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25v7.5m0 0a3 3 0 006 0v-7.5a3 3 0 00-6 0zm6 0v7.5m0 0a3 3 0 006 0v-7.5a3 3 0 00-6 0z" />
            </svg>
            {lang === "vi" ? "Nghe hướng dẫn" : "Listen to guide"}
          </button>
        </div>
      ))}
    </div>
  );
}