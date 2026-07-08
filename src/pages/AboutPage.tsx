import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Star, MapPin, Calendar, Coffee, Lightbulb } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import type { Journey } from '@/types/database'
import { cn } from '@/lib/utils'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
}

const stagger = { animate: { transition: { staggerChildren: 0.09 } } }

const typeIcon = {
  job: Briefcase,
  education: GraduationCap,
  milestone: Star,
}

const typeColor = {
  job: 'text-blue-400',
  education: 'text-purple-400',
  milestone: 'text-gold',
}

const skills = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'Supabase', 'REST APIs'] },
  { category: 'Tools', items: ['Git', 'VS Code', 'Figma', 'Docker', 'Vercel'] },
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
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-10">
          <div className="size-[400px] rounded-full bg-gold/5 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center"
          >
            <motion.p variants={fadeUp} className="mb-3 text-sm font-medium tracking-wide text-gold">
              About Me
            </motion.p>
            {/* Reduced h1 on mobile, larger on sm+ */}
            <motion.h1
              variants={fadeUp}
              className="mb-5 text-3xl font-extrabold tracking-tight sm:text-5xl"
            >
              Vincent Paul Ecaldre
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground sm:text-xl">
              Full Stack Developer based in the Philippines
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-2xl text-base leading-[1.8] text-muted-foreground"
            >
              {aboutSettings.bio}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-t border-border/40 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-8">
              <p className="mb-2 text-sm font-medium tracking-wide text-gold">Philosophy</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How I Think</h2>
            </motion.div>
            <motion.blockquote
              variants={fadeUp}
              className="relative border-l-2 border-gold py-2 pl-8"
            >
              <Lightbulb className="absolute -left-3.5 -top-1 size-6 rounded-full bg-background p-0.5 text-gold" />
              <p className="text-lg font-medium italic leading-[1.8] text-foreground/90 sm:text-xl">
                "{aboutSettings.philosophy}"
              </p>
            </motion.blockquote>
          </motion.div>
        </div>
      </section>

      {/* Skills */}
      <section className="border-t border-border/40 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-8">
              <p className="mb-2 text-sm font-medium tracking-wide text-gold">Expertise</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Skills</h2>
            </motion.div>
            <motion.div variants={stagger} className="grid gap-4 sm:grid-cols-3">
              {skills.map((skill) => (
                <motion.div
                  key={skill.category}
                  variants={fadeUp}
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                >
                  <Card className="h-full border-border/40 bg-surface transition-colors duration-200 hover:border-gold/20">
                    <CardContent className="p-5">
                      <h3 className="mb-3 font-semibold text-foreground">{skill.category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {skill.items.map((item) => (
                          <Badge key={item} variant="secondary" className="bg-secondary/60 text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Fun Facts */}
      <section className="border-t border-border/40 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-8">
              <p className="mb-2 text-sm font-medium tracking-wide text-gold">Personal</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Fun Facts</h2>
            </motion.div>
            <motion.div variants={stagger} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {aboutSettings.fun_facts.map((fact, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                  className="flex items-center gap-3 rounded-xl border border-border/40 bg-surface px-4 py-3.5 transition-colors duration-200 hover:border-gold/20"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    <Coffee className="size-4" />
                  </div>
                  <span className="text-sm leading-snug text-muted-foreground">{fact}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Journey */}
      {journey.length > 0 && (
        <section className="border-t border-border/40 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="mb-10">
                <p className="mb-2 text-sm font-medium tracking-wide text-gold">Timeline</p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">My Journey</h2>
              </motion.div>

              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-px bg-border/40 sm:left-6" />
                <motion.div variants={stagger} className="space-y-7">
                  {journey.map((item) => {
                    const Icon = typeIcon[item.type]
                    const color = typeColor[item.type]
                    return (
                      <motion.div
                        key={item.id}
                        variants={fadeUp}
                        className="relative flex gap-6 pl-12 sm:pl-16"
                      >
                        <div
                          className={cn(
                            'absolute left-0 flex size-8 items-center justify-center rounded-full border border-border/40 bg-surface sm:size-12',
                            color
                          )}
                        >
                          <Icon className="size-3.5 sm:size-4" />
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                            {item.current && (
                              <Badge className="border-gold/30 bg-gold/10 text-xs text-gold">
                                Current
                              </Badge>
                            )}
                          </div>
                          {item.company && (
                            <p className="text-sm font-medium text-muted-foreground">{item.company}</p>
                          )}
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground/60">
                            {(item.start_date || item.end_date) && (
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {item.start_date}
                                {item.end_date
                                  ? ` — ${item.end_date}`
                                  : item.current
                                  ? ' — Present'
                                  : ''}
                              </span>
                            )}
                            {item.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                {item.location}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="mt-2 text-sm leading-[1.75] text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
