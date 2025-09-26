import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { Mic, MicOff } from "lucide-react";

interface MascotProps {
  variant: "left" | "right";
  leftVoiceOn: boolean;
  rightVoiceOn: boolean;
  setLeftVoiceOn: Dispatch<SetStateAction<boolean>>;
  setRightVoiceOn: Dispatch<SetStateAction<boolean>>;
}

export default function Mascot({
  variant,
  leftVoiceOn,
  rightVoiceOn,
  setLeftVoiceOn,
  setRightVoiceOn,
}: MascotProps) {
  const isLeft = variant === "left";
  const bg = isLeft
    ? "bg-gradient-to-br from-blue-100 to-blue-400"
    : "bg-gradient-to-br from-yellow-100 to-yellow-400";

  const mascotImg = isLeft
  ? "/mascot/old-man-mascot-rm-bg.png"
  : "/mascot/old-woman-mascot-rm-bg.png";

  return (
    <div
      className={`relative ${bg} rounded-2xl 
      w-32 h-44 sm:w-40 sm:h-48 md:w-56 md:h-64 lg:w-72 lg:h-80 
      flex flex-col items-center justify-between p-4 shadow-2xl transition-all`}
    >
      <div className="flex flex-col items-center">
        <Image
          src={mascotImg}
          alt={isLeft ? "Mascot Lạc" : "Mascot Tâm"}
          width={256}
          height={256}
          className="mb-2 object-contain w-20 sm:w-28 md:w-40 lg:w-52 h-auto"
        />

        <div className="text-sm md:text-base font-bold text-[#0b3b8a]">
          {isLeft ? "Tâm" : "Lạc"}
        </div>
        <div className="text-xs md:text-sm text-[#07305f]/70">
          {isLeft ? "Ông Tâm" : "Bà Lạc"}
        </div>
      </div>

      {/* Voice toggle */}
      <div className="w-full flex items-center justify-between">
        <div className="text-xs md:text-sm text-[#07305f]/80">Voice</div>
        <div className="flex items-center gap-2">
          {isLeft ? (
            <button
              aria-label="Toggle Left Voice"
              onClick={() => setLeftVoiceOn((v) => !v)}
              className="p-2 rounded-md hover:bg-white/20 cursor-pointer"
            >
              {leftVoiceOn ? (
                <Mic className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <MicOff className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
          ) : (
            <button
              aria-label="Toggle Right Voice"
              onClick={() => setRightVoiceOn((v) => !v)}
              className="p-2 rounded-md hover:bg-white/20 cursor-pointer"
            >
              {rightVoiceOn ? (
                <Mic className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <MicOff className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
