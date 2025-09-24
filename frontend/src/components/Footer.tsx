import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#0b3b8a] text-white py-12">
      <div className="container mx-auto px-4">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <Image src="/logo.png" alt="Tâm Lạc Center Logo" width={48} height={48} className="h-12 mr-3" />
              <span className="text-2xl font-bold">Tâm Lạc Center</span>
            </div>
            <p className="text-gray-300 mb-4">
              Hỗ trợ người cao tuổi tiếp cận pháp luật một cách đơn giản, trực
              quan và dễ hiểu.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61578602938093" className="text-white hover:text-primary-300" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-6">Liên Kết Nhanh</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Trang Chủ</a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">Dịch Vụ</a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">Cách Thức Hoạt Động</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Liên Hệ</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-6">Thủ Tục Phổ Biến</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Sao y công chứng</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Cấp lại CCCD</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Giấy kết hôn</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Di chúc và thừa kế</a>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center md:justify-start">
            <div className="text-center md:text-left">
              <Image src="/game_qrcode.jpg" alt="QR code Tâm Lạc" width={160} height={160} className="rounded-md" />
              <div className="mt-2 text-gray-300 text-sm">Quét mã để chơi</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-900 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Tâm Lạc Center. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
