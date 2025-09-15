import React from 'react'
import { motion } from 'framer-motion'

interface MorphingBlobProps {
  className?: string
}
export function MorphingBlob({ className = '' }: MorphingBlobProps) {
  const variants = {
    initial: {
      d: 'M59.5,-48.3C75.9,-32.1,86.8,-7.8,82.8,13.5C78.9,34.9,60.1,53.3,38.7,62.9C17.3,72.5,-6.7,73.2,-27.8,64.3C-48.9,55.4,-67.1,36.8,-74.4,13.4C-81.7,-9.9,-78,-38,-63.1,-54.1C-48.1,-70.2,-24.1,-74.3,-0.2,-74.1C23.6,-74,43.1,-64.5,59.5,-48.3Z',
    },
    animate1: {
      d: 'M66.6,-52.8C81.5,-34.9,85.4,-6.4,78.7,17.9C72,42.2,54.7,62.3,32.9,71.5C11.1,80.7,-15.1,79,-38.1,68.2C-61.1,57.5,-80.8,37.7,-85.8,14.5C-90.9,-8.7,-81.2,-35.3,-64,-55.2C-46.9,-75.2,-23.5,-88.5,1.4,-89.6C26.2,-90.7,51.7,-70.8,66.6,-52.8Z',
    },
    animate2: {
      d: 'M52.1,-45.1C64.5,-28.2,69.4,-5.3,66.2,17.5C63,40.3,51.8,63.1,33.4,72.4C15,81.7,-10.7,77.5,-33.4,66.3C-56.2,55.1,-75.9,36.8,-80.5,14.9C-85.1,-7.1,-74.6,-32.8,-58,-51.2C-41.4,-69.6,-20.7,-80.7,0.2,-80.9C21,-81,39.7,-62,52.1,-45.1Z',
    },
    animate3: {
      d: 'M56.5,-47.3C69.1,-32.1,72.8,-8,68.2,14.1C63.5,36.2,50.5,56.3,31.6,66.6C12.8,76.9,-11.9,77.3,-33.7,68.2C-55.5,59.1,-74.3,40.4,-79.8,18.2C-85.3,-4,-77.5,-29.8,-62.5,-45.8C-47.5,-61.8,-23.8,-68,-1,-67.2C21.8,-66.3,43.9,-62.5,56.5,-47.3Z',
    },
  }
  return (
    <div className={`absolute overflow-hidden ${className}`}>
      <motion.svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <motion.path
          fill="rgba(37, 137, 255, 0.12)"
          d={variants.initial.d}
          variants={variants}
          initial="initial"
          animate={['animate1', 'animate2', 'animate3', 'initial']}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 20,
            ease: 'easeInOut',
          }}
        />
      </motion.svg>
    </div>
  )
}
