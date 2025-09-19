"use client";
import WorkAdventureEmbed from "@/components/game/WorkAdventure";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <main className="w-screen h-screen">
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-35 z-10 bg-[#005ecb] px-4 py-5 font-bold text-white rounded-2xl cursor-pointer"
      >
        Back to home
      </button>
      <WorkAdventureEmbed />
    </main>
  );
}
