import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

/**
 * TiltCard — applies a 3D tilt effect based on cursor position over the
 * card, with a subtle parallax glare. Disabled on touch devices.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 8,
  glareOpacity = 0.15,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
  glareOpacity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMove = (e: React.MouseEvent) => {
    if (window.matchMedia('(hover: none)').matches) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rotateX = (py - 0.5) * -2 * maxTilt
    const rotateY = (px - 0.5) * 2 * maxTilt
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
    setGlare({ x: px * 100, y: py * 100, opacity: glareOpacity })
  }

  const reset = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setGlare((g) => ({ ...g, opacity: 0 }))
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transform, transformStyle: 'preserve-3d' }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={className}
    >
      {children}
      {/* Glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
          opacity: glare.opacity,
        }}
      />
    </motion.div>
  )
}
