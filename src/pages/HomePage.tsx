import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, GitBranch, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import type { Project, Technology } from '@/types/database'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.09 } },
}

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
      <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="size-[600px] rounded-full bg-gold/5 blur-[120px]" />
        </div>

        <motion.div
          className="relative z-10 mx-auto max-w-4xl text-center"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <Badge
              variant="outline"
              className="mb-7 border-gold/30 bg-gold/5 text-gold"
            >
              <Zap className="mr-1.5 size-3" />
              Available for work
            </Badge>
          </motion.div>

          {/* Reduced on mobile, large on sm+ */}
          <motion.h1
            variants={fadeUp}
            className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
          >
            Vincent Paul
            <br />
            <span className="text-gradient-gold">{heroSettings.heading}</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mb-10 max-w-xl text-base leading-[1.8] text-muted-foreground sm:text-lg"
          >
            {heroSettings.subheading}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gold text-gold-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/20"
            >
              <Link to="/projects">
                {heroSettings.cta_primary}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border/50 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/30"
            >
              <Link to="/about">{heroSettings.cta_secondary}</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-border/40 p-1.5">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="size-1.5 rounded-full bg-gold"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="border-y border-border/40 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {[
              { value: '10+', label: 'Projects Built' },
              { value: '3+', label: 'Years Experience' },
              { value: '20+', label: 'Technologies' },
              { value: '100%', label: 'Passion' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <div className="text-3xl font-extrabold text-gradient-gold sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="mb-10">
                <p className="mb-2 text-sm font-medium tracking-wide text-gold">Featured Work</p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
                  Selected Projects
                </h2>
              </motion.div>

              <motion.div variants={stagger} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <motion.div key={project.id} variants={fadeUp}>
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="mt-10 text-center">
                <Button
                  asChild
                  variant="outline"
                  className="border-border/50 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/30"
                >
                  <Link to="/projects">
                    View All Projects
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Tech Stack ────────────────────────────────────── */}
      {technologies.length > 0 && (
        <section className="border-t border-border/40 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="mb-10">
                <p className="mb-2 text-sm font-medium tracking-wide text-gold">Tools of the Trade</p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Tech Stack</h2>
              </motion.div>

              <motion.div variants={stagger} className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                  <motion.div
                    key={tech.id}
                    variants={fadeUp}
                    whileHover={{ y: -3, transition: { duration: 0.12 } }}
                    className="flex cursor-default items-center gap-2 rounded-lg border border-border/40 bg-surface px-4 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:border-gold/30 hover:text-foreground"
                  >
                    {tech.icon_url && (
                      <img src={tech.icon_url} alt={tech.name} className="size-4" />
                    )}
                    {tech.name}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="border-t border-border/40 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="mb-4 text-2xl font-bold tracking-tight sm:text-4xl"
            >
              Let's build something{' '}
              <span className="text-gradient-gold">together</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mb-8 text-base leading-[1.75] text-muted-foreground"
            >
              Open to new opportunities and exciting projects.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button
                asChild
                size="lg"
                className="bg-gold text-gold-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/20"
              >
                <a href="mailto:vincentecaldre25@gmail.com">
                  Get In Touch
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projects/${project.slug}`}>
      <Card className="group h-full overflow-hidden border-border/40 bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/30 hover:shadow-xl hover:shadow-black/20">
        {project.cover_image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={project.cover_image}
              alt={project.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <CardContent className="p-5">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-secondary/60 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="mb-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-gold">
            {project.title}
          </h3>
          <p className="text-sm leading-[1.75] text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          <div className="mt-4 flex items-center gap-4">
            {project.github_url && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <GitBranch className="size-3.5" />
                GitHub
              </span>
            )}
            {project.live_url && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ExternalLink className="size-3.5" />
                Live
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
