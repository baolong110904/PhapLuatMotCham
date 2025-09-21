import React, { useEffect, useRef, useState } from 'react'
import globalAudio from '../../lib/globalAudio'
import { motion } from 'framer-motion'
import { ImageIcon, VolumeIcon, MousePointerIcon, SmartphoneIcon } from 'lucide-react'
import RoadTimeline from './RoadTimeline'

export function HowItWorks() {
  const steps = [
    {
      icon: <ImageIcon size={36} className="text-primary-500" />,
      title: 'Hình ảnh minh họa',
      image: '/mascot/Mascot.png', 
    },
    {
      icon: <VolumeIcon size={36} className="text-primary-500" />,
      title: 'Giọng đọc tự động',
      image: '/mascot/Mascot2.png',
    },
    {
      icon: <MousePointerIcon size={36} className="text-primary-500" />,
      title: 'Thao tác đơn giản',
      image: '/mascot/Mascot3.png',
    },
    {
      icon: <SmartphoneIcon size={36} className="text-primary-500" />,
      title: 'Mọi thiết bị',
      image: '/mascot/Mascot4.png',
    },
  ]

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

