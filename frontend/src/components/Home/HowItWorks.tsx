import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ImageIcon, VolumeIcon, MousePointerIcon, SmartphoneIcon } from 'lucide-react'
import RoadTimeline from './RoadTimeline'

export function HowItWorks() {
  const steps = [
    {
      icon: <ImageIcon size={36} className="text-primary-500" />,
      title: 'Hình ảnh minh họa',
      image: '/assets/Mascot.png', 
    },
    {
      icon: <VolumeIcon size={36} className="text-primary-500" />,
      title: 'Giọng đọc tự động',
      image: '/assets/hotroamthanh.png', 
    },
    {
      icon: <MousePointerIcon size={36} className="text-primary-500" />,
      title: 'Thao tác đơn giản',
      image: '/assets/thaotacdongian.png', 
    },
    {
      icon: <SmartphoneIcon size={36} className="text-primary-500" />,
      title: 'Mọi thiết bị',
      image: '/assets/hotrothietbi.png', 
    },
  ]

  // images are now shown inside each FeatureBox

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/assets/cachthuchoatdong.mp3')
      audioRef.current = audio

      const handleScroll = () => {
        const section = document.getElementById('how-it-works')
        const rect = section?.getBoundingClientRect()
        const isVisible = rect && rect.top < window.innerHeight && rect.bottom > 0

        if (isVisible) {
          if (!timeoutId) {
            const id = setTimeout(() => {
              audioRef.current?.play().catch((error) => console.error('Audio play failed:', error))
            }, 5000)
            setTimeoutId(id)
          }
        } else {
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
          }
          if (timeoutId) {
            clearTimeout(timeoutId)
            setTimeoutId(null)
          }
        }
      }

      window.addEventListener('scroll', handleScroll)

      return () => {
        window.removeEventListener('scroll', handleScroll)
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
      }
    }
  }, [timeoutId])

  return (
    <>
      <section id="how-it-works" className="w-full min-h-[1200px] bg-white overflow-hidden">
        <div className="w-full px-4 relative">
          <motion.div
            className="text-center mb-16 relative z-10"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              whileInView={{
                scale: 1,
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
              }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#3576e5] mb-4 drop-shadow">
                Cách Thức Hoạt Động
              </h2>
            </motion.div>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.8,
                delay: 0.3,
              }}
            >
              Chúng tôi thiết kế hệ thống đặc biệt phù hợp với người cao tuổi
            </motion.p>
          </motion.div>

          {/* Road timeline (desktop + mobile) */}
          <RoadTimeline steps={steps} />

          <div className="mt-24 w-full p-8 md:p-12 relative">
            <div className="flex flex-col items-center relative z-10">
              {/* The FeatureBoxes are rendered inside RoadTimeline for both desktop and mobile */}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

