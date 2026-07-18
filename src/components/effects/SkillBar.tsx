import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/**
 * SkillBar — animated horizontal progress bar that fills when it scrolls
 * into view. Respects prefers-reduced-motion.
 */
export function SkillBar({
  label,
  level,
  delay = 0,
}: {
  label: string
  level: number
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const reduced = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (reduced.current) {
      setVisible(true)
      return
    }
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{level}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/30">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: visible ? `${level}%` : 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
          className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold"
        />
      </div>
    </div>
  )
}
