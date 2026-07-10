import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const variants: Record<string, Variants> = {
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
  },
  fadeScale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
}

const defaultTransition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }

/**
 * Wrapper that animates children once when entering the viewport.
 * Animation type is chosen via the `animation` prop.
 */
export function AnimatedSection({
  children,
  animation = 'fadeUp',
  delay = 0,
  className,
  stagger = false,
}: {
  children: ReactNode
  animation?: keyof typeof variants
  delay?: number
  className?: string
  stagger?: boolean
}) {
  const v = variants[animation]

  if (stagger) {
    return (
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ animate: { transition: { staggerChildren: 0.09, delayChildren: delay } } }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-80px' }}
      variants={v}
      transition={{ ...defaultTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export { variants as animVariants, defaultTransition as animTransition }
