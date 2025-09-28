'use client'
import React, { useState, useRef } from 'react'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { motion } from 'framer-motion'
import {
  FileTextIcon,
  CreditCardIcon,
  PiggyBankIcon,
  UserCheckIcon,
  HomeIcon,
  HeartHandshakeIcon,
  Volume2Icon,
} from 'lucide-react'
import globalAudio from '../../lib/globalAudio'
import { useRouter } from 'next/navigation'
import { AnimatedBackground } from '../ui/AnimatedBackground'
import { MorphingBlob } from '../ui/MorphingBlob'

export function Services() {
  const router = useRouter()
  const [isPlayingAll, setIsPlayingAll] = useState(false)
  const [, setIsPaused] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playlistIndexRef = useRef(0)
  const endedHandlerRef = useRef<(() => void) | null>(null)
  const pauseHandlerRef = useRef<(() => void) | null>(null)

  const services = [
    { icon: CreditCardIcon, title: 'Cấp lại CCCD', description: 'Quy trình đơn giản để làm lại Căn cước công dân khi bị mất hoặc hết hạn.', audio: '/assets/cccd.mp3', route: '/cccd', link: '/quiz/cic'},
    { icon: PiggyBankIcon, title: 'Lương hưu', description: 'Hướng dẫn thủ tục nhận lương hưu và các quyền lợi liên quan một cách rõ ràng.', audio: '/assets/luonghuu.mp3', route: '/luonghuu', link: '/quiz/pension'},
    { icon: FileTextIcon, title: 'Sao y công chứng', description: 'Hướng dẫn trực quan các bước sao y công chứng giấy tờ quan trọng.', audio: '/assets/saoy.mp3', route: '/saoy', link: '/quiz'},
    { icon: UserCheckIcon, title: 'Xác nhận cư trú', description: 'Các bước xác nhận cư trú tại địa phương với thủ tục đơn giản.', audio: '/assets/xacnhancutru.mp3', route: '/cutru', link: '/quiz'},
    { icon: HomeIcon, title: 'Giấy tờ nhà đất', description: 'Hướng dẫn làm các thủ tục liên quan đến sổ đỏ và giấy tờ nhà đất.', audio: '/assets/nhadat.mp3', route: '/nhadat', link: '/quiz'},
    { icon: HeartHandshakeIcon, title: 'Di chúc và thừa kế', description: 'Thông tin về cách lập di chúc hợp pháp và thủ tục thừa kế.', audio: '/assets/dichuc.mp3', route: '/dichuc', link: '/quiz'},
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
      } catch {
        // ignore - audio cleanup errors are not critical
      }
    }

    const audio = new Audio(src)
    audioRef.current = audio
    setIsPaused(false)
    audio.play()
  }

  async function playNextInPlaylist() {
    const currentPlaylist = getPlaylist()
    if (playlistIndexRef.current >= currentPlaylist.length) {
      setIsPlayingAll(false)
      playlistIndexRef.current = 0
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
      } catch {
        // ignore - audio cleanup errors are not critical
      }
      endedHandlerRef.current = null
      pauseHandlerRef.current = null
    }

    const audio = new Audio(file)
    audioRef.current = audio
  // update current playing index (kept in ref)
  // playlistIndexRef.current is the current index

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
    } catch {
      // If playback fails (browser policy), stop playlist and cleanup
  setIsPlayingAll(false)
      try {
        if (endedHandlerRef.current && audioRef.current) audioRef.current.removeEventListener('ended', endedHandlerRef.current)
        if (pauseHandlerRef.current && audioRef.current) audioRef.current.removeEventListener('pause', pauseHandlerRef.current)
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
      } catch {
        // ignore
      }
    }
  }

  // Removed unused functions playAllAudio and togglePause

  // cleanup on unmount
  React.useEffect(() => {
    // subscribe to globalAudio updates
    let unsub: (() => void) | null = null
    try {
      unsub = globalAudio.subscribe((s) => {
        setIsPlayingAll(s.playing || (s.index !== undefined && (s.index as number) >= 0 && s.index < getPlaylist().length && !!getPlaylist().length && !!s.currentSrc && getPlaylist().includes(new URL(s.currentSrc!).pathname, 0)) )
        setIsPaused(s.paused)
        if (typeof s.index === 'number') {
            playlistIndexRef.current = s.index
        }
      })
    } catch {
      // ignore - fallback
    }
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
        } catch {
          // ignore
        }
      }
      endedHandlerRef.current = null
      pauseHandlerRef.current = null
      if (unsub) unsub()
    }
  // This is a singleton service, no need to include in deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
                // whileHover={{ translateY: -6 }}
                className="bg-white rounded-2xl hover:scale-102 shadow-md overflow-hidden cursor-pointer transition-all border border-transparent hover:border-blue-50"
                onClick={() => router.push(service.link)}
              >
                {/* Image */}
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center relative">
                  <OptimizedImage
                    src={imgSrc}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                  <button
                    className="cursor-pointer absolute bottom-3 right-3 bg-[#0074F8] p-3 rounded-full shadow-lg transform transition-transform hover:scale-105 focus:outline-none"
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
                            router.push(service.link)
                          }}
                          className="text-sm text-[#0074F8] font-semibold cursor-pointer"
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
