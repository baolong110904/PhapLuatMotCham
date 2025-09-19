import React from 'react'
import { motion } from 'framer-motion'
import FeatureBox, { FeatureStep } from './FeatureBox'

export default function RoadTimeline({ steps, onSelect }: { steps: FeatureStep[]; onSelect?: (i: number) => void }) {
  const roadVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 1.2, bounce: 0 }, opacity: { duration: 0.6 } } },
  }

  return (
    <div className="relative bg-white">
      {/* Desktop SVG Road - original design */}
      <div className="hidden md:block relative h-[800px] overflow-visible bg-white">
        <svg
          className="absolute inset-0 w-full h-full z-0"
          viewBox="0 0 1200 800"
          fill="none"
          preserveAspectRatio="xMidYMax meet"
        >
          {/* Main Road */}
          <motion.path
            d="M-200,100 C300,100 350,200 350,300 C350,400 250,500 350,600 C450,700 750,700 850,600 C950,500 850,400 850,300 C850,200 900,100 1400,100" /* Further extended path */
            stroke="#2589ff"
            strokeWidth="40" /* Increased width */
            strokeLinecap="round"
            fill="none"
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={roadVariants}
          />
          {/* Road dashed line */}
          <motion.path
            d="M-200,100 C300,100 350,200 350,300 C350,400 250,500 350,600 C450,700 750,700 850,600 C950,500 850,400 850,300 C850,200 900,100 1400,100" /* Further extended path */
            stroke="white"
            strokeWidth="6" /* Adjusted dashed line width */
            strokeLinecap="round"
            strokeDasharray="20,20"
            fill="none"
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              delay: 0.8,
              duration: 0.6,
            }}
          />
          {/* Milestones/Points - 4 evenly distributed */}
          {[250, 330, 850, 920].map((cx, i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={[155, 580, 600, 170][i]}
              r="30"
              fill="#2589ff"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.3, type: 'spring' }}
            />
          ))}
        </svg>
        {/* Feature Boxes */}
        {[{ left: 20, top: 160 }, { left: 80, top: 500 }, { left: 1000, top: 500 }, { left: 1100, top: 170 }].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute z-10"
            style={{ left: pos.left, top: pos.top, width: 300 }}
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
              amount: 0.6,
            }}
            transition={{
              delay: 0.4 + i * 0.3,
              duration: 0.6,
            }}
          >
            <div className="flex flex-col items-center">
              <img src={steps[i].image} alt={steps[i].title} className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover rounded-full mb-3" />
              <FeatureBox step={steps[i]} index={i} onHover={() => onSelect?.(i)} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Centered callout circle (desktop only) */}
      <div className="hidden md:flex items-center justify-center w-full mt-[-600px] mb-8 relative">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-full shadow-2xl flex items-center justify-center text-center p-8" style={{ width: 360, height: 360, zIndex: 60, boxShadow: '0 30px 60px rgba(37,137,255,0.08)' }}>
          <div className="px-4">
            <h3 className="text-2xl md:text-3xl font-extrabold text-blue-800 mb-3">Không cần văn bản phức tạp</h3>
            <p className="text-gray-600 max-w-sm mx-auto">Thay vì đọc những văn bản pháp lý dài và khó hiểu, bạn chỉ cần xem hình ảnh minh họa và nghe giọng đọc hướng dẫn rõ ràng từng bước một.</p>
          </div>
        </div>
      </div>

      {/* Mobile vertical timeline */}
      <div className="md:hidden relative px-4">
        <div className="absolute left-1/2 top-0 bottom-0 w-3 bg-primary-500 rounded-full transform -translate-x-1/2" />
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white rounded-full transform -translate-x-1/2" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 12px, white 12px, white 24px)' }} />

        {steps.map((step, index) => (
          <div key={index} className="relative mb-10 pt-6">
            <motion.div className="w-9 h-9 bg-primary-500 rounded-full absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ stiffness: 260, damping: 22, delay: 0.15 + index * 0.05 }} />
            <motion.div className={`w-full`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 + index * 0.05, duration: 0.5 }}>
              <div className="flex flex-col items-center bg-transparent px-2">
                <img src={step.image} alt={step.title} className="w-44 h-44 md:w-44 md:h-44 lg:w-44 lg:h-44 object-cover rounded-full mb-4" />
                <div className="w-full px-4">
                  <FeatureBox step={step} index={index} onHover={() => onSelect?.(index)} />
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}
