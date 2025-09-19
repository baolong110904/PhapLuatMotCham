"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBrain, FaHeartbeat, FaUsers } from 'react-icons/fa';
import { motion, useAnimation, easeOut } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const coreValueTitle = "// GIÁ TRỊ CỐT LÕI";
const coreValueDesc = "Tại Tâm Lạc, chúng tôi không chỉ đồng hành chăm sóc, mà còn sẻ chia niềm vui và tạo nên những khoảnh khắc ý nghĩa mỗi ngày.";
const valueItems = [
    {
        icon: <FaBrain size={40} className="text-white mb-4" />,
        title: "Dưỡng Tâm Trí",
        desc: "Trị liệu nghệ thuật, ghi nhật ký cảm xúc, trò chuyện nhóm nhỏ để giảm stress, tăng lạc quan.",
    },
    {
        icon: <FaHeartbeat size={40} className="text-white mb-4" />,
        title: "Chăm Sóc Thân Thể",
        desc: "Vận động phù hợp, giãn cơ - dưỡng sinh, thiền thả lỏng để ngủ sâu và ăn ngon hơn.",
    },
    {
        icon: <FaUsers size={40} className="text-white mb-4" />,
        title: "Kết Nối Cộng Đồng",
        desc: "Gặp gỡ những người đồng trang lứa, giao lưu đa thế hệ, cùng làm - cùng chia sẻ - cùng cho đi.",
    },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
      ease: easeOut,
    },
  },
};

export default function CoreValues() {
  const controls = useAnimation();
  const router = useRouter();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const audioRef = useRef<HTMLDivElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (inView && !hasPlayed) {
      controls.start("visible");
      const id = setTimeout(() => {
        const audio = new Audio('/audio1.mp3');
        audio.play().catch(error => console.error("Audio play failed:", error));
        setHasPlayed(true);
      }, 3000);
      setTimeoutId(id);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [controls, inView, hasPlayed]);

  return (
    <div ref={audioRef} className="relative z-20 w-full">
      {/* Nội dung giá trị cốt lõi */}
        <div 
          ref={ref}
          className="w-full bg-[#3576e5] py-16 px-4 text-center -mt-1"
        >
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-white text-lg font-semibold mb-4 tracking-wider">{coreValueTitle}</motion.div>
            <motion.div variants={itemVariants} className="text-white text-4xl font-extrabold mb-12 max-w-4xl mx-auto" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>{coreValueDesc}</motion.div>
            <div
              className="flex flex-col md:flex-row justify-center items-start gap-12 md:gap-16 w-full"
            >
              {valueItems.map((item, idx) => (
                <motion.div key={idx} variants={itemVariants} className="flex flex-col items-center flex-1 min-w-[240px]">
                  {item.icon}
                  <div className="text-white text-2xl font-bold mb-3">{item.title}</div>
                  <div className="text-white/90 text-base md:text-lg font-normal" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.10)' }}>{item.desc}</div>
                </motion.div>
              ))}
            </div>
            {/* Mascot image with circular action buttons (left/right on md+, stacked on small) */}
            <div className="mt-12 w-full flex flex-col items-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <button
                  aria-label="Trò chơi"
                  title="Trò chơi"
                  onClick={() => router.push('/quiz')}
                  className="cursor-pointer w-30 h-30 md:w-30 md:h-30 rounded-full bg-yellow-400 text-[#0b3b8a] flex items-center justify-center text-lg md:text-xl font-extrabold shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300/60"
                >
                  Trò chơi
                </button>
                <video
                  src="/mascot/8.mp4"
                  aria-label="Mascot video"
                  className="w-128 h-128 md:w-128 md:h-128 object-cover mx-auto"
                  playsInline
                  muted
                  loop
                  autoPlay
                  style={{ backgroundColor: 'transparent' }}
                />
                <button
                  aria-label="Phòng họp online"
                  title="Phòng họp online"
                  className="cursor-pointer w-30 h-30 md:w-30 md:h-30 rounded-full bg-pink-500 text-white flex items-center justify-center text-lg md:text-xl font-extrabold shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300/60"
                >
                  Trò chuyện
                </button>
              </div>
            </div>
          </motion.div>
        </div>
    </div>
  );
}
