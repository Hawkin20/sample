import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Route, Map, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import type { ActivityLog } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}
const stagger = { animate: { transition: { staggerChildren: 0.07 } } }

export function AdminDashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ projects: 0, roadmap: 0, journey: 0 })
  const [logs, setLogs] = useState<ActivityLog[]>([])

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('id', { count: 'exact' }),
      supabase.from('roadmap').select('id', { count: 'exact' }),
      supabase.from('journey').select('id', { count: 'exact' }),
      supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(8),
    ]).then(([p, r, j, l]: any[]) => {
      setStats({
        projects: p.count ?? 0,
        roadmap: r.count ?? 0,
        journey: j.count ?? 0,
      })
      if (l.data) setLogs(l.data)
    })
  }, [])

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderOpen, href: '/admin/projects', color: 'text-gold' },
    { label: 'Roadmap Items', value: stats.roadmap, icon: Route, href: '/admin/roadmap', color: 'text-blue-400' },
    { label: 'Journey Entries', value: stats.journey, icon: Map, href: '/admin/journey', color: 'text-purple-400' },
  ]

  return (
    <div className="p-8">
      <motion.div initial="initial" animate="animate" variants={stagger}>
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Good {getGreeting()},{' '}
            <span className="text-gradient-gold">
              {profile?.full_name?.split(' ')[0] ?? 'Admin'}
            </span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's an overview of your portfolio.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger} className="mb-8 grid gap-4 sm:grid-cols-3">
          {statCards.map((card) => (
            <motion.div key={card.label} variants={fadeUp}>
              <Link to={card.href}>
                <Card className="border-border/40 bg-surface transition-all hover:border-gold/30 hover:-translate-y-0.5">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{card.label}</p>
                        <p className={`mt-1 text-3xl font-bold ${card.color}`}>{card.value}</p>
                      </div>
                      <div className={`rounded-xl p-3 bg-secondary ${card.color}`}>
                        <card.icon className="size-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} className="mb-8">
          <h2 className="mb-4 text-base font-semibold">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'New Project', href: '/admin/projects' },
              { label: 'Add Journey Entry', href: '/admin/journey' },
              { label: 'Update Roadmap', href: '/admin/roadmap' },
              { label: 'Edit Settings', href: '/admin/settings' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-surface px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-gold/30 hover:text-foreground"
              >
                {action.label}
                <ArrowUpRight className="size-3.5" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        {logs.length > 0 && (
          <motion.div variants={fadeUp}>
            <h2 className="mb-4 text-base font-semibold">Recent Activity</h2>
            <Card className="border-border/40 bg-surface">
              <CardContent className="p-0">
                <div className="divide-y divide-border/30">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.action}</p>
                        {log.entity_type && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {log.entity_type}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground/60">
                        {new Date(log.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
