import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Mail, GitBranch, Globe, MapPin, ScanLine, User, Fingerprint,
} from 'lucide-react'

/**
 * Interactive ID Card — the hero centerpiece.
 *
 * Interactions:
 * - Hover: pendulum swing (duyan) via spring rotateZ, 2-3 swings then settle
 * - Mouse move: 3D tilt follows cursor (perspective 1000px, rotateX/Y)
 * - Click: flip 180° on Y axis to reveal back face
 * - Scroll entry: drop from above with spring bounce
 * - Idle: breathing scale 1.0 → 1.02, 4s loop
 *
 * All animations respect prefers-reduced-motion (static fallback).
 */

const techIcons = [
  { label: 'React', color: '#61DAFB' },
  { label: 'Node', color: '#5FA04E' },
  { label: 'TypeScript', color: '#3178C6' },
  { label: 'PostgreSQL', color: '#4169E1' },
]

function TechGlyph({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold"
        style={{ color, boxShadow: `0 0 12px -4px ${color}80` }}
      >
        {label[0]}
      </div>
      <span className="text-[9px] text-muted-foreground">{label}</span>
    </div>
  )
}

/** Decorative QR placeholder — a deterministic grid pattern. */
function QRPlaceholder() {
  const cells = [
    1, 1, 1, 0, 1, 0, 1, 1, 1,
    1, 0, 1, 0, 0, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 1,
    0, 1, 0, 0, 1, 1, 0, 1, 0,
    1, 0, 1, 1, 0, 0, 1, 0, 1,
    0, 1, 0, 1, 1, 0, 0, 1, 0,
    1, 1, 1, 0, 1, 1, 1, 1, 1,
    1, 0, 1, 0, 0, 1, 1, 0, 1,
    1, 1, 1, 1, 0, 0, 1, 1, 1,
  ]
  return (
    <svg viewBox="0 0 9 9" className="size-12 rounded-sm bg-white/95 p-0.5" aria-label="QR code">
      {cells.map((c, i) =>
        c ? (
          <rect
            key={i}
            x={i % 9}
            y={Math.floor(i / 9)}
            width="1"
            height="1"
            fill="#0a0a0a"
          />
        ) : null,
      )}
    </svg>
  )
}

function AvatarPlaceholder() {
  return (
    <div className="relative flex size-[120px] items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-2 ring-white/10">
      <User className="size-14 text-muted-foreground/60" />
      {/* Subtle gold ring */}
      <div className="pointer-events-none absolute inset-0 rounded-full border border-gold/20" />
    </div>
  )
}

export function IDCard() {
  const [flipped, setFlipped] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // 3D tilt motion values
  const mvX = useMotionValue(0)
  const mvY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [10, -10]), {
    stiffness: 200,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 200,
    damping: 20,
  })

  const [swinging, setSwinging] = useState(false)

  useEffect(() => {
    setIsDesktop(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDesktop || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mvX.set((e.clientX - rect.left) / rect.width - 0.5)
    mvY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const resetTilt = () => {
    mvX.set(0)
    mvY.set(0)
  }

  const triggerSwing = () => {
    if (!isDesktop || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setSwinging(true)
    setTimeout(() => setSwinging(false), 1400)
  }

  const handleClick = () => setFlipped((f) => !f)

  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Card dimensions — fixed for 3D math
  const CARD_W = 360
  const CARD_H = 520

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -400 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0.3 } : { type: 'spring', stiffness: 100, damping: 10, delay: 0.2 }}
      style={{ perspective: 1000, width: CARD_W, height: CARD_H }}
      className="relative"
    >
      {/* Inner wrapper handles tilt + flip */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={triggerSwing}
        onMouseLeave={resetTilt}
        onClick={handleClick}
        style={{
          rotateX: isDesktop && !reduced ? rotateX : 0,
          rotateY: isDesktop && !reduced ? rotateY : 0,
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
        className="relative"
      >
        {/* Pendulum swing layer (rotateZ) */}
        <motion.div
          animate={swinging ? { rotateZ: [0, 3, -3, 2, -1.5, 1, 0] } : { rotateZ: 0 }}
          transition={swinging ? { duration: 1.4, ease: 'easeInOut' } : { duration: 0.3 }}
          style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%' }}
        >
          {/* Breathing layer */}
          <motion.div
            animate={reduced ? {} : { scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%' }}
          >
            {/* Flip layer */}
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
            >
              {/* ── FRONT ─────────────────────────────── */}
              <div
                className="id-card-face id-card-front"
                style={{ borderRadius: 16 }}
              >
                {/* Holographic shimmer border */}
                <div className="holo-border" aria-hidden="true" />

                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground id-text-shadow">
                    Developer ID
                  </span>
                  <Fingerprint className="size-4 text-gold/60" />
                </div>

                {/* Avatar */}
                <div className="mt-4 flex justify-center">
                  <AvatarPlaceholder />
                </div>

                {/* Name */}
                <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-foreground id-text-shadow">
                  Vincent Paul Ecaldre
                </h2>

                {/* Role pill */}
                <div className="mt-3 flex justify-center">
                  <span className="role-pill">
                    Full Stack Developer
                  </span>
                </div>

                {/* ID number */}
                <div className="mt-4 text-center">
                  <span className="font-mono text-xs tracking-wider text-muted-foreground">
                    ID: DEV-2026-001
                  </span>
                </div>

                {/* Status */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="status-dot" />
                  <span className="text-xs font-medium text-emerald-400">Available for Work</span>
                </div>

                {/* Tech mini row */}
                <div className="mt-5 flex justify-center gap-3">
                  {techIcons.map((t) => (
                    <TechGlyph key={t.label} {...t} />
                  ))}
                </div>

                {/* Footer + QR */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Valid Thru: ∞</span>
                    <span className="text-[10px] text-muted-foreground">Issued: 2026</span>
                  </div>
                  <QRPlaceholder />
                </div>
              </div>

              {/* ── BACK ─────────────────────────────── */}
              <div
                className="id-card-face id-card-back"
                style={{ borderRadius: 16, transform: 'rotateY(180deg)' }}
              >
                {/* Holographic shimmer border */}
                <div className="holo-border" aria-hidden="true" />

                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground id-text-shadow">
                    Contact
                  </span>
                  <ScanLine className="size-4 text-gold/60" />
                </div>

                {/* Contact rows */}
                <div className="mt-6 flex flex-col gap-3 px-6">
                  <ContactRow icon={<Mail className="size-4" />} label="Email" value="vincentecaldre25@gmail.com" href="mailto:vincentecaldre25@gmail.com" />
                  <ContactRow icon={<GitBranch className="size-4" />} label="GitHub" value="github.com/Hawkin20" href="https://github.com/Hawkin20" />
                  <ContactRow icon={<Globe className="size-4" />} label="LinkedIn" value="in/vincent-ecaldre" href="#" />
                </div>

                {/* Location */}
                <div className="mt-5 flex items-center justify-center gap-2">
                  <MapPin className="size-3.5 text-gold/70" />
                  <span className="text-xs text-muted-foreground">Philippines</span>
                </div>

                {/* Scan text */}
                <div className="mt-4 text-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                    Scan to Connect
                  </span>
                </div>

                {/* Holographic strip */}
                <div className="absolute inset-x-0 bottom-0">
                  <div className="holo-strip" />
                  <div className="flex items-center justify-between px-5 pb-4 pt-3">
                    <span className="text-[10px] text-muted-foreground">DEV-2026-001</span>
                    <span className="text-[10px] text-muted-foreground">v1.0</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href: string
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 transition-all duration-200 hover:border-gold/30 hover:bg-white/[0.04]"
    >
      <span className="text-muted-foreground transition-colors group-hover:text-gold">{icon}</span>
      <div className="flex flex-col">
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60">{label}</span>
        <span className="text-xs text-foreground/90 transition-colors group-hover:text-gold">{value}</span>
      </div>
    </a>
  )
}
