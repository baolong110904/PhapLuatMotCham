import React from 'react'
import { motion } from 'framer-motion'

export type FeatureStep = {
  icon: React.ReactNode
  title: string
  image: string // Added image property
}

export default function FeatureBox({ step, index, onHover }: { step: FeatureStep; index?: number; onHover?: () => void }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-4 relative cursor-pointer w-full sm:max-w-[240px] min-h-[72px] flex items-center justify-center"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.18 }}
      onMouseEnter={() => onHover?.()}
      onClick={() => onHover?.()}
    >
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-blue-100 rounded-xl opacity-18 -z-10"
        style={{ opacity: 0.16 }}
        animate={{ opacity: [0.12, 0.28, 0.12] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror', delay: (index || 0) * 0.45 }}
      />
      <motion.div className="flex items-center justify-center py-2 space-x-3" whileHover={{ scale: 1.03 }} transition={{ duration: 0.18 }}>
        <div className="bg-blue-50 p-3 rounded-full">{step.icon}</div>
        <h3 className="text-base font-semibold text-black text-center truncate">{step.title}</h3>
      </motion.div>
    </motion.div>
  )
}
