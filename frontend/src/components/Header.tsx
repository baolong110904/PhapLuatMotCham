"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -20, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" as const },
    },
    exit: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: { duration: 0.2, ease: "easeInOut" as const },
    },
  };

  return (
    <header
      className="w-full bg-white py-2 px-4 sm:px-8 shadow-sm transition-all duration-500 ease-in-out mb-5 relative"
      style={{
        fontFamily:
          'Arial, Helvetica, "Segoe UI", "Roboto", "Noto Sans", "Liberation Sans", "sans-serif"',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={60} height={60} />
          </Link>
        </div>
        
        {/* Center: Navigation (absolute center for desktop) */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          <Link
            href="/"
            className="text-[#0074F8] text-lg font-bold hover:underline underline-offset-4 transition-all"
          >
            Trang Chủ
          </Link>
          <Link
            href="/quiz"
            className="text-[#222] text-lg font-bold hover:text-[#0074F8] hover:underline underline-offset-4 transition-all"
          >
            Khám phá
          </Link>
          <Link
            href="/meeting"
            className="text-[#222] text-lg font-bold hover:text-[#0074F8] hover:underline underline-offset-4 transition-all"
          >
            Phòng họp online
          </Link>
        </nav>

        {/* Right: Mobile button (hidden on desktop) */}
        <div className="md:hidden">
          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            className="md:hidden flex flex-col items-start gap-3 px-2 pb-3 bg-white border-t overflow-hidden"
          >
            <Link
              href="/"
              className="w-full text-[#0074F8] text-lg font-bold py-2 hover:bg-gray-50 rounded-md px-2"
              onClick={() => setIsOpen(false)}
            >
              Trang Chủ
            </Link>
            <Link
              href="/quiz"
              className="w-full text-[#222] text-lg font-bold py-2 hover:bg-gray-50 rounded-md px-2"
              onClick={() => setIsOpen(false)}
            >
              Khám phá
            </Link>
            <Link
              href="/meeting"
              className="w-full text-[#222] text-lg font-bold py-2 hover:bg-gray-50 rounded-md px-2"
              onClick={() => setIsOpen(false)}
            >
              Phòng họp online
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
