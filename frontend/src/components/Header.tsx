
"use client";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white py-2 px-4 sm:px-8 flex items-center shadow-sm transition-all duration-500 ease-in-out mb-5 justify-between" style={{ fontFamily: 'Arial, Helvetica, "Segoe UI", "Roboto", "Noto Sans", "Liberation Sans", "sans-serif"' }}>
      {/* Left: Logo */}
      <div className="flex-1 flex justify-start">
        <Link href="/home">
          <Image src="/logo.png" alt="Logo" width={80} height={80} />
        </Link>
      </div>

      {/* Center: Navigation */}
      <nav className="hidden md:flex items-center gap-8 justify-center">
        <Link href="/home" className="text-[#0074F8] text-lg font-bold hover:underline underline-offset-4 transition-all">Trang Chủ</Link>
        <Link href="/explore" className="text-[#222] text-lg font-bold hover:text-[#0074F8] hover:underline underline-offset-4 transition-all">Khám phá</Link>
        <Link href="/meeting" className="text-[#222] text-lg font-bold hover:text-[#0074F8] hover:underline underline-offset-4 transition-all">Phòng họp online</Link>
      </nav>

      {/* Right: Button */}
      <div className="flex-1 flex justify-end">
        <button className="bg-[#0074F8] text-white text-lg font-bold px-6 py-3 rounded-lg shadow hover:bg-[#005ecb] transition-all">Đăng Ký Tư Vấn</button>
      </div>
    </header>
  );
}
