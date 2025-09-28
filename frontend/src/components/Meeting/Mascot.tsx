import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { Mic, MicOff } from "lucide-react";

interface MascotProps {
  variant: "left" | "right";
  leftVoiceOn: boolean;
  rightVoiceOn: boolean;
  setLeftVoiceOn: Dispatch<SetStateAction<boolean>>;
  setRightVoiceOn: Dispatch<SetStateAction<boolean>>;
  bgClass?: string; // optional class passed from parent to control background wrapper
}

export default function Mascot({
  variant,
  leftVoiceOn,
  rightVoiceOn,
  setLeftVoiceOn,
  setRightVoiceOn,
  bgClass = "",
}: MascotProps) {
  const isLeft = variant === "left";
  const bg = bgClass || (isLeft
    ? "bg-gradient-to-br from-blue-100 to-blue-400"
    : "bg-gradient-to-br from-yellow-100 to-yellow-400");

  const mascotImg = isLeft
  ? "/mascot/old-man-mascot-rm-bg.png"
  : "/mascot/old-woman-mascot-rm-bg.png";

  return (
    <div
      className={`relative ${bg} rounded-2xl 
      w-full h-full flex flex-col items-center justify-between p-6 md:p-8 lg:p-10 shadow-2xl transition-all`}
    >
      <div className="flex flex-col items-center">
        <Image
          src={mascotImg}
          alt={isLeft ? "Mascot Tâm" : "Mascot Lạc"}
          width={512}
          height={512}
          draggable={false}
          className="mb-3 object-contain w-32 sm:w-44 md:w-56 lg:w-72 xl:w-80 h-auto"
        />
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#0b3b8a]">
          {isLeft ? "Tâm" : "Lạc"}
        </div>
        <div className="text-base sm:text-lg md:text-xl text-[#07305f]/70">
          {isLeft ? "Ông Tâm" : "Bà Lạc"}
        </div>
      </div>

      {/* Voice toggle */}
      <div className="w-full flex items-center justify-between mt-3">
        <div className="text-sm md:text-base text-[#07305f]/80">{isLeft ? (leftVoiceOn ? "Tắt Mic" : "Mở Mic") : (rightVoiceOn ? "Tắt Mic" : "Mở Mic")}</div>
        <div className="flex items-center gap-2">
          {isLeft ? (
            <button
              aria-label="Toggle Left Voice"
              onClick={() => setLeftVoiceOn((v) => !v)}
              className="p-3 rounded-md hover:bg-white/20 cursor-pointer"
            >
              {leftVoiceOn ? (
                <Mic className="w-6 h-6 md:w-8 md:h-8" />
              ) : (
                <MicOff className="w-6 h-6 md:w-8 md:h-8" />
              )}
            </button>
          ) : (
            <button
              aria-label="Toggle Right Voice"
              onClick={() => setRightVoiceOn((v) => !v)}
              className="p-3 rounded-md hover:bg-white/20 cursor-pointer"
            >
              {rightVoiceOn ? (
                <Mic className="w-6 h-6 md:w-8 md:h-8" />
              ) : (
                <MicOff className="w-6 h-6 md:w-8 md:h-8" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
