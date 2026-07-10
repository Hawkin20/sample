import { useEffect, useRef } from 'react'

/**
 * Desktop-only custom cursor: a small gold dot + a larger ring that enlarges
 * when hovering interactive elements. Disabled on touch devices.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Disable on touch / small screens
    if (window.matchMedia('(hover: none)').matches) return
    if (window.innerWidth < 768) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="hover"]')) {
        document.body.classList.add('cursor-hover')
      }
    }
    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="hover"]')) {
        document.body.classList.remove('cursor-hover')
      }
    }

    const loop = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.body.classList.remove('cursor-hover')
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  )
}
