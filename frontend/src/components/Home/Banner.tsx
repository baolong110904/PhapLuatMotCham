"use client";
import { useContext, useEffect, useState } from "react";
import { LangContext } from "../LangContext";

const viTexts = {
  title: "Chào mừng đến với Website hỗ trợ pháp luật cho người cao tuổi",
  desc: "Website giúp bạn tiếp cận pháp luật dễ dàng qua hình ảnh minh họa và giọng đọc tự động. Không cần đọc văn bản rắc rối, bạn chỉ cần làm theo từng bước hướng dẫn trực quan.",
};

export default function Banner() {
  const { lang } = useContext(LangContext);
  const [title, setTitle] = useState(viTexts.title);
  const [desc, setDesc] = useState(viTexts.desc);

  useEffect(() => {
    if (lang === "vi") {
      setTitle(viTexts.title);
      setDesc(viTexts.desc);
    } else {
      // Dịch sang tiếng Anh
      fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: viTexts.title, source: "vi", target: "en", format: "text" })
      })
        .then((res) => res.json())
        .then((data) => setTitle(data.translatedText || viTexts.title));
      fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: viTexts.desc, source: "vi", target: "en", format: "text" })
      })
        .then((res) => res.json())
        .then((data) => setDesc(data.translatedText || viTexts.desc));
    }
  }, [lang]);

  return (
    <section className="flex flex-col items-center justify-center w-full max-w-3xl py-10 px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#233a5e] mb-4 text-center">{title}</h1>
      <p className="text-lg sm:text-xl text-[#233a5e] mb-8 text-center max-w-2xl">{desc}</p>
    </section>
  );
}
