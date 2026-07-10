import { useRef, useEffect, useState } from 'react'

/**
 * Reusable animated background: floating blurred orbs + grid overlay + noise.
 * Accepts optional mouse parallax via the `parallax` prop.
 */
export function BackgroundEffects({ parallax = false }: { parallax?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!parallax || window.matchMedia('(hover: none)').matches) return
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      setOffset({
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy,
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [parallax])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-60" />

      {/* Floating orbs with optional parallax */}
      <div
        className="absolute left-[10%] top-[15%] size-[400px] rounded-full bg-gold/8 blur-[100px] orb-1"
        style={parallax ? { transform: `translate(${offset.x * 20}px, ${offset.y * 20}px)` } : undefined}
      />
      <div
        className="absolute right-[5%] top-[20%] size-[350px] rounded-full bg-blue-500/6 blur-[90px] orb-2"
        style={parallax ? { transform: `translate(${offset.x * -30}px, ${offset.y * -30}px)` } : undefined}
      />
      <div
        className="absolute bottom-[10%] left-[40%] size-[300px] rounded-full bg-purple-500/5 blur-[80px] orb-3"
        style={parallax ? { transform: `translate(${offset.x * 15}px, ${offset.y * -15}px)` } : undefined}
      />
    </div>
  )
}
