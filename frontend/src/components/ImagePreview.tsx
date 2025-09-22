"use client";

import { useState, useEffect, useRef } from "react";
import Image from 'next/image'
import { RiCloseFill } from "react-icons/ri";
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
      if (event.key === "ArrowRight") setActiveIndex((i) => Math.min(i + 1, imgUrls.length - 1));
      if (event.key === "ArrowLeft") setActiveIndex((i) => Math.max(i - 1, 0));
    };
    if (isModalOpen) document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  }, [isModalOpen, imgUrls.length]);

  if (!imgUrls || imgUrls.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        <div onClick={() => openModal(0)} className="col-span-2 cursor-pointer relative h-[500px]">
          <Image src={imgUrls[0]} alt="Preview 0" fill className="object-cover rounded-xl" />
        </div>

        <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-2">
          {imgUrls.slice(1, 5).map((item, index) => (
            <div key={index} onClick={() => openModal(index + 1)} className="cursor-pointer relative h-[246px]">
              <Image src={item} alt={`Preview ${index + 1}`} fill className="object-cover rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm overflow-y-auto z-50 flex items-start justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button onClick={closeModal} className="fixed top-4 right-4 text-[#1446a0] text-3xl z-50 cursor-pointer bg-white bg-opacity-80 rounded-full p-1 shadow">
              <RiCloseFill />
            </button>

            <div ref={containerRef} className="w-full max-w-screen-2xl py-20 px-4 flex flex-col items-center gap-6">
              {/* Show active image large, allow vertical scroll to browse long images */}
              <div className="w-full flex items-center justify-center">
                <motion.div key={activeIndex} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="w-full h-auto max-h-[90vh]">
                  <div className="relative w-full h-[80vh]">
                    <Image src={imgUrls[activeIndex]} alt={`Image ${activeIndex}`} fill className="object-contain rounded-xl" />
                  </div>
                </motion.div>
              </div>

              {/* thumbnails for quick jumping */}
              <div className="w-full max-w-4xl overflow-x-auto flex gap-3 py-4">
                {imgUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex-shrink-0 rounded-lg overflow-hidden ${i === activeIndex ? 'ring-4' : ''}`}
                    style={i === activeIndex ? { boxShadow: '0 0 0 4px rgba(20,70,160,0.16)' } : undefined}
                  >
                    <div className="relative h-24 w-40">
                      <Image src={url} alt={`thumb-${i}`} fill className="object-cover" />
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
