"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <main className="w-full">
      {/* Hero */}
      <section className="relative bg-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#3576e5] mb-6">Tâm Lạc Center — Sứ mệnh & Tầm nhìn</h1>
            <p className="text-lg text-[#223] mb-6 max-w-xl">Tâm Lạc Center hướng tới trở thành trung tâm chăm sóc tinh thần hàng đầu, mang đến cho người cao tuổi một cuộc sống an vui, ý nghĩa và đầy kết nối.</p>
            <div className="flex gap-4">
              <a href="#mission" className="bg-[#0074F8] text-white px-6 py-3 rounded-lg font-semibold">Tìm hiểu sứ mệnh</a>
              <a href="#gallery" className="border border-[#0074F8] text-[#0074F8] px-6 py-3 rounded-lg font-semibold">Xem hình ảnh</a>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image src="/mascot/8.mp4" alt="Hero" width={900} height={600} className="object-cover w-full h-96" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="bg-[#eaf6ff] py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#3576e5] mb-4">Không Gian Chăm Sóc Tinh Thần Cho Người Cao Tuổi</h2>
            <p className="text-lg text-[#334155] mb-6">Chúng tôi bắt đầu từ những buổi trò chuyện lắng nghe, hoạt động sáng tạo và các chương trình kết nối - giúp mang niềm vui và ý nghĩa trở lại cuộc sống.</p>
            <ul className="space-y-3 text-[#334155]">
              <li>• Mỗi ngày là cơ hội để sống vui và sẻ chia.</li>
              <li>• Người cao tuổi được chăm sóc cả sức khỏe lẫn tinh thần.</li>
              <li>• Chúng tôi tạo ra những hoạt động ý nghĩa và kết nối.</li>
            </ul>
          </div>
          <div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src="/assets/nhadat.png" alt="activities" className="w-full h-80 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-[#3576e5] mb-8">Hoạt động thực tế ý nghĩa</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <img src="/assets/nhadat.png" alt="g1" className="w-full h-56 object-cover rounded-xl shadow" />
            <img src="/assets/nhadat.png" alt="g2" className="w-full h-56 object-cover rounded-xl shadow" />
            <img src="/assets/nhadat.png" alt="g3" className="w-full h-56 object-cover rounded-xl shadow" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#e8f7ff] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-[#3576e5] mb-8 text-center">Cảm nhận học viên & gia đình</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <blockquote className="bg-white p-6 rounded-xl shadow"> <p>Lâu rồi tôi mới háo hức chờ đến thứ hai, ở đây có rất nhiều thứ thú vị để làm.</p> <footer className="mt-4 text-sm text-gray-500">— Bà Lê Lan</footer></blockquote>
            <blockquote className="bg-white p-6 rounded-xl shadow"> <p>Tôi được tự tay làm đồ thủ công, vẽ tranh sáng tạo, làm quen được vs nhiều người cùng sở thích rất vui.</p> <footer className="mt-4 text-sm text-gray-500">— Cụ Tâm</footer></blockquote>
            <blockquote className="bg-white p-6 rounded-xl shadow"> <p>Thấy mẹ cười mỗi ngày là điều quý giá nhất.</p> <footer className="mt-4 text-sm text-gray-500">— Chị Hương</footer></blockquote>
          </div>
        </div>
      </section>
    </main>
  );
}
