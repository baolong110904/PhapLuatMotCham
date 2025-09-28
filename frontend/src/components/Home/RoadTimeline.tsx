import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import FeatureBox, { FeatureStep } from './FeatureBox'
import OptimizedImage from '@/components/ui/OptimizedImage'

export default function RoadTimeline({ steps, onSelect }: { steps: FeatureStep[]; onSelect?: (i: number) => void }) {
  const roadVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 1.2, bounce: 0 }, opacity: { duration: 0.6 } } },
  }

  const svgRef = useRef<SVGSVGElement | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const boxRefs = useRef<Array<HTMLDivElement | null>>([])
  const [boxPositions, setBoxPositions] = useState<{ left: number; top: number }[]>([])
   const [boxWState, setBoxWState] = useState<number | null>(null)

  // compute responsive points along path
  useEffect(() => {
    const path = pathRef.current
    const svg = svgRef.current
    if (!path || !svg) return

    const resize = () => {
      try {
        const len = path.getTotalLength()
        // choose 4 evenly spaced lengths (avoid the very ends)
        const fractions = [0.12, 0.32, 0.66, 0.82]
        const pts = fractions.map((f) => {
          const p = path.getPointAtLength(len * f)
          // svg coordinates -> since svg uses viewBox 1200x800 we keep them as-is
          return { x: p.x, y: p.y }
        })

        setPoints(pts)
      } catch {
        // fallback: keep original hard-coded approximate points
        setPoints([{ x: 250, y: 155 }, { x: 330, y: 580 }, { x: 850, y: 600 }, { x: 920, y: 170 }])
      }
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [steps])

  // We'll compute pixel-accurate positions for boxes so we can measure and resolve overlaps.
  // viewBox of the SVG
  const VB = { width: 1200, height: 800 }

  // compute initial pixel positions from svg points when points change
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || !points.length) return

    const rect = svg.getBoundingClientRect()
    const scaleX = rect.width / VB.width
    const scaleY = rect.height / VB.height
    const boxW = Math.max(220, Math.min(380, Math.round(rect.width * 0.22)))

  // Place boxes consistently: for milestones on left half -> place box to LEFT and BELOW;
  // on right half -> place box to RIGHT and BELOW. This ensures boxes are under milestones.
  const horizOffset = Math.max(24, Math.round(boxW * 0.12))
  const vertOffset = Math.max(20, Math.round(rect.height * 0.045))
  // provide a safer padding from edges so first/last boxes are visible
  const edgePad = Math.max(24, Math.round(rect.width * 0.03))

    const initial = points.map((p, i) => {
      const px = p.x * scaleX
      const py = p.y * scaleY
      const isLeft = p.x < VB.width / 2
      let left = isLeft ? px - boxW - horizOffset : px + horizOffset
      let top = py + vertOffset

      if (i === 1) {
        left += 150
        top += 40 
      }
      if (i === 2) {
        left -= 150
        top += 40 
      }

      // clamp initial to container so elements are not rendered fully off-screen
      left = Math.max(edgePad, Math.min(rect.width - boxW - edgePad, left))
      top = Math.max(edgePad, Math.min(rect.height - vertOffset - edgePad, top))
      return { left, top }
    })

     // publish responsive box width for render-time sizing
     setBoxWState(boxW)
    setBoxPositions(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points])

  // helper: measure boxes and resolve overlaps + keep away from road
  useLayoutEffect(() => {
    const svg = svgRef.current
    const path = pathRef.current
    if (!svg || !path || !boxPositions.length) return

    const rect = svg.getBoundingClientRect()
    const scaleX = rect.width / VB.width
    const scaleY = rect.height / VB.height
    const strokeW = 40 // svg stroke width
    const roadRadius = ((strokeW / 2) * (scaleX + scaleY) / 2) + 8 // margin

    // sample points along path in pixel space for distance checks
    const samples: { x: number; y: number }[] = []
    try {
      const total = path.getTotalLength()
      const sampleCount = 60
      for (let i = 0; i <= sampleCount; i++) {
        const pt = path.getPointAtLength((i / sampleCount) * total)
        samples.push({ x: pt.x * scaleX, y: pt.y * scaleY })
      }
    } catch {
      // fallback empty
    }

    // measure boxes (width/height)
    const measured = boxRefs.current.map((el) => {
      if (!el) return { w: 300, h: 300 }
      const r = el.getBoundingClientRect()
      return { w: r.width, h: r.height }
    })

    // clone positions
    const pos = boxPositions.map((p) => ({ left: p.left, top: p.top }))

    // iterative solver: repel overlapping boxes and push boxes away from path samples if too close
    const maxPasses = 12
    for (let pass = 0; pass < maxPasses; pass++) {
      // pairwise box repulsion
      for (let i = 0; i < pos.length; i++) {
        for (let j = i + 1; j < pos.length; j++) {
          const a = pos[i]
          const b = pos[j]
          const aw = measured[i].w
          const ah = measured[i].h
          const bw = measured[j].w
          const bh = measured[j].h
          const ax = a.left + aw / 2
          const ay = a.top + ah / 2
          const bx = b.left + bw / 2
          const by = b.top + bh / 2
          const dx = bx - ax
          const dy = by - ay
          const overlapX = (aw + bw) / 2 - Math.abs(dx)
          const overlapY = (ah + bh) / 2 - Math.abs(dy)
          if (overlapX > 0 && overlapY > 0) {
            // overlap area exists; push them apart along the larger overlap axis
            if (overlapX > overlapY) {
              const shift = (overlapX + 8) / 2
              const dir = dx === 0 ? 1 : dx / Math.abs(dx)
              a.left -= dir * shift
              b.left += dir * shift
            } else {
              const shift = (overlapY + 8) / 2
              const dir = dy === 0 ? 1 : dy / Math.abs(dy)
              a.top -= dir * shift
              b.top += dir * shift
            }
          }
        }
      }

      // push boxes away from road samples if closer than roadRadius + diag/2
      for (let i = 0; i < pos.length; i++) {
        const pcenterx = pos[i].left + measured[i].w / 2
        const pcentery = pos[i].top + measured[i].h / 2
        let nearest = { d: Infinity, x: 0, y: 0 }
        for (const s of samples) {
          const dx = pcenterx - s.x
          const dy = pcentery - s.y
          const d = Math.hypot(dx, dy)
          if (d < nearest.d) nearest = { d, x: s.x, y: s.y }
        }
        if (nearest.d < roadRadius + Math.hypot(measured[i].w, measured[i].h) / 2) {
          // push outward along vector from nearest sample to box center
          const vx = pcenterx - nearest.x || 0.01
          const vy = pcentery - nearest.y || 0.01
          const vlen = Math.hypot(vx, vy)
          const need = roadRadius + Math.hypot(measured[i].w, measured[i].h) / 2 - nearest.d + 8
          pos[i].left += (vx / vlen) * need
          pos[i].top += (vy / vlen) * need
        }
      }
    }

    // ensure each box stays below its milestone (we have points array)
    const final = pos.map((p, i) => {
      const measuredW = measured[i].w
      const measuredH = measured[i].h
      const pad = 28 // larger pad to keep boxes away from edges
      // ensure the box is fully visible horizontally
      let boundedLeft = Math.max(pad, Math.min(rect.width - measuredW - pad, p.left))
      const boundedTop = Math.max(pad, Math.min(rect.height - measuredH - pad, p.top))

      // milestone pixel y
      const milestone = points[i]
      const milestoneY = milestone ? milestone.y * scaleY : 0
      const minTopBelowMilestone = milestoneY + 24 // minimal gap under milestone
      const topBelow = Math.max(boundedTop, minTopBelowMilestone)

      // If left is too close to edge (first/last), nudge inward more
      const extraEdge = 18
      if (boundedLeft < pad + extraEdge) boundedLeft = pad + extraEdge
      if (boundedLeft > rect.width - measuredW - pad - extraEdge) boundedLeft = rect.width - measuredW - pad - extraEdge

      return { left: boundedLeft, top: topBelow }
    })

    setBoxPositions(final)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxPositions.length, points])

  return (
    <div className="relative bg-white">
      {/* Desktop SVG Road - original design */}
      <div className="hidden md:block relative h-[800px] overflow-visible bg-white">
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full z-0"
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
            viewport={{
              once: true,
              amount: 0.2,
            }}
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
          {/* Milestones/Points - computed from path */}
          {points.length ? (
            points.map((pt, i) => (
              <motion.circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="30"
                fill="#2589ff"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}
              />
            ))
          ) : (
            // fallback (shouldn't happen often)
            [ { x: 250, y: 155 }, { x: 330, y: 580 }, { x: 850, y: 600 }, { x: 920, y: 170 } ].map((pt, i) => (
              <motion.circle key={i} cx={pt.x} cy={pt.y} r="30" fill="#2589ff" initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.2, type: 'spring' }} />
            ))
          )}
        </svg>

        {/* Feature Boxes - positioned from computed pixel positions */}
        {boxPositions.map((pos, i) => {
          if (!steps[i]) return null
          return (
            <motion.div
              key={i}
              ref={(el) => {
                // ensure length
                if (boxRefs.current.length <= i) boxRefs.current.length = i + 1
                boxRefs.current[i] = el || null
                return undefined
              }}
              className={`absolute z-10`}
              style={{ left: pos.left, top: pos.top, width: boxWState ?? 300 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
            >
              <div className="flex flex-col items-center">
                <div className="relative rounded-full overflow-hidden" style={{ width: Math.round((boxWState ?? 300) * 0.8), height: Math.round((boxWState ?? 300) * 0.8) }}>
                  <OptimizedImage 
                    src={steps[i].image} 
                    alt={steps[i].title} 
                    fill
                    className="object-cover" 
                  />
                </div>
                <FeatureBox step={steps[i]} index={i} onHover={() => onSelect?.(i)} />
              </div>
            </motion.div>
          )
        })}
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
                <div className="relative w-56 h-56 md:w-44 md:h-44 lg:w-44 lg:h-44 mb-2 rounded-full overflow-hidden">
                  <OptimizedImage 
                    src={step.image} 
                    alt={step.title} 
                    fill
                    className="object-cover" 
                  />
                </div>
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
