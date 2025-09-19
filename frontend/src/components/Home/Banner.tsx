"use client";
import { motion, useAnimation, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { MorphingBlob } from '../ui/MorphingBlob';

export default function Banner() {
  // Nội dung chữ bên trái
  const title = "Tâm an - Lạc sống - Vẹn tròn tuổi già";
  const desc = "Tâm Lạc Center là không gian chăm sóc tinh thần cho người cao tuổi với các hoạt động kết nối, sáng tạo và ý nghĩa. Chúng tôi tin rằng tuổi già cũng là thời gian để sống hạnh phúc.";

  const controls = useAnimation();
  const router = useRouter();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const soundPlayedRef = useRef(false);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
      if (videoRef.current) {
        videoRef.current.play().catch(error => console.log("Video autoplay was prevented:", error));
        if (!soundPlayedRef.current) {
          videoRef.current.muted = false;
          soundPlayedRef.current = true;
        } else {
          videoRef.current.muted = true;
        }
      }
    } else {
      controls.start("hidden");
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [controls, inView]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="relative w-full bg-white overflow-hidden">
      {/* backgrounds - always behind content */}
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <AnimatedBackground className="opacity-70" />
        <MorphingBlob className="-top-20 left-0 w-1/2 h-72 opacity-90" />
        <MorphingBlob className="-bottom-16 right-0 w-1/3 h-56 opacity-80 rotate-45" />
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Video layer on the right */}
        <div className="absolute inset-0 z-0 flex justify-end items-center pointer-events-none">
          <video
            ref={videoRef}
            src="/banner.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-[520px] md:h-[650px] w-[65vw] object-cover transition-opacity duration-500 ease-in-out opacity-90"
            style={{
              transform: 'translateX(25%)',
              maskImage: 'linear-gradient(to left, black 70%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 70%, transparent 100%)',
            }}
          />
        </div>

        {/* Content */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full pt-20 pb-32 px-4"
          style={{ minHeight: 450 }}
        >
          <motion.div variants={itemVariants} className="w-full md:w-1/2 p-6">
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold text-[#3576e5] mb-4 drop-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {title}
            </motion.h1>
            <motion.div variants={itemVariants} className="text-[#222] text-lg sm:text-2xl font-medium mb-8 max-w-xl drop-shadow-lg">
              <p>
                Tâm Lạc Center là không gian chăm sóc tinh thần cho người cao tuổi với các hoạt động kết nối, sáng tạo và ý nghĩa.
              </p>
              <p className="mt-2">Chúng tôi tin rằng tuổi già cũng là thời gian để sống hạnh phúc.</p>
            </motion.div>
            <motion.button
              variants={itemVariants}
              onClick={() => router.push('/about')}
              className="bg-[#0074F8] text-white text-lg font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-[#005ecb] transition-all"
            >
              Tìm hiểu thêm <span className="ml-2">→</span>
            </motion.button>
          </motion.div>

          <div className="hidden md:block w-1/2" />
        </motion.div>
      </div>

      {/* Wave SVG separator */}
      <div className="relative -mt-32 z-20">
        <div className="w-full bg-transparent">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,64 Q48,72 96,80 C192,96,384,96,576,85.3 C768,75,960,96,1152,85.3 C1248,75,1344,64,1392,58 Q1408,54 1440,50 L1440,121 L0,121 Z" fill="#3576e5"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}