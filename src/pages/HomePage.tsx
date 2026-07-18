import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, ExternalLink, GitBranch, Zap, Mail, User, MessageSquare,
  Send, Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import type { Project, Technology } from '@/types/database'
import { CountUp } from '@/components/effects/CountUp'
import { AnimatedSection, animVariants, animTransition } from '@/components/effects/AnimatedSection'
import { MagneticButton } from '@/components/effects/MagneticButton'
import { Typewriter } from '@/components/effects/Typewriter'
import { TiltCard } from '@/components/effects/TiltCard'
import { SkillBar } from '@/components/effects/SkillBar'
import { FloatingLabelInput, SuccessOverlay, AnimatePresence } from '@/components/effects/FloatingLabelInput'

const stats = [
  { value: 10, suffix: '+', label: 'Projects Built' },
  { value: 3, suffix: '+', label: 'Years Experience' },
  { value: 20, suffix: '+', label: 'Technologies' },
  { value: 100, suffix: '%', label: 'Passion' },
]

const heroPhrases = ['Full Stack Developer', 'UI Engineer', 'Problem Solver', 'Creative Coder']

const floatingTech = [
  { label: 'React', className: 'left-[8%] top-[25%]', delay: 0 },
  { label: 'TypeScript', className: 'right-[10%] top-[20%]', delay: 0.5 },
  { label: 'Supabase', className: 'left-[15%] bottom-[30%]', delay: 1 },
  { label: 'Tailwind', className: 'right-[12%] bottom-[25%]', delay: 1.5 },
  { label: 'Node.js', className: 'left-[45%] top-[12%]', delay: 2 },
]

const skillBars = [
  { label: 'React / Next.js', level: 95 },
  { label: 'TypeScript', level: 90 },
  { label: 'Tailwind CSS', level: 92 },
  { label: 'Node.js / Express', level: 85 },
  { label: 'Supabase / PostgreSQL', level: 88 },
  { label: 'Framer Motion', level: 80 },
]

export function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [heroSettings, setHeroSettings] = useState({
    heading: 'Full Stack Developer',
    subheading: 'Building premium digital experiences with modern technology',
    cta_primary: 'View Projects',
    cta_secondary: 'About Me',
  })

  // Parallax for cinematic background
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('*').eq('status', 'published').eq('featured', true).order('order_index').limit(3),
      supabase.from('technologies').select('*').order('order_index').limit(20),
      supabase.from('settings').select('value').eq('key', 'hero').maybeSingle(),
    ]).then(([projects, techs, settings]: any[]) => {
      if (projects.data) setFeaturedProjects(projects.data)
      if (techs.data) setTechnologies(techs.data)
      if (settings.data) setHeroSettings(settings.data.value as typeof heroSettings)
    })
  }, [])

  return (
    <div className="relative">
      {/* ── HERO — cinematic with typewriter ──────────────── */}
      <section ref={heroRef} className="relative flex h-svh flex-col items-center justify-center overflow-hidden px-6">
        {/* Cinematic background image with parallax */}
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="cinematic-bg"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/cinematic-bg.webp)' }}
          />
          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        </motion.div>

        {/* Soft radial glow behind title */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/8 blur-[120px]" />

        {/* Floating tech badges */}
        {floatingTech.map((tech) => (
          <motion.div
            key={tech.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + tech.delay * 0.2, duration: 0.6 }}
            className={`absolute hidden lg:block ${tech.className}`}
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4 + tech.delay, repeat: Infinity, ease: 'easeInOut' }}
              className="glass-card flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground"
            >
              <span className="size-1.5 rounded-full bg-gold/60" />
              {tech.label}
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 0.1 }}
            className="mb-4 text-sm font-medium tracking-widest text-gold uppercase"
          >
            <Sparkles className="mr-1.5 inline size-3.5" />
            Vincent Paul Ecaldre
          </motion.p>

          {/* Name with typewriter */}
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ ...animTransition, delay: 0.15 }}
                className="block"
              >
                <Typewriter phrases={heroPhrases} className="text-gradient-gold" />
              </motion.span>
            </span>
          </h1>

          {/* Badge directly below name */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...animTransition, delay: 0.4 }}
            className="mb-6 flex justify-center"
          >
            <Badge variant="outline" className="border-gold/30 bg-gold/5 text-gold">
              <Zap className="mr-1.5 size-3" />
              Available for work
            </Badge>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 0.5 }}
            className="mx-auto mb-10 max-w-xl text-base leading-[1.8] text-muted-foreground sm:text-lg"
          >
            {heroSettings.subheading}
          </motion.p>

          {/* Magnetic CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton>
              <Button asChild size="lg" className="btn-gold group">
                <Link to="/projects">
                  {heroSettings.cta_primary}
                  <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button asChild size="lg" variant="outline" className="btn-glass group">
                <Link to="/about">{heroSettings.cta_secondary}</Link>
              </Button>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-border/40 p-1.5">
            <div className="scroll-indicator-dot size-1.5 rounded-full bg-gold" />
          </div>
        </motion.div>
      </section>

      {/* ── Stats with count-up ────────────────────────────── */}
      <section className="relative border-y border-border/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection stagger className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={animVariants.fadeScale}
                transition={animTransition}
                className="text-center"
              >
                <div className="text-4xl font-extrabold text-gradient-gold sm:text-5xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ── Featured Projects — bento grid with tilt ────────── */}
      {featuredProjects.length > 0 && (
        <section className="py-28 sm:py-36">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection stagger>
              <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-14">
                <p className="mb-2 text-sm font-medium tracking-wide text-gold">Featured Work</p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
                  Selected <span className="text-gradient-gold">Projects</span>
                </h2>
              </motion.div>

              <motion.div
                variants={{ animate: { transition: { staggerChildren: 0.12 } } }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {featuredProjects.map((project, i) => (
                  <motion.div key={project.id} variants={animVariants.fadeUp} transition={animTransition}>
                    <TiltCard className="relative h-full">
                      <ProjectCard project={project} featured={i === 0} />
                    </TiltCard>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mt-14 text-center">
                <MagneticButton className="inline-block">
                  <Button asChild variant="outline" className="btn-glass group">
                    <Link to="/projects">
                      View All Projects
                      <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </MagneticButton>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ── Skills with animated progress bars ─────────────── */}
      <section className="border-t border-border/40 py-28 sm:py-36">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection stagger>
            <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-14">
              <p className="mb-2 text-sm font-medium tracking-wide text-gold">Expertise</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
                Skills &amp; <span className="text-gradient-gold">Proficiency</span>
              </h2>
            </motion.div>

            <motion.div
              variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
              className="grid gap-x-12 gap-y-6 sm:grid-cols-2"
            >
              {skillBars.map((skill, i) => (
                <motion.div key={skill.label} variants={animVariants.fadeUp} transition={animTransition}>
                  <SkillBar label={skill.label} level={skill.level} delay={i * 0.05} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Tech Stack ────────────────────────────────────── */}
      {technologies.length > 0 && (
        <section className="border-t border-border/40 py-28 sm:py-36">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection stagger>
              <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-12">
                <p className="mb-2 text-sm font-medium tracking-wide text-gold">Tools of the Trade</p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Tech <span className="text-gradient-gold">Stack</span></h2>
              </motion.div>

              <motion.div
                variants={{ animate: { transition: { staggerChildren: 0.04 } } }}
                className="flex flex-wrap gap-3"
              >
                {technologies.map((tech) => (
                  <motion.div
                    key={tech.id}
                    variants={animVariants.fadeScale}
                    transition={animTransition}
                    whileHover={{ y: -3, scale: 1.05, transition: { duration: 0.15 } }}
                    className="glass-card flex cursor-default items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {tech.icon_url && <img src={tech.icon_url} alt={tech.name} className="size-4" />}
                    {tech.name}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ── Contact form with floating labels ──────────────── */}
      <ContactSection />

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="border-t border-border/40 py-28 sm:py-36">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <AnimatedSection stagger>
            <motion.h2 variants={animVariants.fadeUp} transition={animTransition} className="mb-4 text-2xl font-bold tracking-tight sm:text-4xl">
              Let's build something <span className="text-gradient-gold">together</span>
            </motion.h2>
            <motion.p variants={animVariants.fadeUp} transition={animTransition} className="mb-8 text-base leading-[1.75] text-muted-foreground">
              Open to new opportunities and exciting projects.
            </motion.p>
            <motion.div variants={animVariants.fadeUp} transition={animTransition}>
              <MagneticButton className="inline-block">
                <Button asChild size="lg" className="btn-gold group">
                  <a href="mailto:vincentecaldre25@gmail.com">
                    Get In Touch
                    <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </Button>
              </MagneticButton>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

/* ── Project card ─────────────────────────────────────── */
function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <Link to={`/projects/${project.slug}`}>
      <Card className={`glass-card animated-border group h-full overflow-hidden ${featured ? 'lg:col-span-2' : ''}`}>
        {project.cover_image ? (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={project.cover_image}
              alt={project.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-gold/10 via-surface to-surface">
            <span className="text-4xl font-extrabold text-gold/20">{project.title[0]}</span>
          </div>
        )}
        <CardContent className="p-5">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-secondary/60 text-xs transition-colors group-hover:border-gold/20">{tag}</Badge>
            ))}
          </div>
          <h3 className="mb-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-gold">
            {project.title}
          </h3>
          <p className="text-sm leading-[1.75] text-muted-foreground line-clamp-2">{project.description}</p>
          <div className="mt-4 flex items-center gap-4">
            {project.github_url && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                <GitBranch className="size-3.5" />GitHub
              </span>
            )}
            {project.live_url && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                <ExternalLink className="size-3.5" />Live
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

/* ── Contact section with animated form ────────────────── */
function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting || success) return
    setSubmitting(true)
    setError(null)

    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert({ name, email, message })

    setSubmitting(false)

    if (insertError) {
      setError('Something went wrong. Please try again.')
      return
    }
    setSuccess(true)
  }

  return (
    <section className="border-t border-border/40 py-28 sm:py-36">
      <div className="mx-auto max-w-3xl px-6">
        <AnimatedSection stagger>
          <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-12 text-center">
            <p className="mb-2 text-sm font-medium tracking-wide text-gold">Get In Touch</p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
              Let's <span className="text-gradient-gold">Connect</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-[1.75] text-muted-foreground">
              Have a project in mind or just want to say hi? Drop a message below.
            </p>
          </motion.div>

          <motion.div variants={animVariants.fadeUp} transition={animTransition} className="relative">
            <AnimatePresence mode="wait">
              {success ? (
                <SuccessOverlay
                  message="Thanks for reaching out — I'll get back to you soon."
                />
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-card space-y-4 p-6 sm:p-8"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FloatingLabelInput
                      id="name"
                      label="Your Name"
                      value={name}
                      onChange={setName}
                      required
                      icon={<User className="size-4" />}
                    />
                    <FloatingLabelInput
                      id="email"
                      label="Your Email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      required
                      icon={<Mail className="size-4" />}
                    />
                  </div>
                  <FloatingLabelInput
                    id="message"
                    label="Your Message"
                    value={message}
                    onChange={setMessage}
                    required
                    textarea
                    rows={5}
                    icon={<MessageSquare className="size-4" />}
                  />

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive"
                    >
                      {error}
                    </motion.p>
                  )}

                  <MagneticButton className="block w-full">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="btn-gold group w-full"
                    >
                      {submitting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="mr-2 inline-block size-4 rounded-full border-2 border-gold-foreground/30 border-t-gold-foreground"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </Button>
                  </MagneticButton>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  )
}
