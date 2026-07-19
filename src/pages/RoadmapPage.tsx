import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Clock, Archive } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import type { Roadmap } from '@/types/database'
import { cn } from '@/lib/utils'
import { BackgroundEffects } from '@/components/effects/BackgroundEffects'
import { animVariants, animTransition } from '@/components/effects/AnimatedSection'

function EmptyColumnIllustration() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/30 px-4 py-10">
      <svg
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-12 opacity-60"
        aria-hidden="true"
      >
        <polygon points="36,6 66,36 36,66 6,36" stroke="oklch(0.75 0.12 85)" strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity="0.4" />
        <polygon points="36,18 54,36 36,54 18,36" stroke="oklch(0.75 0.12 85)" strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity="0.25" />
        <circle cx="36" cy="36" r="3" fill="oklch(0.75 0.12 85)" opacity="0.5" />
      </svg>
      <p className="text-center text-xs text-muted-foreground/60">No items in this column yet</p>
    </div>
  )
}

const columns: {
  status: Roadmap['status']
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  badgeClass: string
  progressColor: string
}[] = [
  {
    status: 'planned',
    label: 'Planned',
    icon: Circle,
    color: 'text-muted-foreground',
    badgeClass: 'bg-secondary/60 text-secondary-foreground',
    progressColor: 'from-muted-foreground/40 to-muted-foreground/20',
  },
  {
    status: 'in_progress',
    label: 'In Progress',
    icon: Clock,
    color: 'text-blue-400',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    progressColor: 'from-blue-500/60 to-blue-400/30',
  },
  {
    status: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    progressColor: 'from-emerald-500/60 to-emerald-400/30',
  },
  {
    status: 'archived',
    label: 'Archived',
    icon: Archive,
    color: 'text-muted-foreground/50',
    badgeClass: 'bg-secondary/30 text-muted-foreground/50',
    progressColor: 'from-muted-foreground/30 to-muted-foreground/10',
  },
]

export function RoadmapPage() {
  const [items, setItems] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('roadmap')
      .select('*')
      .order('order_index')
      .then(({ data }: any) => {
        if (data) setItems(data as Roadmap[])
        setLoading(false)
      })
  }, [])

  const byStatus = (status: Roadmap['status']) => items.filter((i) => i.status === status)

  // Calculate progress per column
  const totalItems = items.length
  const columnProgress = (status: Roadmap['status']) => {
    if (totalItems === 0) return 0
    return Math.round((byStatus(status).length / totalItems) * 100)
  }

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
            className="mb-3 text-sm font-medium tracking-wide text-indigo"
          >
            What's Next
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 0.05 }}
            className="mb-4 text-3xl font-extrabold tracking-tight sm:text-5xl"
          >
            <span className="text-gradient">Roadmap</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 0.1 }}
            className="text-base leading-[1.75] text-muted-foreground"
          >
            A transparent look at what I'm working on, planning, and have completed.
          </motion.p>
        </div>
      </section>

      {/* Kanban Board */}
      <section className="pb-28 pt-6">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {columns.map((col) => (
                <div key={col.status} className="space-y-3">
                  <Skeleton className="h-7 w-28 rounded-md" />
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-lg" />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial="initial"
              animate="animate"
              variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {columns.map((col) => {
                const Icon = col.icon
                const colItems = byStatus(col.status)
                const progress = columnProgress(col.status)
                return (
                  <motion.div key={col.status} variants={animVariants.fadeUp} transition={animTransition}>
                    {/* Glass column header */}
                    <div className="glass-card mb-4 flex items-center justify-between rounded-lg px-4 py-3">
                      <div className={cn('flex items-center gap-2 text-sm font-semibold', col.color)}>
                        <Icon className={cn('size-4', col.status === 'in_progress' && colItems.length > 0 && 'pulse-glow rounded-full')} />
                        {col.label}
                      </div>
                      <Badge variant="secondary" className="bg-secondary/60 text-xs">
                        {colItems.length}
                      </Badge>
                    </div>

                    {/* Animated progress bar */}
                    {colItems.length > 0 && (
                      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-border/20">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className={cn('h-full rounded-full bg-gradient-to-r', col.progressColor)}
                        />
                      </div>
                    )}

                    {/* Cards */}
                    <div className="min-h-[120px] space-y-3">
                      {colItems.length === 0 ? (
                        <EmptyColumnIllustration />
                      ) : (
                        colItems.map((item) => (
                          <motion.div
                            key={item.id}
                            variants={animVariants.fadeUp}
                            transition={animTransition}
                            whileHover={{ y: -3, transition: { duration: 0.15 } }}
                          >
                            <Card className="glass-card animated-border">
                              <CardContent className="p-4">
                                <h3 className="mb-1.5 text-sm font-medium leading-snug text-foreground">
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className="text-xs leading-[1.65] text-muted-foreground line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                                {item.priority > 0 && (
                                  <div className="mt-2.5">
                                    <Badge
                                      variant="outline"
                                      className={cn('text-[10px]', col.badgeClass)}
                                    >
                                      Priority {item.priority}
                                    </Badge>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
