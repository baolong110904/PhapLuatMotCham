"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { RiCloseFill } from "react-icons/ri";
import { GrNext, GrPrevious } from "react-icons/gr";
import { motion, AnimatePresence } from "framer-motion";

interface ImagePreviewProps {
  imgUrls: string[];
}

export default function ImagePreview({ imgUrls }: ImagePreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const openModal = (idx = 0) => {
    setActiveIndex(idx);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (isModalOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isModalOpen]);

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowRight")
        setActiveIndex((i) => Math.min(i + 1, imgUrls.length - 1));
      if (event.key === "ArrowLeft") setActiveIndex((i) => Math.max(i - 1, 0));
    };
    if (isModalOpen) document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  }, [isModalOpen, imgUrls.length]);

  if (!imgUrls || imgUrls.length === 0) return null;

  return (
    <div>
      {/* Mobile: vertical stack of first 3 images (clickable) - larger display */}
      <div className="flex md:hidden flex-col gap-3">
        {imgUrls.slice(0, 3).map((item, idx) => (
          <div key={idx} onClick={() => openModal(idx)} className="relative w-full h-[200px] cursor-pointer">
            <Image src={item} alt={`Preview ${idx}`} fill className="object-cover rounded-xl" />
          </div>
        ))}
      </div>

      {/* Desktop grid preview (hidden on mobile) - keeps original 5-image appearance on md+ */}
      <div className="hidden md:grid grid-cols-4 gap-2">
        <div
          onClick={() => openModal(0)}
          className="col-span-2 cursor-pointer relative h-[500px]"
        >
          <Image
            src={imgUrls[0]}
            alt="Preview 0"
            fill
            className="object-cover rounded-xl"
          />
        </div>

        <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-2">
          {imgUrls.slice(1, 5).map((item, index) => (
            <div
              key={index}
              onClick={() => openModal(index + 1)}
              className="cursor-pointer relative h-[246px]"
            >
              <Image
                src={item}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="overflow-hidden fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-50 flex items-start justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="fixed top-4 right-4 text-[#1446a0] text-3xl z-50 cursor-pointer bg-white bg-opacity-80 rounded-full p-1 shadow"
            >
              <RiCloseFill />
            </button>

            {/* Prev / Next buttons (desktop only) */}
            <div className="absolute inset-0 hidden md:flex items-center justify-between px-6">
              <button
                onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
                disabled={activeIndex === 0}
                className="p-3 rounded-full cursor-pointer bg-white border hover:bg-opacity-100 shadow-lg disabled:opacity-60"
              >
                <GrPrevious className="text-2xl text-[#1446a0]" />
              </button>
              <button
                onClick={() =>
                  setActiveIndex((i) => Math.min(i + 1, imgUrls.length - 1))
                }
                disabled={activeIndex === imgUrls.length - 1}
                className="p-3 rounded-full cursor-pointer bg-white border shadow-lg disabled:opacity-60"
              >
                <GrNext className="text-2xl text-[#1446a0]" />
              </button>
            </div>

            {/* Content */}
            <div
              ref={containerRef}
              className="w-full max-w-screen-2xl py-20 px-4 flex flex-col items-center gap-6"
            >
              {/* Big image with swipe */}
              <div className="w-full flex items-center justify-center">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-auto max-h-[100vh]"
                >
                  <motion.div
                    className="relative w-full h-[50vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh]"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      if (
                        info.offset.x < -100 &&
                        activeIndex < imgUrls.length - 1
                      ) {
                        setActiveIndex(activeIndex + 1);
                      } else if (info.offset.x > 100 && activeIndex > 0) {
                        setActiveIndex(activeIndex - 1);
                      }
                    }}
                  >
                    <Image
                      src={imgUrls[activeIndex]}
                      alt={`Image ${activeIndex}`}
                      fill
                      className="object-contain rounded-xl select-none pointer-events-none"
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Mobile next/prev below image */}
              <div className="flex md:hidden items-center justify-center gap-6 mt-4">
                <button
                  onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
                  disabled={activeIndex === 0}
                  className="p-2 rounded-full bg-white bg-opacity-60 hover:bg-opacity-100 border shadow-lg disabled:opacity-40 cursor-pointer"
                >
                  <GrPrevious className="text-xl text-[#1446a0]" />
                </button>
                <button
                  onClick={() =>
                    setActiveIndex((i) => Math.min(i + 1, imgUrls.length - 1))
                  }
                  disabled={activeIndex === imgUrls.length - 1}
                  className="p-2 rounded-full bg-white bg-opacity-60 hover:bg-opacity-100 border shadow-lg disabled:opacity-40 cursor-pointer"
                >
                  <GrNext className="text-xl text-[#1446a0]" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="w-full max-w-4xl overflow-x-auto flex gap-3">
                {imgUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex-shrink-0 rounded-lg overflow-hidden ${
                      i === activeIndex ? "ring-4" : ""
                    }`}
                    style={
                      i === activeIndex
                        ? { boxShadow: "0 0 0 4px rgba(20,70,160,0.16)" }
                        : undefined
                    }
                  >
                    <div className="relative h-24 w-40">
                      <Image
                        src={url}
                        alt={`thumb-${i}`}
                        fill
                        className="object-cover cursor-pointer"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
