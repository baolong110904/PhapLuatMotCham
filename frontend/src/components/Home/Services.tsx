'use client'
import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  FileTextIcon,
  CreditCardIcon,
  PiggyBankIcon,
  UserCheckIcon,
  HomeIcon,
  HeartHandshakeIcon,
  Volume2Icon,
  PauseIcon,
  PlayIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Services() {
  const router = useRouter()
  const [isPlayingAll, setIsPlayingAll] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playlistIndexRef = useRef(0)

  const services = [
    { icon: FileTextIcon, title: 'Sao y công chứng', description: 'Hướng dẫn trực quan các bước sao y công chứng giấy tờ quan trọng.', audio: '/assets/saoy.mp3', route: '/saoy' },
    { icon: CreditCardIcon, title: 'Cấp lại CCCD', description: 'Quy trình đơn giản để làm lại Căn cước công dân khi bị mất hoặc hết hạn.', audio: '/assets/cccd.mp3', route: '/cccd' },
    { icon: PiggyBankIcon, title: 'Lương hưu', description: 'Hướng dẫn thủ tục nhận lương hưu và các quyền lợi liên quan một cách rõ ràng.', audio: '/assets/luonghuu.mp3', route: '/luonghuu' },
    { icon: UserCheckIcon, title: 'Xác nhận cư trú', description: 'Các bước xác nhận cư trú tại địa phương với thủ tục đơn giản.', audio: '/assets/xacnhancutru.mp3', route: '/cutru' },
    { icon: HomeIcon, title: 'Giấy tờ nhà đất', description: 'Hướng dẫn làm các thủ tục liên quan đến sổ đỏ và giấy tờ nhà đất.', audio: '/assets/nhadat.mp3', route: '/nhadat' },
    { icon: HeartHandshakeIcon, title: 'Di chúc và thừa kế', description: 'Thông tin về cách lập di chúc hợp pháp và thủ tục thừa kế.', audio: '/assets/dichuc.mp3', route: '/dichuc' },
  ]

  const playlist = [
    '/assets/dichvuhotro.mp3',
    '/assets/saoy.mp3',
    '/assets/cccd.mp3',
    '/assets/luonghuu.mp3',
    '/assets/xacnhancutru.mp3',
    '/assets/nhadat.mp3',
    '/assets/dichuc.mp3',
  ]

  const playAudio = (src: string) => {
    const audio = new Audio(src)
    audio.play()
  }

  const playNextInPlaylist = () => {
    if (playlistIndexRef.current >= playlist.length) {
      setIsPlayingAll(false)
      return
    }
    const file = playlist[playlistIndexRef.current]
    const audio = new Audio(file)
    audioRef.current = audio
    audio.addEventListener('ended', () => {
      playlistIndexRef.current++
      playNextInPlaylist()
    })
    audio.play()
  }

  const playAllAudio = () => {
    playlistIndexRef.current = 0
    setIsPlayingAll(true)
    setIsPaused(false)
    playNextInPlaylist()
  }

  const togglePause = () => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play()
        setIsPaused(false)
      } else {
        audioRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  return (
    <section id="services" className="relative py-20 bg-white w-full">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-[#3576e5] mb-4 drop-shadow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Dịch Vụ Hỗ Trợ Pháp Lý
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Với những hướng dẫn trực quan và dễ hiểu, Tâm Lạc giúp các thủ tục pháp lý trở nên đơn giản hơn.
          </motion.p>
        </div>

        {/* Grid dịch vụ */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-8 cursor-pointer transition-all border border-blue-100"
                onClick={() => router.push(service.route)}
              >
                <div
                  className="mb-6 flex justify-center"
                  onClick={(e) => {
                    e.stopPropagation()
                    playAudio(service.audio)
                  }}
                >
                  <Icon size={56} className="text-[#0074F8] drop-shadow cursor-pointer" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                  {service.title}
                </h3>
                <p className="text-lg text-gray-600 text-center">{service.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Nút đọc toàn bộ + nút dừng / tiếp tục */}
        <div className="text-center mt-12 flex justify-center gap-4">
          {!isPlayingAll ? (
            <motion.button
              onClick={playAllAudio}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 rounded-full shadow-lg text-lg font-semibold transition-all bg-[#0074F8] hover:bg-[#005ecb] text-white"
            >
              <Volume2Icon className="mr-3" size={26} />
              Đọc toàn bộ
            </motion.button>
          ) : (
            <motion.button
              onClick={togglePause}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 rounded-full shadow-lg text-lg font-semibold transition-all bg-[#0074F8] hover:bg-[#005ecb] text-white"
            >
              {isPaused ? <PlayIcon className="mr-3" size={26} /> : <PauseIcon className="mr-3" size={26} />}
              {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
            </motion.button>
          )}
        </div>
      </div>
    </section>
  )
}
