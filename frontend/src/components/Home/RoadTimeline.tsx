/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import FeatureBox, { FeatureStep } from './FeatureBox'

export default function RoadTimeline({ steps, onSelect }: { steps: FeatureStep[]; onSelect?: (i: number) => void }) {
  const pathRef = useRef<SVGPathElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [boxes, setBoxes] = useState(
    [] as { left: number; top: number; width: number; height: number; cx: number; cy: number }[]
  )

  // fractions along the path
  const milestones = [0.2, 0.45, 0.7, 0.9]

  useEffect(() => {
    const compute = () => {
      const svgEl = svgRef.current
      const path = pathRef.current
      if (!svgEl || !path) return

      const viewBoxWidth = 1200
      const viewBoxHeight = 800
      const clientWidth = svgEl.clientWidth || 1200
      const clientHeight = svgEl.clientHeight || 800

      // Proper scaling for preserveAspectRatio="xMidYMax meet"
      const scaleX = clientWidth / viewBoxWidth
      const scaleY = clientHeight / viewBoxHeight
      const scale = Math.min(scaleX, scaleY)
      const offsetX = (clientWidth - viewBoxWidth * scale) / 2
      const offsetY = clientHeight - viewBoxHeight * scale

      const length = path.getTotalLength()
      const delta = Math.max(5, length * 0.005)

      const newBoxes = milestones.map((m, i) => {
        const p = path.getPointAtLength(length * m)

        // get simple tangent by sampling nearby points
        const beforeLength = Math.max(0, length * m - delta)
        const afterLength = Math.min(length, length * m + delta)
        const before = path.getPointAtLength(beforeLength)
        const after = path.getPointAtLength(afterLength)
        const tx = after.x - before.x
        const ty = after.y - before.y
        const mag = Math.sqrt(tx * tx + ty * ty) || 1

        // Desired side: left for first two, right for last two
        const desiredSide = i < 2 ? -1 : 1

        // Normal 1: 90 deg CCW
        const n1x = -ty / mag
        const n1y = tx / mag
        const off1x = desiredSide * n1x
        const off1y = desiredSide * n1y

        // Normal 2: 90 deg CW
        const n2x = ty / mag
        const n2y = -tx / mag
        const off2x = desiredSide * n2x
        const off2y = desiredSide * n2y

        // Choose the offset with larger (more positive) y for downward placement
        let nx, ny
        if (off1y > off2y) {
          nx = off1x
          ny = off1y
        } else {
          nx = off2x
          ny = off2y
        }

        // Increased offset in user units for more distance from road path
        const offsetUser = Math.max(220, viewBoxWidth * 0.20)

        // Adjusted box sizes in viewBox units
        const boxWidthUser = Math.min(280, viewBoxWidth * 0.23)
        const boxHeightUser = 380 // Sufficient for image + margin + FeatureBox without overlap

        // compute box center in user units
        const boxCx = p.x + nx * offsetUser
        const boxCy = p.y + ny * offsetUser

        // convert to pixels
        const boxWidthPx = boxWidthUser * scale
        const boxHeightPx = boxHeightUser * scale
        const centerXPx = offsetX + boxCx * scale
        const centerYPx = offsetY + boxCy * scale
        const leftPx = centerXPx - boxWidthPx / 2
        const topPx = centerYPx - boxHeightPx / 2

        // clamp within svg container
        const margin = 12
        const clampedLeft = Math.max(margin, Math.min(leftPx, clientWidth - boxWidthPx - margin))
        const clampedTop = Math.max(margin, Math.min(topPx, clientHeight - boxHeightPx - margin))

        return {
          left: clampedLeft,
          top: clampedTop,
          width: boxWidthPx,
          height: boxHeightPx,
          cx: p.x,
          cy: p.y,
        }
      })

      // collision resolution: simple iterative push-apart for overlapping boxes
      const resolved = newBoxes.map((b) => ({ ...b }))

      const overlaps = (a: any, b: any) => {
        return !(a.left + a.width < b.left || b.left + b.width < a.left || a.top + a.height < b.top || b.top + b.height < a.top)
      }

      const clamp = (b: any, clientWidth: number, clientHeight: number) => {
        b.left = Math.max(12, Math.min(b.left, clientWidth - b.width - 12))
        b.top = Math.max(12, Math.min(b.top, clientHeight - b.height - 12))
      }

      // iterative resolve with increased separation
      for (let iter = 0; iter < 15; iter++) {
        let moved = false
        for (let i = 0; i < resolved.length; i++) {
          for (let j = i + 1; j < resolved.length; j++) {
            const A = resolved[i]
            const B = resolved[j]
            if (overlaps(A, B)) {
              // push them apart along the vector between centers
              const ax = A.left + A.width / 2
              const ay = A.top + A.height / 2
              const bx = B.left + B.width / 2
              const by = B.top + B.height / 2
              let dx = ax - bx
              let dy = ay - by
              const dist = Math.sqrt(dx * dx + dy * dy) || 1
              dx /= dist
              dy /= dist
              // overlap amount
              const overlapX = Math.max(0, (A.width + B.width) / 2 - Math.abs(ax - bx))
              const overlapY = Math.max(0, (A.height + B.height) / 2 - Math.abs(ay - by))
              const push = Math.max(overlapX, overlapY)
              const moveDist = push / 2 + 20 // Increased separation
              const moveX = dx * moveDist
              const moveY = dy * moveDist

              A.left += moveX
              A.top += moveY
              B.left -= moveX
              B.top -= moveY

              clamp(A, clientWidth, clientHeight)
              clamp(B, clientWidth, clientHeight)
              moved = true
            }
          }
        }
        if (!moved) break
      }

      // Ensure no overlap with road path by clamping tops below the path
      const roadHalfUser = 20 // half stroke width
      const safeMarginUser = 50 // additional margin in viewbox units
      const roadHalfPx = roadHalfUser * scale
      const safeMarginPx = safeMarginUser * scale
      resolved.forEach((b) => {
        const pathYPx = offsetY + b.cy * scale
        b.top = Math.max(b.top, pathYPx + roadHalfPx + safeMarginPx)
        clamp(b, clientWidth, clientHeight)
      })

      setBoxes(resolved)
    }

    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [steps])

  const roadVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.2, bounce: 0 },
        opacity: { duration: 0.6 },
      },
    },
  }

  return (
    <div className="relative bg-white">
      {/* Desktop SVG Road */}
      <div className="hidden md:block relative h-[800px] overflow-visible bg-white">
        <svg
          ref={svgRef}
          // place the road visually on top of boxes but allow pointer events to pass through
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
          viewBox="0 0 1200 800"
          fill="none"
          preserveAspectRatio="xMidYMax meet"
        >
          {/* Main Road */}
          <motion.path
            ref={pathRef}
            d="M-200,100 C300,100 350,200 350,300 C350,400 250,500 350,600 C450,700 750,700 850,600 C950,500 850,400 850,300 C850,200 900,100 1400,100"
            stroke="#2589ff"
            strokeWidth="40"
            strokeLinecap="round"
            fill="none"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={roadVariants}
          />
          {/* Road dashed line */}
          <motion.path
            d="M-200,100 C300,100 350,200 350,300 C350,400 250,500 350,600 C450,700 750,700 850,600 C950,500 850,400 850,300 C850,200 900,100 1400,100"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="20,20"
            fill="none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />

          {/* Milestone circles (follow path) */}
          {boxes.length > 0 && boxes.map((b, i) => (
            <motion.circle
              key={i}
              cx={b.cx}
              cy={b.cy}
              r="30"
              fill="#2589ff"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.3, type: 'spring' }}
            />
          ))}
        </svg>

        {/* Feature Boxes anchored to computed positions (render under the road visually) */}
        {boxes.map((b, i) => (
          <motion.div
            key={i}
            // keep boxes under the road by using a lower z-index
            className="absolute z-10"
            style={{
              left: b.left,
              top: b.top,
              width: b.width,
              height: b.height, // Set height to prevent layout issues
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.35 + i * 0.18, duration: 0.6 }}
          >
            <div className="flex flex-col items-center h-full justify-center" style={{ pointerEvents: 'auto' }}>
              <img
                src={steps[i].image}
                alt={steps[i].title}
                className="object-cover rounded-full mb-3 flex-shrink-0"
                style={{ width: Math.max(120, b.width * 0.7), height: Math.max(120, b.width * 0.7) }}
                draggable={false}
              />
              <div className="w-full">
                <FeatureBox step={steps[i]} index={i} onHover={() => onSelect?.(i)} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Centered callout circle (desktop only) - responsive sizing */}
      <div className="hidden md:flex items-center justify-center w-full mt-[-600px] mb-8 relative">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-full shadow-2xl flex items-center justify-center text-center p-4 sm:p-6 md:p-8 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[400px] xl:h-[400px] 2xl:w-[450px] 2xl:h-[450px]" style={{ boxShadow: '0 30px 60px rgba(37,137,255,0.08)' }}>
          <div className="px-2 sm:px-4 w-full">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-blue-800 mb-3">Không cần văn bản phức tạp</h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto">Thay vì đọc những văn bản pháp lý dài và khó hiểu, bạn chỉ cần xem hình ảnh minh họa và nghe giọng đọc hướng dẫn rõ ràng từng bước một.</p>
          </div>
        </div>
      </div>

      {/* Mobile vertical timeline */}
      <div className="md:hidden relative px-4">
        <div className="absolute left-1/2 top-0 bottom-0 w-3 bg-primary-500 rounded-full transform -translate-x-1/2" />
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white rounded-full transform -translate-x-1/2" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 12px, white 12px, white 24px)' }} />

        {steps.map((step, index) => (
          <div key={index} className="shadow-md p-4 rounded-2xl hover:scale-105 transition relative mb-10 pt-6">
            <motion.div className="w-9 h-9 bg-primary-500 rounded-full absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ stiffness: 260, damping: 22, delay: 0.15 + index * 0.05 }} />
            <motion.div className={`w-full`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 + index * 0.05, duration: 0.5 }}>
              <div className="flex flex-col items-center bg-transparent px-2">
                <img src={step.image} alt={step.title} className="w-44 h-44 object-cover rounded-full mb-4" draggable={false} />
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