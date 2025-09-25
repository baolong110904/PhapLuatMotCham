"use client";

import { useState } from "react";
import Minigame from "@/components/Lesson/Minigame";
import PensionIntro from "@/components/Lesson/PensionIntro";
import GameData from "@/mock/minigame2.json";

export default function PensionPage() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <PensionIntro onStart={() => setStarted(true)} />
      </div>
    );
  }

  return <Minigame data={GameData} triggerUiIntro={true} />;
}
