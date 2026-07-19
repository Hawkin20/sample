import { motion } from 'framer-motion'
import {
  Atom, Code2, Server, Database, Wind, GitBranch, Sparkles, FileCode2, Layers,
} from 'lucide-react'
import { BackgroundEffects } from '@/components/effects/BackgroundEffects'
import { AnimatedSection, animVariants, animTransition } from '@/components/effects/AnimatedSection'
import { SkillBar } from '@/components/effects/SkillBar'
import { CountUp } from '@/components/effects/CountUp'

/* Circular skill indicator — animates stroke-dashoffset on scroll into view */
function CircularSkill({
  label,
  level,
  delay = 0,
  Icon,
}: {
  label: string
  level: number
  delay?: number
  Icon: React.ComponentType<{ className?: string }>
}) {
  const radius = 32
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (level / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ ...animTransition, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card animated-border group flex flex-col items-center gap-3 p-6"
    >
      <div className="relative size-20">
        <svg viewBox="0 0 80 80" className="size-full -rotate-90">
          {/* Track */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="oklch(1 0 0 / 6%)"
            strokeWidth="4"
          />
          {/* Progress */}
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="url(#skillGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
          />
          <defs>
            <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.585 0.22 264)" />
              <stop offset="50%" stopColor="oklch(0.54 0.26 285)" />
              <stop offset="100%" stopColor="oklch(0.7 0.16 210)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="size-6 text-muted-foreground transition-all duration-200 group-hover:scale-110 group-hover:text-indigo" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          <CountUp value={level} suffix="%" duration={1200} />
        </p>
      </div>
    </motion.div>
  )
}

const circularSkills = [
  { label: 'React / Next.js', level: 95, Icon: Atom },
  { label: 'TypeScript', level: 90, Icon: Code2 },
  { label: 'Node.js', level: 85, Icon: Server },
  { label: 'PostgreSQL / Supabase', level: 88, Icon: Database },
  { label: 'Tailwind CSS', level: 92, Icon: Wind },
  { label: 'Python', level: 70, Icon: FileCode2 },
  { label: 'Git / GitHub', level: 90, Icon: GitBranch },
  { label: 'Framer Motion', level: 80, Icon: Sparkles },
]

const barSkills = [
  { label: 'React / Next.js', level: 95 },
  { label: 'TypeScript', level: 90 },
  { label: 'Tailwind CSS', level: 92 },
  { label: 'Node.js / Express', level: 85 },
  { label: 'Supabase / PostgreSQL', level: 88 },
  { label: 'Python', level: 70 },
  { label: 'Git / GitHub', level: 90 },
  { label: 'Framer Motion', level: 80 },
]

export function SkillsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 text-center sm:py-32">
        <BackgroundEffects />
        <div className="relative z-10 mx-auto max-w-2xl px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={animTransition}
            className="section-label mb-3"
          >
            Expertise
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 0.05 }}
            className="mb-4 text-3xl font-extrabold tracking-tight sm:text-5xl"
          >
            <span className="text-gradient">Skills</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 0.1 }}
            className="text-base leading-[1.75] text-muted-foreground"
          >
            The tools and technologies I use to bring ideas to life.
          </motion.p>
        </div>
      </section>

      {/* Circular skill indicators */}
      <section className="border-t border-border/40 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection stagger>
            <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-10">
              <p className="section-label mb-2">Core Stack</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Proficiency <span className="text-gradient">Overview</span></h2>
            </motion.div>
            <motion.div
              variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            >
              {circularSkills.map((skill, i) => (
                <motion.div key={skill.label} variants={animVariants.fadeUp} transition={animTransition}>
                  <CircularSkill {...skill} delay={i * 0.05} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Animated progress bars */}
      <section className="border-t border-border/40 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection stagger>
            <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-10">
              <p className="section-label mb-2">Detailed Breakdown</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Skill <span className="text-gradient">Levels</span></h2>
            </motion.div>
            <motion.div
              variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
              className="grid gap-x-12 gap-y-6 sm:grid-cols-2"
            >
              {barSkills.map((skill, i) => (
                <motion.div key={skill.label} variants={animVariants.fadeUp} transition={animTransition}>
                  <SkillBar label={skill.label} level={skill.level} delay={i * 0.05} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Tools I use daily */}
      <section className="border-t border-border/40 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection stagger>
            <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-10">
              <p className="section-label mb-2">Daily Drivers</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Tools I <span className="text-gradient">Use</span></h2>
            </motion.div>
            <motion.div
              variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            >
              {[
                { label: 'VS Code', Icon: Code2 },
                { label: 'GitHub', Icon: GitBranch },
                { label: 'Figma', Icon: Layers },
                { label: 'Vercel', Icon: Atom },
                { label: 'Supabase', Icon: Database },
                { label: 'Tailwind', Icon: Wind },
                { label: 'Framer', Icon: Sparkles },
                { label: 'Node.js', Icon: Server },
              ].map(({ label, Icon }) => (
                <motion.div
                  key={label}
                  variants={animVariants.fadeScale}
                  transition={animTransition}
                  whileHover={{ y: -3, scale: 1.04, transition: { duration: 0.15 } }}
                  className="glass-card flex cursor-default items-center gap-2.5 px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-4 shrink-0 text-indigo/70" />
                  {label}
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
