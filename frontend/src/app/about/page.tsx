"use client";

import Image from 'next/image';
import ImagePreview from '@/components/ImagePreview';
import ReviewsSection from '@/components/ReviewsSection';

export default function AboutPage() {
  const sampleReviews = [
    { id: 'r1', userName: 'Bà Lê Lan', rating: 5, date: '2025-07-12', comment: 'Lâu rồi tôi mới háo hức chờ đến thứ hai, ở đây có rất nhiều thứ thú vị để làm.' },
    { id: 'r2', userName: 'Cụ Tâm', rating: 5, date: '2025-06-22', comment: 'Tôi được tự tay làm đồ thủ công, vẽ tranh sáng tạo, làm quen được với nhiều người cùng sở thích rất vui.' },
    { id: 'r3', userName: 'Chị Hương', rating: 5, date: '2025-05-10', comment: 'Thấy mẹ cười mỗi ngày là điều quý giá nhất.' },
    { id: 'r4', userName: 'Anh Nam', rating: 4, date: '2025-04-02', comment: 'Chương trình rất ý nghĩa và nhân viên thân thiện, phù hợp cho người cao tuổi.' },
    { id: 'r5', userName: 'Cô Mai', rating: 5, date: '2025-03-18', comment: 'Hoạt động hay, nhiều trò để tham gia và kết nối với mọi người.' }
  ];

  return (
    <main className="w-full text-lg">
      {/* Hero */}
      <section className="relative bg-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#3576e5] mb-6">Tâm Lạc Center — Sứ mệnh & Tầm nhìn</h1>
            <p className="text-lg text-[#223] mb-6 max-w-xl">Tâm Lạc Center hướng tới trở thành trung tâm chăm sóc tinh thần hàng đầu, <span className="whitespace-nowrap">mang đến</span> cho người cao tuổi một cuộc sống an vui, ý nghĩa và đầy kết nối.</p>
            <div className="flex gap-4">
              <a href="#mission" className="bg-[#0074F8] text-white px-6 py-3 rounded-lg font-semibold">Tìm hiểu sứ mệnh</a>
              <a href="#gallery" className="border border-[#0074F8] text-[#0074F8] px-6 py-3 rounded-lg font-semibold">Xem hình ảnh</a>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="rounded-xl overflow-hidden">
              <video src="/mascot/2.mp4" className="object-cover w-full h-full" controls={false} autoPlay muted loop playsInline />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="relative py-20 overflow-hidden">
        {/* layered animated gradient with radial highlights */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="w-full h-full" style={{
            background: `radial-gradient(800px 400px at 10% 20%, rgba(255,255,255,0.6), transparent 15%),
                        radial-gradient(600px 300px at 90% 80%, rgba(240,249,255,0.7), transparent 20%),
                        linear-gradient(120deg, rgba(230,249,255,1) 0%, rgba(200,235,255,1) 30%, rgba(180,220,255,1) 60%, rgba(218,245,255,1) 100%)`,
            backgroundSize: '240% 240%, 200% 200%, 200% 200%',
            animation: 'radialFloat 18s ease-in-out infinite, moveGradient 12s linear infinite'
          }} />
          {/* subtle diagonal sheen */}
          <div className="pointer-events-none absolute inset-0 opacity-20" style={{
            background: 'linear-gradient(120deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.06) 100%)',
            mixBlendMode: 'overlay',
            transform: 'skewX(-12deg) translateX(-10%)'
          }} />
        </div>
        <style>{`
          @keyframes moveGradient { 0% { background-position: 0% 50%, 0% 50%, 0% 50%; } 50% { background-position: 100% 50%, 100% 50%, 100% 50%; } 100% { background-position: 0% 50%, 0% 50%, 0% 50%; } }
          @keyframes radialFloat { 0% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-8px) scale(1.02); } 100% { transform: translateY(0px) scale(1); } }
        `}</style>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h2 className="text-4xl font-bold text-[#1446a0] mb-8">Không Gian Chăm Sóc Tinh Thần Cho Người Cao Tuổi</h2>
            <p className="text-lg text-[#334155] mb-6">Chúng tôi bắt đầu từ những buổi trò chuyện lắng nghe, <span className="whitespace-nowrap">hoạt động sáng tạo</span> và các chương trình kết nối — giúp <span className="whitespace-nowrap">mang niềm vui</span> và ý nghĩa trở lại cuộc sống.</p>
            <ul className="space-y-3 text-[#334155]">
              <li>• Mỗi ngày là cơ hội để sống vui và sẻ chia.</li>
              <li>• Người cao tuổi được chăm sóc cả sức khỏe lẫn tinh thần.</li>
              <li>• Chúng tôi tạo ra những <span className="whitespace-nowrap">hoạt động ý nghĩa</span> và kết nối.</li>
            </ul>
          </div>
          <div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image src="/assets/nhadat.png" alt="activities" width={800} height={480} className="w-full h-80 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-[#3576e5] mb-8">Hoạt động thực tế ý nghĩa</h3>
          <div className="mb-6">
            {/* Use ImagePreview for 4/5 layout and preview modal */}
            <div className="rounded-xl overflow-hidden">
              <ImagePreview imgUrls={[
                '/assets/nhadat.png',
                '/assets/dichuc.png',
                '/assets/thaotacdongian.png',
                '/assets/hinhanhminhhoa.png',
                '/assets/hotroamthanh.png'
              ]} />
            </div>
          </div>
        </div>
      </section>
      {/* Decorative wave separator moved to the end of the Gallery (above Testimonials) */}
      <div className="relative -mt-6 z-20">
        <div className="w-full bg-transparent">
          <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,64 Q48,72 96,80 C192,96,384,96,576,85.3 C768,75,960,96,1152,85.3 C1248,75,1344,64,1392,58 Q1408,54 1440,50 L1440,121 L0,121 Z" fill="#dff5ff"></path>
          </svg>
        </div>
      </div>

      {/* Testimonials */}
      <section className="relative py-5">
        {/* use the layered animated gradient (same as Mission) as the background for Testimonials */}
        <div aria-hidden className="absolute inset-0 -z-10" style={{
          backgroundColor: '#dff5ff'
        }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12">
          <ReviewsSection overallRating={4.9} totalReviews={sampleReviews.length} reviews={sampleReviews} />
        </div>
      </section>
    </main>
  );
}
