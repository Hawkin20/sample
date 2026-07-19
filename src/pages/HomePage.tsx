import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, ExternalLink, GitBranch, Mail, User, MessageSquare,
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
import { IDCard } from '@/components/effects/IDCard'

type Stat =
  | { display: 'number'; value: number; suffix: string; label: string }
  | { display: 'text'; text: string; label: string }
  | { display: 'easter-egg'; value: number; suffix: string; label: string; hoverText: string }

const stats: Stat[] = [
  { display: 'number', value: 2, suffix: '', label: 'Projects Built' },
  { display: 'text', text: 'Student', label: 'Experience' },
  { display: 'number', value: 10, suffix: '+', label: 'Technologies' },
  { display: 'easter-egg', value: 9, suffix: '%', label: 'Passion', hoverText: '91% Sting Strawberry' },
]

const heroPhrases = ['Full Stack Developer', 'UI Engineer', 'Problem Solver', 'Creative Coder']

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
      {/* ── HERO — ID Card centerpiece with cinematic bg ──── */}
      <section ref={heroRef} className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
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

        {/* Soft radial glow behind card */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />

        {/* ID Card — centerpiece */}
        <div className="relative z-10 mb-10">
          <IDCard />
        </div>

        {/* Subtitle with typewriter */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 mx-auto max-w-2xl text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 0.8 }}
            className="mb-4 text-sm font-medium tracking-widest text-indigo uppercase"
          >
            <Sparkles className="mr-1.5 inline size-3.5" />
            Vincent Paul Ecaldre
          </motion.p>

          <h2 className="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
            <Typewriter phrases={heroPhrases} className="text-gradient" />
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 1 }}
            className="mx-auto mb-8 max-w-xl text-base leading-[1.8] text-muted-foreground"
          >
            {heroSettings.subheading}
          </motion.p>

          {/* Magnetic CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 1.1 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton>
              <Button asChild size="lg" className="btn-primary group">
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
          transition={{ delay: 1.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-border/40 p-1.5">
            <div className="scroll-indicator-dot size-1.5 rounded-full bg-indigo" />
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
                className="group text-center"
              >
                <div className="text-4xl font-extrabold text-gradient sm:text-5xl">
                  {stat.display === 'number' && (
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  )}
                  {stat.display === 'text' && <span>{stat.text}</span>}
                  {stat.display === 'easter-egg' && (
                    <span className="relative inline-block">
                      <span className="transition-opacity duration-300 group-hover:opacity-0">
                        <CountUp value={stat.value} suffix={stat.suffix} />
                      </span>
                      <span
                        className="pointer-events-none absolute inset-0 flex items-center justify-center whitespace-nowrap text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        aria-hidden="true"
                      >
                        {stat.hoverText}
                      </span>
                    </span>
                  )}
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
                <p className="section-label mb-2">Featured Work</p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
                  Selected <span className="text-gradient">Projects</span>
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
              <p className="section-label mb-2">Expertise</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
                Skills &amp; <span className="text-gradient">Proficiency</span>
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
              Let's build something <span className="text-gradient">together</span>
            </motion.h2>
            <motion.p variants={animVariants.fadeUp} transition={animTransition} className="mb-8 text-base leading-[1.75] text-muted-foreground">
              Open to new opportunities and exciting projects.
            </motion.p>
            <motion.div variants={animVariants.fadeUp} transition={animTransition}>
              <MagneticButton className="inline-block">
                <Button asChild size="lg" className="btn-primary group">
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
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})

  const validate = () => {
    const e: { name?: string; email?: string; message?: string } = {}
    if (!name.trim() || name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email'
    if (!message.trim() || message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting || success) return

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
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
            <p className="section-label mb-2">Get In Touch</p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
              Let's <span className="text-gradient">Connect</span>
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
                  noValidate
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-card space-y-4 p-6 sm:p-8"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <FloatingLabelInput
                        id="name"
                        label="Your Name"
                        value={name}
                        onChange={(v) => { setName(v); if (errors.name) setErrors((p) => ({ ...p, name: undefined })) }}
                        required
                        hasError={!!errors.name}
                        icon={<User className="size-4" />}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <FloatingLabelInput
                        id="email"
                        label="Your Email"
                        type="email"
                        value={email}
                        onChange={(v) => { setEmail(v); if (errors.email) setErrors((p) => ({ ...p, email: undefined })) }}
                        required
                        hasError={!!errors.email}
                        icon={<Mail className="size-4" />}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <FloatingLabelInput
                      id="message"
                      label="Your Message"
                      value={message}
                      onChange={(v) => { setMessage(v); if (errors.message) setErrors((p) => ({ ...p, message: undefined })) }}
                      required
                      hasError={!!errors.message}
                      textarea
                      rows={5}
                      icon={<MessageSquare className="size-4" />}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>
                    )}
                  </div>

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
                      className="btn-primary group w-full"
                    >
                      {submitting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="mr-2 inline-block size-4 rounded-full border-2 border-white/30 border-t-white"
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
