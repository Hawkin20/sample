import { useEffect, useState } from 'react'

/**
 * Typewriter effect: cycles through an array of phrases, typing each
 * character-by-character then deleting, with a blinking cursor.
 * Respects prefers-reduced-motion (renders the first phrase statically).
 */
export function Typewriter({
  phrases,
  typeSpeed = 90,
  deleteSpeed = 45,
  pauseEnd = 1600,
  pauseStart = 400,
  className,
}: {
  phrases: string[]
  typeSpeed?: number
  deleteSpeed?: number
  pauseEnd?: number
  pauseStart?: number
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (reduced) return
    if (subIndex === phrases[index].length + 1 && !deleting) {
      const t = setTimeout(() => setDeleting(true), pauseEnd)
      return () => clearTimeout(t)
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false)
      setIndex((i) => (i + 1) % phrases.length)
      const t = setTimeout(() => {}, pauseStart)
      return () => clearTimeout(t)
    }
    const t = setTimeout(
      () => {
        setSubIndex((s) => s + (deleting ? -1 : 1))
      },
      deleting ? deleteSpeed : typeSpeed,
    )
    return () => clearTimeout(t)
  }, [subIndex, deleting, index, phrases, typeSpeed, deleteSpeed, pauseEnd, pauseStart, reduced])

  if (reduced) {
    return <span className={className}>{phrases[0]}</span>
  }

  return (
    <span className={className}>
      {phrases[index].substring(0, subIndex)}
      <span className="typewriter-cursor" aria-hidden="true" />
    </span>
  )
}
