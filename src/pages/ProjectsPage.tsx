import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ExternalLink, GitBranch } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types/database'

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

// Placeholder project — always shown when no real projects match
const PLACEHOLDER_PROJECT = {
  id: '__placeholder__',
  title: 'Palacio de Oro',
  slug: '__placeholder__',
  description: 'A premium digital experience built with React and Supabase',
  long_description: null,
  status: 'published' as const,
  featured: false,
  cover_image: null,
  github_url: null,
  live_url: null,
  tags: ['React', 'Supabase', 'Tailwind'],
  order_index: 9999,
  created_at: '',
  updated_at: '',
  __placeholder: true,
} as Project & { __placeholder?: boolean }

function EmptyProjectsIllustration() {
  return (
    <div className="py-24 text-center">
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto mb-6 h-32 w-auto opacity-40"
        aria-hidden="true"
      >
        <rect x="20" y="50" width="160" height="95" rx="8" fill="currentColor" className="text-muted" />
        <rect x="20" y="40" width="70" height="20" rx="6" fill="currentColor" className="text-muted" />
        <rect x="50" y="80" width="100" height="6" rx="3" fill="currentColor" className="text-muted-foreground/30" />
        <rect x="50" y="96" width="80" height="6" rx="3" fill="currentColor" className="text-muted-foreground/20" />
        <rect x="50" y="112" width="60" height="6" rx="3" fill="currentColor" className="text-muted-foreground/15" />
        <circle cx="148" cy="42" r="18" stroke="currentColor" strokeWidth="5" className="text-gold/50" />
        <line x1="161" y1="55" x2="174" y2="68" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-gold/50" />
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
    const tags = new Set([...projects.flatMap((p) => p.tags), ...PLACEHOLDER_PROJECT.tags])
    return Array.from(tags).sort()
  }, [projects])

  const filtered = useMemo(() => {
    const real = projects.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      const matchTag = !activeTag || p.tags.includes(activeTag)
      return matchSearch && matchTag
    })

    // Always include placeholder if it matches active filters
    const placeholderMatchesSearch =
      !search ||
      PLACEHOLDER_PROJECT.title.toLowerCase().includes(search.toLowerCase()) ||
      PLACEHOLDER_PROJECT.description?.toLowerCase().includes(search.toLowerCase())
    const placeholderMatchesTag =
      !activeTag || PLACEHOLDER_PROJECT.tags.includes(activeTag)

    if (placeholderMatchesSearch && placeholderMatchesTag) {
      return [...real, PLACEHOLDER_PROJECT as Project]
    }
    return real
  }, [projects, search, activeTag])

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 text-center sm:py-28">
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-10">
          <div className="size-[400px] rounded-full bg-gold/5 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-2xl px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-sm font-medium tracking-wide text-gold"
          >
            Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-4 text-3xl font-extrabold tracking-tight sm:text-5xl"
          >
            Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
                className="border-border/40 bg-secondary/50 pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={activeTag === null ? 'default' : 'outline'}
                onClick={() => setActiveTag(null)}
                className={
                  activeTag === null
                    ? 'bg-gold text-gold-foreground transition-all hover:-translate-y-px hover:bg-gold/90'
                    : 'border-border/40 transition-all hover:-translate-y-px'
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
                      ? 'bg-gold text-gold-foreground transition-all hover:-translate-y-px hover:bg-gold/90'
                      : 'border-border/40 text-muted-foreground transition-all hover:-translate-y-px hover:text-foreground'
                  }
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden border-border/40 bg-surface">
                  <Skeleton className="aspect-video" />
                  <CardContent className="space-y-3 p-5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyProjectsIllustration />
          ) : (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((project) => {
                  const isPlaceholder = (project as any).__placeholder === true
                  return (
                    <motion.div
                      key={project.id}
                      layout
                      {...fadeUp}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      {isPlaceholder ? (
                        <PlaceholderCard project={project} />
                      ) : (
                        <Link to={`/projects/${project.slug}`}>
                          <RealProjectCard project={project} />
                        </Link>
                      )}
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

function RealProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group h-full overflow-hidden border-border/40 bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/30 hover:shadow-xl hover:shadow-black/20">
      {project.cover_image ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={project.cover_image}
            alt={project.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-gold/10 via-surface to-surface">
          <span className="text-4xl font-extrabold text-gold/20">{project.title[0]}</span>
        </div>
      )}
      <CardContent className="p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-secondary/60 text-xs">{tag}</Badge>
          ))}
        </div>
        <h3 className="mb-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-gold">
          {project.title}
        </h3>
        <p className="text-sm leading-[1.75] text-muted-foreground line-clamp-2">{project.description}</p>
        <div className="mt-4 flex items-center gap-4">
          {project.github_url && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <GitBranch className="size-3.5" />GitHub
            </span>
          )}
          {project.live_url && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ExternalLink className="size-3.5" />Live
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function PlaceholderCard({ project }: { project: Project }) {
  return (
    <Card className="group h-full overflow-hidden border-border/40 bg-surface opacity-80 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/30 hover:opacity-100 hover:shadow-xl hover:shadow-black/20">
      {/* Gradient placeholder image */}
      <div
        className="flex aspect-video items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}
      >
        <span className="text-5xl font-extrabold" style={{ color: 'oklch(0.75 0.12 85 / 0.15)' }}>
          PO
        </span>
      </div>
      <CardContent className="p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-secondary/60 text-xs">{tag}</Badge>
          ))}
          {/* Coming soon badge */}
          <Badge
            variant="outline"
            className="border-gold/30 bg-gold/5 text-xs text-gold"
          >
            Coming soon
          </Badge>
        </div>
        <h3 className="mb-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-gold">
          {project.title}
        </h3>
        <p className="text-sm leading-[1.75] text-muted-foreground line-clamp-2">{project.description}</p>
      </CardContent>
    </Card>
  )
}
