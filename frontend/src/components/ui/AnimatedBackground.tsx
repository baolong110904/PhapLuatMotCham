import React, { useEffect, useRef } from 'react'

interface AnimatedBackgroundProps {
  className?: string
}
export function AnimatedBackground({
  className = '',
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    const blobs = Array.from(
      {
        length: 5,
      },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 200 + 100,
        xSpeed: (Math.random() - 0.5) * 0.7,
        ySpeed: (Math.random() - 0.5) * 0.7,
        hue: Math.random() * 30 + 200, // Blue hues
      }),
    )
    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resizeCanvas)
    let frameId: number
    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      // Draw blobs
      blobs.forEach((blob) => {
        // Update position
        blob.x += blob.xSpeed
        blob.y += blob.ySpeed
        // Bounce off walls
        if (blob.x < 0 || blob.x > width) blob.xSpeed *= -1
        if (blob.y < 0 || blob.y > height) blob.ySpeed *= -1
        // Draw blob
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius,
        )
        gradient.addColorStop(0, `hsla(${blob.hue}, 80%, 60%, 0.12)`)
        gradient.addColorStop(1, `hsla(${blob.hue}, 80%, 60%, 0)`)
        ctx.fillStyle = gradient
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2)
        ctx.fill()
      })
      frameId = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(frameId)
    }
  }, [])
  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}
