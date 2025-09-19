"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

type Props = {
  quizName: string;
  img: string;
  route: string;
};

export default function QuizBox({ quizName, img, route }: Props) {
  return (
    <Link href={route}>
      <div className="bg-white rounded-2xl hover:scale-[1.02] shadow-md overflow-hidden cursor-pointer transition-all border border-transparent hover:border-blue-50">
        {/* Image */}
        <div className="w-full h-40 relative">
          <Image
            src={img}
            alt={quizName}
            fill
            className="object-cover w-full h-full rounded-t-2xl"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col">
          <h3 className="text-2xl text-start font-semibold text-gray-800 mb-3">
            {quizName}
          </h3>
          <div className="">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0b3b8a] text-white font-bold text-2xl rounded-2xl hover:bg-[#005fcc] transition">
              <Play size={18} />
              Chơi
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
