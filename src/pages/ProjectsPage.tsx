import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ExternalLink, GitBranch, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types/database'
import { BackgroundEffects } from '@/components/effects/BackgroundEffects'
import { animVariants, animTransition } from '@/components/effects/AnimatedSection'
import { TiltCard } from '@/components/effects/TiltCard'

function EmptyProjectsIllustration() {
  return (
    <div className="py-24 text-center">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6 size-24 opacity-40" aria-hidden="true">
        <polygon points="60,8 104,32 104,88 60,112 16,88 16,32" stroke="oklch(0.585 0.22 264)" strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity="0.5" />
        <polygon points="60,26 88,41 88,71 60,86 32,71 32,41" stroke="oklch(0.585 0.22 264)" strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity="0.3" />
        <line x1="60" y1="50" x2="60" y2="70" stroke="oklch(0.585 0.22 264)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="50" y1="60" x2="70" y2="60" stroke="oklch(0.585 0.22 264)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
      <p className="text-base font-medium text-foreground">No projects yet</p>
      <p className="mt-1.5 text-sm text-muted-foreground">Check back soon — something is being built.</p>
    </div>
  )
}

function EmptySearchIllustration() {
  return (
    <div className="py-24 text-center">
      <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6 h-32 w-auto opacity-40" aria-hidden="true">
        <rect x="20" y="50" width="160" height="95" rx="8" fill="currentColor" className="text-muted" />
        <rect x="20" y="40" width="70" height="20" rx="6" fill="currentColor" className="text-muted" />
        <rect x="50" y="80" width="100" height="6" rx="3" fill="currentColor" className="text-muted-foreground/30" />
        <rect x="50" y="96" width="80" height="6" rx="3" fill="currentColor" className="text-muted-foreground/20" />
        <rect x="50" y="112" width="60" height="6" rx="3" fill="currentColor" className="text-muted-foreground/15" />
        <circle cx="148" cy="42" r="18" stroke="currentColor" strokeWidth="5" className="text-indigo/50" />
        <line x1="161" y1="55" x2="174" y2="68" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-indigo/50" />
      </svg>
      <p className="text-base font-medium text-foreground">No projects found</p>
      <p className="mt-1.5 text-sm text-muted-foreground">Try adjusting your search or filters.</p>
    </div>
  )
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('order_index')
      .then(({ data }: any) => {
        if (data) setProjects(data as Project[])
        setLoading(false)
      })
  }, [])

  const allTags = useMemo(() => {
    const tags = new Set(projects.flatMap((p) => p.tags))
    return Array.from(tags).sort()
  }, [projects])

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      const matchTag = !activeTag || p.tags.includes(activeTag)
      return matchSearch && matchTag
    })
  }, [projects, search, activeTag])

  const isFiltering = search.length > 0 || activeTag !== null

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
            Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 0.05 }}
            className="mb-4 text-3xl font-extrabold tracking-tight sm:text-5xl"
          >
            <span className="text-gradient">Projects</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 0.1 }}
            className="text-base leading-[1.75] text-muted-foreground"
          >
            A collection of things I've built — from side projects to production apps.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-y border-border/40 py-5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-glow border-border/40 bg-secondary/50 pl-9"
              />
            </div>
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={activeTag === null ? 'default' : 'outline'}
                  onClick={() => setActiveTag(null)}
                  className={
                    activeTag === null
                      ? 'btn-primary'
                      : 'btn-glass border-border/40 text-muted-foreground hover:text-foreground'
                  }
                >
                  All
                </Button>
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    size="sm"
                    variant={activeTag === tag ? 'default' : 'outline'}
                    onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                    className={
                      activeTag === tag
                        ? 'btn-primary'
                        : 'btn-glass border-border/40 text-muted-foreground hover:text-foreground'
                    }
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className={`overflow-hidden border-border/40 bg-surface ${i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}`}>
                  <Skeleton className="aspect-video" />
                  <CardContent className="space-y-3 p-5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : projects.length === 0 && !isFiltering ? (
            <EmptyProjectsIllustration />
          ) : filtered.length === 0 ? (
            <EmptySearchIllustration />
          ) : (
            <motion.div
              layout
              initial="initial"
              animate="animate"
              variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => {
                  // Bento: first card spans 2 columns (featured/large)
                  const isFeatured = i === 0 && filtered.length > 2 && !isFiltering
                  return (
                    <motion.div
                      key={project.id}
                      layout
                      variants={animVariants.fadeUp}
                      transition={animTransition}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={isFeatured ? 'sm:col-span-2 lg:col-span-2' : ''}
                    >
                      <TiltCard className="relative h-full">
                        <ProjectCard project={project} featured={isFeatured} />
                      </TiltCard>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <Link to={`/projects/${project.slug}`} className="block h-full">
      <Card className="glass-card animated-border group h-full overflow-hidden">
        {project.cover_image ? (
          <div className={`relative overflow-hidden ${featured ? 'aspect-[2/1]' : 'aspect-video'}`}>
            <img
              src={project.cover_image}
              alt={project.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ) : (
          <div className={`flex ${featured ? 'aspect-[2/1]' : 'aspect-video'} items-center justify-center bg-gradient-to-br from-indigo/10 via-violet/5 to-cyan/5`}>
            <span className="text-4xl font-extrabold text-gradient">{project.title[0]}</span>
          </div>
        )}
        <CardContent className="p-5">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-secondary/60 text-xs transition-colors duration-200 group-hover:border-indigo/20 group-hover:bg-secondary/80"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className={`mb-2 font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-indigo ${featured ? 'text-lg' : ''}`}>
            {project.title}
          </h3>
          <p className="text-sm leading-[1.75] text-muted-foreground line-clamp-2">{project.description}</p>
          <div className="mt-4 flex items-center gap-3 overflow-hidden">
            {project.github_url && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground">
                <GitBranch className="size-3.5 transition-transform duration-300 group-hover:scale-110" />
                GitHub
              </span>
            )}
            {project.live_url && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground">
                <ExternalLink className="size-3.5 transition-transform duration-300 group-hover:scale-110" />
                Live Demo
              </span>
            )}
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground/40 opacity-0 transition-all duration-300 group-hover:opacity-100">
              View <ArrowRight className="size-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
