"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Users, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MeetingPage() {
  const router = useRouter();
  
  return (
    <div className="overflow-hidden min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-6">
      <div className="flex justify-start">
        <button
          onClick={() => router.push("/")}
          className="rounded-2xl cursor-pointer shadow-sm border bg-[#3576e5] font-bold text-white text-xl hover:scale-101 transition-all p-2"
        >
          Quay về trang chủ
        </button>
      </div>
      <div className="pt-30 flex flex-col items-center justify-center ">
        {/* Title */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-800 mb-10"
        >
          Trò chuyện
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
          {/* Chat with Mascot */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-8"
          >
            {/* Mascot Placeholder */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center shadow-md"
            >
              <Bot className="w-16 h-16 text-gray-800" />
            </motion.div>

            <h2 className="text-xl font-extrabold text-gray-700 mb-4">
              Trò chuyện cùng Tâm Lạc Nhí
            </h2>
            <p className="text-gray-500 text-center mb-6 font-semibold">
              Tâm Lạc Nhí là một trợ lý ảo rất dễ thương, hỗ trợ trò chuyện và
              tâm sự cùng ông bà.
            </p>

            <Button
              onClick={() => router.push("/meeting/mascot")}
              variant={"secondary"}
              className="flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              BẮT ĐẦU TRÒ CHUYỆN
            </Button>
          </motion.div>

          {/* Chat with People */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-8"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-400 flex items-center justify-center shadow-md"
            >
              <Users className="w-16 h-16 text-gray-800" />
            </motion.div>

            <h2 className="text-xl font-extrabold text-gray-700 mb-4">
              Trò chuyện cùng mọi người
            </h2>
            <p className="text-gray-500 text-center mb-6 font-semibold">
              Kết nối và trò chuyện cùng với những người dùng khác trong cộng
              đồng Tâm Lạc
            </p>

            <Button
              onClick={() => router.push("/meeting/people")}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              THAM GIA GẶP GỠ
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
