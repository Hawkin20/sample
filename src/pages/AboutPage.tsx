import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase, GraduationCap, Star, MapPin, Calendar, Coffee, Lightbulb,
  Atom, Wind, Server, Database, Plug, GitBranch, Code2, PenTool, Triangle, Container,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import type { Journey } from '@/types/database'
import { cn } from '@/lib/utils'
import { BackgroundEffects } from '@/components/effects/BackgroundEffects'
import { AnimatedSection, animVariants, animTransition } from '@/components/effects/AnimatedSection'
import { CountUp } from '@/components/effects/CountUp'

const typeIcon = { job: Briefcase, education: GraduationCap, milestone: Star }
const typeColor = { job: 'text-blue-400', education: 'text-purple-400', milestone: 'text-gold' }

function TsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="3" fill="currentColor" opacity="0.15" />
      <text x="3" y="17" fontSize="11" fontWeight="700" fill="currentColor" fontFamily="monospace">TS</text>
    </svg>
  )
}
function NextIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <text x="7.5" y="17" fontSize="13" fontWeight="800" fill="currentColor" fontFamily="sans-serif">N</text>
    </svg>
  )
}
function SupabaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="currentColor" opacity="0.12" />
      <text x="6" y="17" fontSize="13" fontWeight="700" fill="currentColor" fontFamily="sans-serif">S</text>
    </svg>
  )
}

type SkillItem = { label: string; Icon: React.ComponentType<{ className?: string }> }

const skills: { category: string; items: SkillItem[] }[] = [
  {
    category: 'Frontend',
    items: [
      { label: 'React', Icon: Atom },
      { label: 'TypeScript', Icon: TsIcon },
      { label: 'Next.js', Icon: NextIcon },
      { label: 'Tailwind CSS', Icon: Wind },
      { label: 'Framer Motion', Icon: Wind },
    ],
  },
  {
    category: 'Backend',
    items: [
      { label: 'Node.js', Icon: Server },
      { label: 'Express', Icon: Server },
      { label: 'PostgreSQL', Icon: Database },
      { label: 'Supabase', Icon: SupabaseIcon },
      { label: 'REST APIs', Icon: Plug },
    ],
  },
  {
    category: 'Tools',
    items: [
      { label: 'Git', Icon: GitBranch },
      { label: 'VS Code', Icon: Code2 },
      { label: 'Figma', Icon: PenTool },
      { label: 'Docker', Icon: Container },
      { label: 'Vercel', Icon: Triangle },
    ],
  },
]

export function AboutPage() {
  const [journey, setJourney] = useState<Journey[]>([])
  const [aboutSettings, setAboutSettings] = useState({
    bio: 'I am a passionate full stack developer who loves building clean, modern web applications.',
    philosophy: 'Code is craft. Every line should be intentional, readable, and serve a purpose.',
    fun_facts: ['Coffee-driven developer', 'Open source contributor', 'Night owl coder'],
  })

  useEffect(() => {
    Promise.all([
      supabase.from('journey').select('*').order('order_index'),
      supabase.from('settings').select('value').eq('key', 'about').maybeSingle(),
    ]).then(([j, s]) => {
      if (j.data) setJourney(j.data)
      if (s.data) setAboutSettings((s.data as any).value as typeof aboutSettings)
    })
  }, [])

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <BackgroundEffects />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <AnimatedSection stagger className="text-center">
            <motion.p variants={animVariants.fadeUp} transition={animTransition} className="mb-3 text-sm font-medium tracking-wide text-gold">
              About Me
            </motion.p>
            <motion.h1 variants={animVariants.fadeUp} transition={animTransition} className="mb-5 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Vincent Paul <span className="text-gradient-gold">Ecaldre</span>
            </motion.h1>
            <motion.p variants={animVariants.fadeUp} transition={animTransition} className="text-lg text-muted-foreground sm:text-xl">
              Full Stack Developer based in the Philippines
            </motion.p>
            <motion.p variants={animVariants.fadeUp} transition={animTransition} className="mx-auto mt-5 max-w-2xl text-base leading-[1.8] text-muted-foreground">
              {aboutSettings.bio}
            </motion.p>
          </AnimatedSection>
        </div>
      </section>

      {/* Split layout — image + stats counter */}
      <section className="border-t border-border/40 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image side */}
            <AnimatedSection animation="slideLeft">
              <div className="relative mx-auto max-w-sm">
                <div className="glass-card relative overflow-hidden rounded-2xl">
                  <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-gold/15 via-surface to-surface">
                    <span className="text-8xl font-extrabold text-gradient-gold">VPE</span>
                  </div>
                  {/* Decorative gold ring */}
                  <div className="pointer-events-none absolute -inset-px rounded-2xl border border-gold/20" />
                </div>
                {/* Floating accent badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="glass-card absolute -bottom-4 -right-4 flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground"
                >
                  <Coffee className="size-3.5 text-gold" />
                  Based in the Philippines
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Stats side */}
            <AnimatedSection stagger>
              <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-8">
                <p className="mb-2 text-sm font-medium tracking-wide text-gold">By the Numbers</p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">A Quick <span className="text-gradient-gold">Snapshot</span></h2>
              </motion.div>
              <motion.div
                variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-2 gap-6"
              >
                {[
                  { value: 10, suffix: '+', label: 'Projects Shipped' },
                  { value: 3, suffix: '+', label: 'Years Coding' },
                  { value: 20, suffix: '+', label: 'Tools Mastered' },
                  { value: 100, suffix: '%', label: 'Dedication' },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    variants={animVariants.fadeScale}
                    transition={animTransition}
                    className="glass-card p-5 text-center"
                  >
                    <div className="text-3xl font-extrabold text-gradient-gold sm:text-4xl">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="mt-1.5 text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-t border-border/40 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection stagger>
            <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-8">
              <p className="mb-2 text-sm font-medium tracking-wide text-gold">Philosophy</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How I <span className="text-gradient-gold">Think</span></h2>
            </motion.div>
            <motion.blockquote variants={animVariants.slideLeft} transition={animTransition} className="relative border-l-2 border-gold py-2 pl-8">
              <Lightbulb className="absolute -left-3.5 -top-1 size-6 rounded-full bg-background p-0.5 text-gold" />
              <p className="text-lg font-medium italic leading-[1.8] text-foreground/90 sm:text-xl">
                "{aboutSettings.philosophy}"
              </p>
            </motion.blockquote>
          </AnimatedSection>
        </div>
      </section>

      {/* Skills */}
      <section className="border-t border-border/40 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection stagger>
            <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-10">
              <p className="mb-2 text-sm font-medium tracking-wide text-gold">Expertise</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl"><span className="text-gradient-gold">Skills</span></h2>
            </motion.div>
            <motion.div
              variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
              className="grid gap-4 sm:grid-cols-3"
            >
              {skills.map((skill) => (
                <motion.div key={skill.category} variants={animVariants.fadeUp} transition={animTransition}>
                  <Card className="glass-card animated-border h-full">
                    <CardContent className="p-5">
                      <h3 className="mb-4 font-semibold text-foreground">{skill.category}</h3>
                      <div className="flex flex-col gap-2">
                        {skill.items.map(({ label, Icon }) => (
                          <motion.div
                            key={label}
                            whileHover={{ scale: 1.05, transition: { duration: 0.12 } }}
                            className="group flex cursor-default items-center gap-2.5 rounded-lg border border-border/40 bg-background/50 px-3 py-2 text-sm text-muted-foreground transition-all duration-150 hover:border-gold/40 hover:text-foreground hover:shadow-[0_0_8px_0px_oklch(0.75_0.12_85_/_0.25)]"
                          >
                            <Icon className="size-4 shrink-0 text-gold/70 transition-colors group-hover:text-gold" />
                            {label}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Fun Facts */}
      <section className="border-t border-border/40 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection stagger>
            <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-10">
              <p className="mb-2 text-sm font-medium tracking-wide text-gold">Personal</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Fun <span className="text-gradient-gold">Facts</span></h2>
            </motion.div>
            <motion.div
              variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {aboutSettings.fun_facts.map((fact, i) => (
                <motion.div
                  key={i}
                  variants={animVariants.fadeUp}
                  transition={animTransition}
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                  className="glass-card flex items-center gap-3 px-4 py-3.5"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    <Coffee className="size-4" />
                  </div>
                  <span className="text-sm leading-snug text-muted-foreground">{fact}</span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Journey Timeline */}
      {journey.length > 0 && (
        <section className="border-t border-border/40 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-6">
            <AnimatedSection stagger>
              <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-12">
                <p className="mb-2 text-sm font-medium tracking-wide text-gold">Timeline</p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">My <span className="text-gradient-gold">Journey</span></h2>
              </motion.div>

              <div className="relative">
                {/* Timeline line that grows on scroll */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-gold/40 via-border/40 to-transparent sm:left-6"
                />
                <motion.div
                  variants={{ animate: { transition: { staggerChildren: 0.15 } } }}
                  className="space-y-8"
                >
                  {journey.map((item, i) => {
                    const Icon = typeIcon[item.type]
                    const color = typeColor[item.type]
                    const isEven = i % 2 === 0
                    return (
                      <motion.div
                        key={item.id}
                        variants={isEven ? animVariants.slideRight : animVariants.slideLeft}
                        transition={animTransition}
                        className="relative flex gap-6 pl-12 sm:pl-16"
                      >
                        {/* Icon with bounce */}
                        <motion.div
                          variants={{ animate: { y: [0, -4, 0] } }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                          className={cn(
                            'absolute left-0 flex size-8 items-center justify-center rounded-full border border-border/40 bg-surface sm:size-12',
                            color
                          )}
                        >
                          <Icon className="size-3.5 sm:size-4" />
                        </motion.div>
                        <div className="flex-1 pb-4">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                            {item.current && (
                              <Badge className="border-gold/30 bg-gold/10 text-xs text-gold">Current</Badge>
                            )}
                          </div>
                          {item.company && <p className="text-sm font-medium text-muted-foreground">{item.company}</p>}
                          {/* Date fades in */}
                          <motion.div
                            variants={animVariants.fadeIn}
                            transition={{ ...animTransition, delay: 0.2 }}
                            className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground/60"
                          >
                            {(item.start_date || item.end_date) && (
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {item.start_date}
                                {item.end_date ? ` — ${item.end_date}` : item.current ? ' — Present' : ''}
                              </span>
                            )}
                            {item.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                {item.location}
                              </span>
                            )}
                          </motion.div>
                          {item.description && (
                            <p className="mt-2 text-sm leading-[1.75] text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </div>
  )
}
