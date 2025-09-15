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
import { AnimatedBackground } from '../ui/AnimatedBackground'
import { MorphingBlob } from '../ui/MorphingBlob'

export function Services() {
  const router = useRouter()
  const [isPlayingAll, setIsPlayingAll] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
    const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playlistIndexRef = useRef(0)
  const endedHandlerRef = useRef<(() => void) | null>(null)
  const pauseHandlerRef = useRef<(() => void) | null>(null)

  const services = [
    { icon: FileTextIcon, title: 'Sao y công chứng', description: 'Hướng dẫn trực quan các bước sao y công chứng giấy tờ quan trọng.', audio: '/assets/saoy.mp3', route: '/saoy' },
    { icon: CreditCardIcon, title: 'Cấp lại CCCD', description: 'Quy trình đơn giản để làm lại Căn cước công dân khi bị mất hoặc hết hạn.', audio: '/assets/cccd.mp3', route: '/cccd' },
    { icon: PiggyBankIcon, title: 'Lương hưu', description: 'Hướng dẫn thủ tục nhận lương hưu và các quyền lợi liên quan một cách rõ ràng.', audio: '/assets/luonghuu.mp3', route: '/luonghuu' },
    { icon: UserCheckIcon, title: 'Xác nhận cư trú', description: 'Các bước xác nhận cư trú tại địa phương với thủ tục đơn giản.', audio: '/assets/xacnhancutru.mp3', route: '/cutru' },
    { icon: HomeIcon, title: 'Giấy tờ nhà đất', description: 'Hướng dẫn làm các thủ tục liên quan đến sổ đỏ và giấy tờ nhà đất.', audio: '/assets/nhadat.mp3', route: '/nhadat' },
    { icon: HeartHandshakeIcon, title: 'Di chúc và thừa kế', description: 'Thông tin về cách lập di chúc hợp pháp và thủ tục thừa kế.', audio: '/assets/dichuc.mp3', route: '/dichuc' },
  ]

  // Build playlist: start with the intro/support audio, then services in displayed order
  const getPlaylist = () => ['/assets/dichvuhotro.mp3', ...services.map((s) => s.audio)]

  const playAudio = (src: string) => {
    // If a playlist is playing, stop and reset it — playAll is independent
    if (isPlayingAll) {
      setIsPlayingAll(false)
      playlistIndexRef.current = 0
    }

    // remove any existing listeners on the current audio
    if (audioRef.current) {
      try {
        if (endedHandlerRef.current) {
          audioRef.current.removeEventListener('ended', endedHandlerRef.current)
          endedHandlerRef.current = null
        }
        if (pauseHandlerRef.current) {
          audioRef.current.removeEventListener('pause', pauseHandlerRef.current)
          pauseHandlerRef.current = null
        }
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      } catch (err) {
        // ignore
      }
    }

    const audio = new Audio(src)
    audioRef.current = audio
    setIsPaused(false)
    audio.play()
  }

  const playNextInPlaylist = async () => {
    const currentPlaylist = getPlaylist()
    if (playlistIndexRef.current >= currentPlaylist.length) {
      setIsPlayingAll(false)
      playlistIndexRef.current = 0
      setCurrentPlaylistIndex(null)
      return
    }

    const file = currentPlaylist[playlistIndexRef.current]

    // stop any currently playing audio and remove listeners
    if (audioRef.current) {
      try {
        if (endedHandlerRef.current) {
          audioRef.current.removeEventListener('ended', endedHandlerRef.current)
        }
        if (pauseHandlerRef.current) {
          audioRef.current.removeEventListener('pause', pauseHandlerRef.current)
        }
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      } catch (err) {
        // ignore
      }
      endedHandlerRef.current = null
      pauseHandlerRef.current = null
    }

    const audio = new Audio(file)
    audioRef.current = audio
    setCurrentPlaylistIndex(playlistIndexRef.current)

    const onEnded = () => {
      // advance index then attempt to play next
      playlistIndexRef.current++
      playNextInPlaylist()
    }
    endedHandlerRef.current = onEnded
    audio.addEventListener('ended', onEnded)

    // don't remove 'ended' listener on pause — allow 'ended' to drive playlist progression

    setIsPaused(false)
    try {
      const playResult = audio.play()
      if (playResult && typeof playResult.then === 'function') {
        await playResult
      }
    } catch (err) {
      // If playback fails (browser policy), stop playlist and cleanup
      setIsPlayingAll(false)
      setCurrentPlaylistIndex(null)
      try {
        if (endedHandlerRef.current && audioRef.current) audioRef.current.removeEventListener('ended', endedHandlerRef.current)
        if (pauseHandlerRef.current && audioRef.current) audioRef.current.removeEventListener('pause', pauseHandlerRef.current)
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
      } catch (e) {
        // ignore
      }
    }
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

  // cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        try {
          if (endedHandlerRef.current) {
            audioRef.current.removeEventListener('ended', endedHandlerRef.current)
          }
          if (pauseHandlerRef.current) {
            audioRef.current.removeEventListener('pause', pauseHandlerRef.current)
          }
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        } catch (err) {
          // ignore
        }
      }
      endedHandlerRef.current = null
      pauseHandlerRef.current = null
    }
  }, [])

  return (
    <section id="services" className="relative py-20 bg-white w-full overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <AnimatedBackground className="opacity-60" />
        <MorphingBlob className="-top-24 left-4 w-1/3 h-56 opacity-80" />
      </div>
      <div className="container mx-auto px-4 relative z-20">
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
          <div className="mt-6 flex justify-center">
            {!isPlayingAll ? (
              <motion.button
                onClick={playAllAudio}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 rounded-full shadow-lg text-lg font-semibold transition-all bg-[#0074F8] hover:bg-[#005ecb] text-white"
              >
                <Volume2Icon className="mr-2" size={20} />
                Đọc toàn bộ
              </motion.button>
            ) : (
              <motion.button
                onClick={togglePause}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 rounded-full shadow-lg text-lg font-semibold transition-all bg-[#0074F8] hover:bg-[#005ecb] text-white"
              >
                {isPaused ? <PlayIcon className="mr-2" size={18} /> : <PauseIcon className="mr-2" size={18} />}
                {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
              </motion.button>
            )}
          </div>
        </div>

        {/* Grid dịch vụ: image-on-top, centered caption under description */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            const imgMap: Record<string, string> = {
              '/saoy': '/assets/congchung.png',
              '/cccd': '/assets/cccd.png',
              '/luonghuu': '/assets/huutri.png',
              '/cutru': '/assets/cutru.png',
              '/nhadat': '/assets/nhadat.png',
              '/dichuc': '/assets/dichuc.png',
            }
            const imgSrc = imgMap[service.route] || '/assets/saoy.png'

            return (
              <motion.div
                key={index}
                whileHover={{ translateY: -6 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transition-all border border-transparent hover:border-blue-50"
                onClick={() => router.push(service.route)}
              >
                {/* Image */}
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center relative">
                  <img
                    src={imgSrc}
                    alt={service.title}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                  <button
                    className="absolute bottom-3 right-3 bg-[#0074F8] p-3 rounded-full shadow-lg transform transition-transform hover:scale-105 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation()
                      playAudio(service.audio)
                    }}
                    aria-label={`Nghe ${service.title}`}
                  >
                    <Volume2Icon size={24} className="text-white" />
                  </button>
                </div>

                {/* Content with left icon */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-lg bg-[#eef6ff] flex items-center justify-center">
                        <Icon size={22} className="text-[#0074F8]" />
                      </div>
                    </div>

                    <div className="flex-1 text-left">
                      <h3 className="text-2xl font-extrabold text-[#2b6fd6] mb-2">{service.title}</h3>
                      <p className="text-base text-gray-600 mb-4">{service.description}</p>

                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(service.route)
                          }}
                          className="text-sm text-[#0074F8] font-semibold"
                        >
                          Tìm Hiểu Thêm →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
