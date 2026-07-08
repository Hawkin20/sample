import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import type { ActivityLog } from '@/types/database'
import { Clock } from 'lucide-react'

export function AdminLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }: any) => {
        if (data) setLogs(data as ActivityLog[])
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Recent admin actions</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <Clock className="mx-auto mb-4 size-10 opacity-30" />
          <p>No activity yet</p>
        </div>
      ) : (
        <Card className="border-border/40 bg-surface">
          <CardContent className="p-0">
            <div className="divide-y divide-border/30">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-4">
                    <div className="size-2 rounded-full bg-gold shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{log.action}</p>
                      {log.entity_type && (
                        <div className="mt-0.5 flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] bg-secondary/60 capitalize">
                            {log.entity_type}
                          </Badge>
                          {log.entity_id && (
                            <span className="font-mono text-xs text-muted-foreground/60">
                              {log.entity_id.slice(0, 8)}...
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
