import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, GitBranch, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import type { Project, Technology } from '@/types/database'
import { BackgroundEffects } from '@/components/effects/BackgroundEffects'
import { CountUp } from '@/components/effects/CountUp'
import { AnimatedSection, animVariants, animTransition } from '@/components/effects/AnimatedSection'

const stats = [
  { value: 10, suffix: '+', label: 'Projects Built' },
  { value: 3, suffix: '+', label: 'Years Experience' },
  { value: 20, suffix: '+', label: 'Technologies' },
  { value: 100, suffix: '%', label: 'Passion' },
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
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-12">
        <BackgroundEffects parallax />

        {/* Soft radial glow behind title */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/6 blur-[120px]" />

        <motion.div
          className="relative z-10 mx-auto max-w-4xl text-center"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Name with text reveal */}
          <motion.h1
            variants={animVariants.fadeUp}
            transition={animTransition}
            className="mb-3 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
          >
            <span className="block overflow-hidden">
              <motion.span className="block" variants={animVariants.fadeUp} transition={animTransition}>
                Vincent Paul
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span className="block text-gradient-gold" variants={animVariants.fadeUp} transition={{ ...animTransition, delay: 0.1 }}>
                {heroSettings.heading}
              </motion.span>
            </span>
          </motion.h1>

          {/* Badge directly below name */}
          <motion.div variants={animVariants.fadeScale} transition={animTransition} className="mb-6 flex justify-center">
            <Badge variant="outline" className="border-gold/30 bg-gold/5 text-gold">
              <Zap className="mr-1.5 size-3" />
              Available for work
            </Badge>
          </motion.div>

          <motion.p
            variants={animVariants.fadeUp}
            transition={animTransition}
            className="mx-auto mb-10 max-w-xl text-base leading-[1.8] text-muted-foreground sm:text-lg"
          >
            {heroSettings.subheading}
          </motion.p>

          {/* CTA buttons with hover animation */}
          <motion.div variants={animVariants.fadeUp} transition={animTransition} className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="btn-gold group">
              <Link to="/projects">
                {heroSettings.cta_primary}
                <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="btn-glass group">
              <Link to="/about">{heroSettings.cta_secondary}</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-border/40 p-1.5">
            <div className="scroll-indicator-dot size-1.5 rounded-full bg-gold" />
          </div>
        </motion.div>
      </section>

      {/* ── Stats with count-up ────────────────────────────── */}
      <section className="border-y border-border/40 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection stagger className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={animVariants.fadeScale}
                transition={animTransition}
                className="text-center"
              >
                <div className="text-3xl font-extrabold text-gradient-gold sm:text-4xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1.5 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection stagger>
              <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-12">
                <p className="mb-2 text-sm font-medium tracking-wide text-gold">Featured Work</p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
                  Selected <span className="text-gradient-gold">Projects</span>
                </h2>
              </motion.div>

              <motion.div
                variants={{ animate: { transition: { staggerChildren: 0.12 } } }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {featuredProjects.map((project) => (
                  <motion.div key={project.id} variants={animVariants.fadeUp} transition={animTransition}>
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mt-12 text-center">
                <Button asChild variant="outline" className="btn-glass group">
                  <Link to="/projects">
                    View All Projects
                    <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ── Tech Stack ────────────────────────────────────── */}
      {technologies.length > 0 && (
        <section className="border-t border-border/40 py-24 sm:py-32">
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

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="border-t border-border/40 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <AnimatedSection stagger>
            <motion.h2 variants={animVariants.fadeUp} transition={animTransition} className="mb-4 text-2xl font-bold tracking-tight sm:text-4xl">
              Let's build something <span className="text-gradient-gold">together</span>
            </motion.h2>
            <motion.p variants={animVariants.fadeUp} transition={animTransition} className="mb-8 text-base leading-[1.75] text-muted-foreground">
              Open to new opportunities and exciting projects.
            </motion.p>
            <motion.div variants={animVariants.fadeUp} transition={animTransition}>
              <Button asChild size="lg" className="btn-gold group">
                <a href="mailto:vincentecaldre25@gmail.com">
                  Get In Touch
                  <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projects/${project.slug}`}>
      <Card className="glass-card animated-border group h-full overflow-hidden">
        {project.cover_image ? (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={project.cover_image}
              alt={project.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient overlay on hover */}
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
