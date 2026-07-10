import { useEffect, useRef, useState } from 'react'

/**
 * Count-up animation: animates a number from 0 to `value` when it enters
 * the viewport. Respects prefers-reduced-motion.
 */
export function CountUp({
  value,
  suffix = '',
  prefix = '',
  duration = 1800,
  className,
}: {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(value)
      setHasAnimated(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const start = performance.now()
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
            setDisplay(Math.round(eased * value))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration, hasAnimated])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
