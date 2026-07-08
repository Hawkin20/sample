import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import type { Roadmap } from '@/types/database'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type RoadmapForm = {
  title: string
  description: string
  status: Roadmap['status']
  priority: string
}

const emptyForm: RoadmapForm = { title: '', description: '', status: 'planned', priority: '0' }

const statusColor: Record<string, string> = {
  planned: 'bg-secondary/60 text-muted-foreground',
  in_progress: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  archived: 'bg-secondary/30 text-muted-foreground/50',
}

export function AdminRoadmap() {
  const [items, setItems] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Roadmap | null>(null)
  const [form, setForm] = useState<RoadmapForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchItems = async () => {
    const { data } = await supabase.from('roadmap').select('*').order('status').order('order_index')
    if (data) setItems(data)
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true) }
  const openEdit = (r: Roadmap) => {
    setEditing(r)
    setForm({ title: r.title, description: r.description ?? '', status: r.status, priority: String(r.priority) })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title required'); return }
    setSaving(true)
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      priority: Number(form.priority) || 0,
      updated_at: new Date().toISOString(),
    }
    if (editing) {
      const { error } = await supabase.from('roadmap').update(payload).eq('id', editing.id)
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success('Updated')
    } else {
      const { error } = await supabase.from('roadmap').insert(payload)
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success('Created')
    }
    setSaving(false); setOpen(false); fetchItems()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return
    await supabase.from('roadmap').delete().eq('id', id)
    toast.success('Deleted')
    fetchItems()
  }

  const grouped = (status: Roadmap['status']) => items.filter(i => i.status === status)
  const statuses: Roadmap['status'][] = ['planned', 'in_progress', 'completed', 'archived']
  const labels: Record<string, string> = { planned: 'Planned', in_progress: 'In Progress', completed: 'Completed', archived: 'Archived' }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roadmap</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your project roadmap</p>
        </div>
        <Button onClick={openCreate} className="bg-gold text-gold-foreground hover:bg-gold/90">
          <Plus className="mr-2 size-4" />
          Add Item
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statuses.map(status => (
            <div key={status}>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-muted-foreground">{labels[status]}</span>
                <Badge variant="secondary" className="text-xs bg-secondary/60">{grouped(status).length}</Badge>
              </div>
              <div className="space-y-2">
                {grouped(status).map(item => (
                  <Card key={item.id} className="border-border/40 bg-surface">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => openEdit(item)} className="rounded p-1 text-muted-foreground hover:text-foreground">
                            <Pencil className="size-3.5" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="rounded p-1 text-muted-foreground hover:text-destructive">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                      {item.description && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      )}
                      <Badge variant="outline" className={cn('mt-2 text-[10px]', statusColor[item.status])}>
                        {labels[item.status]}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
                {grouped(status).length === 0 && (
                  <div className="rounded-lg border border-dashed border-border/30 p-4 text-center text-xs text-muted-foreground/50">Empty</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-border/40 bg-surface">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Item' : 'Add Roadmap Item'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="bg-secondary/30 border-border/40" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-secondary/30 border-border/40 resize-y" rows={3} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v: any) => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger className="bg-secondary/30 border-border/40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Input type="number" min="0" max="10" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="bg-secondary/30 border-border/40" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-border/40">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-gold text-gold-foreground hover:bg-gold/90">
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
