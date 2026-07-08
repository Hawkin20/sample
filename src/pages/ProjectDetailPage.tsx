import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, GitBranch, ExternalLink, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import type { Project, ProjectGallery, Technology } from '@/types/database'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [gallery, setGallery] = useState<ProjectGallery[]>([])
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    ;(async () => {
      const { data: proj } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (!proj) {
        setNotFound(true)
        setLoading(false)
        return
      }
      const p = proj as Project
      setProject(p)

      const [galleryRes, techRes] = await Promise.all([
        supabase.from('project_gallery').select('*').eq('project_id', p.id).order('order_index'),
        supabase
          .from('project_technologies')
          .select('technology_id, technologies(*)')
          .eq('project_id', p.id),
      ])

      if (galleryRes.data) setGallery(galleryRes.data as ProjectGallery[])
      if (techRes.data) {
        const techs = (techRes.data as any[])
          .map((r: any) => r.technologies)
          .filter(Boolean) as Technology[]
        setTechnologies(techs)
      }
      setLoading(false)
    })()
  }, [slug])

  if (loading) return <ProjectDetailSkeleton />

  if (notFound || !project) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center pt-20 text-center">
        <h1 className="mb-4 text-2xl font-bold">Project not found</h1>
        <Button asChild variant="outline">
          <Link to="/projects">
            <ArrowLeft className="mr-2 size-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Back */}
        <motion.div {...fadeUp}>
          <Link
            to="/projects"
            className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div {...fadeUp} className="mb-8">
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-secondary/60">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-xl text-muted-foreground">{project.description}</p>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            {project.github_url && (
              <Button asChild variant="outline" className="border-border/50">
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <GitBranch className="mr-2 size-4" />
                  View Code
                </a>
              </Button>
            )}
            {project.live_url && (
              <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 size-4" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Cover */}
        {project.cover_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 overflow-hidden rounded-xl border border-border/40"
          >
            <img
              src={project.cover_image}
              alt={project.title}
              className="w-full object-cover"
            />
          </motion.div>
        )}

        {/* Description */}
        {project.long_description && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-12"
          >
            <h2 className="mb-4 text-xl font-semibold">About this project</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {project.long_description}
            </div>
          </motion.div>
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="mb-4 text-xl font-semibold">Technologies</h2>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-center gap-2 rounded-lg border border-border/40 bg-surface px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {tech.icon_url && <img src={tech.icon_url} alt={tech.name} className="size-4" />}
                  {tech.name}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="mb-6 text-xl font-semibold">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {gallery.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-lg border border-border/40">
                  <img
                    src={item.image_url}
                    alt={item.caption ?? ''}
                    className="w-full object-cover"
                  />
                  {item.caption && (
                    <p className="border-t border-border/40 px-4 py-2 text-xs text-muted-foreground">
                      {item.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Meta */}
        <div className="mt-12 flex items-center gap-2 text-xs text-muted-foreground/60">
          <Calendar className="size-3" />
          <span>Created {new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
        </div>
      </div>
    </div>
  )
}

function ProjectDetailSkeleton() {
  return (
    <div className="pt-20">
      <div className="mx-auto max-w-4xl px-6 py-16 space-y-8">
        <Skeleton className="h-4 w-24" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  )
}
