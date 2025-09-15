
"use client";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white py-2 px-4 sm:px-8 shadow-sm transition-all duration-500 ease-in-out mb-5" style={{ fontFamily: 'Arial, Helvetica, "Segoe UI", "Roboto", "Noto Sans", "Liberation Sans", "sans-serif"' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: small spacer to allow logo nudging */}
        <div className="w-1/3 flex items-center">
          <div className="ml-4"> {/* nudge logo slightly right */}
            <Link href="/home">
              <Image src="/logo.png" alt="Logo" width={80} height={80} />
            </Link>
          </div>
        </div>

        {/* Center: Navigation */}
        <nav className="w-1/3 flex items-center justify-center">
          <div className="hidden md:flex items-center gap-8">
            <Link href="/home" className="text-[#0074F8] text-lg font-bold hover:underline underline-offset-4 transition-all">Trang Chủ</Link>
            <Link href="/explore" className="text-[#222] text-lg font-bold hover:text-[#0074F8] hover:underline underline-offset-4 transition-all">Khám phá</Link>
            <Link href="/meeting" className="text-[#222] text-lg font-bold hover:text-[#0074F8] hover:underline underline-offset-4 transition-all">Phòng họp online</Link>
          </div>
        </nav>

        {/* Right: empty for symmetry (reserve space for actions) */}
        <div className="w-1/3 flex justify-end">
          {/* reserved */}
        </div>
      </div>
    </header>
  );
}
