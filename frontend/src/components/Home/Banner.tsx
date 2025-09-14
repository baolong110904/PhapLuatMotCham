"use client";
import { FaBrain, FaHeartbeat, FaUsers } from 'react-icons/fa';

export default function Banner() {
  // Nội dung chữ bên trái
  const title = "Tâm an - Lạc sống - Vẹn tròn tuổi già";
  const desc = "Tâm Lạc Center là không gian chăm sóc tinh thần cho người cao tuổi với các hoạt động kết nối, sáng tạo và ý nghĩa. Chúng tôi tin rằng tuổi già cũng là thời gian để sống hạnh phúc.";

  // Nội dung sóng phía dưới
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

  return (
    <div className="relative w-full overflow-x-hidden bg-white">
      {/* Phần trên với video và chữ */}
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Layer video dưới chữ */}
        <div className="absolute inset-0 z-0 flex justify-end items-center pointer-events-none">
          <video
            src="/banner.mp4"
            autoPlay
            muted={false}
            className="w-[65vw] h-auto object-cover transition-opacity duration-500 ease-in-out opacity-90"
            style={{
              transform: 'translateX(25%)',
              maskImage: 'linear-gradient(to left, black 70%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 70%, transparent 100%)',
            }}
          />
        </div>
        {/* Chữ bên trái nằm trên video */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full pt-20 pb-32 px-4" style={{ minHeight: 450 }}>
          <div className="w-full md:w-1/2 md:pl-8">
            <h1 className="text-[#3576e5] text-5xl sm:text-6xl font-extrabold mb-8 leading-tight drop-shadow-lg">{title}</h1>
            <p className="text-[#222] text-xl sm:text-2xl font-medium mb-8 max-w-xl drop-shadow-lg">{desc}</p>
            <button className="bg-[#0074F8] text-white text-xl font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-[#005ecb] transition-all">Đăng ký tư vấn <span className="ml-2">→</span></button>
          </div>
          <div className="w-full md:w-1/2" />
        </div>
      </div>

      {/* Sóng SVG và nội dung bên dưới */}
      <div className="relative -mt-32 z-20">
        {/* Sóng SVG mới */}
        <div className="w-full bg-transparent">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,64 Q48,72 96,80 C192,96,384,96,576,85.3 C768,75,960,96,1152,85.3 C1248,75,1344,64,1392,58 Q1408,54 1440,50 L1440,121 L0,121 Z" fill="#3576e5"></path>
          </svg>
        </div>
        {/* Nội dung giá trị cốt lõi */}
        <div className="w-full bg-[#3576e5] py-16 px-4 text-center -mt-1">
          <div className="text-white text-lg font-semibold mb-4 tracking-wider">{coreValueTitle}</div>
          <div className="text-white text-4xl font-extrabold mb-12 max-w-4xl mx-auto" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>{coreValueDesc}</div>
          <div className="flex flex-col md:flex-row justify-center items-start gap-12 md:gap-16 w-full max-w-6xl mx-auto">
            {valueItems.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 min-w-[240px]">
                {item.icon}
                <div className="text-white text-2xl font-bold mb-3">{item.title}</div>
                <div className="text-white/90 text-base md:text-lg font-normal" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.10)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}