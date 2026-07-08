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
import type { Journey } from '@/types/database'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type JourneyForm = {
  title: string
  description: string
  type: 'job' | 'education' | 'milestone'
  company: string
  location: string
  start_date: string
  end_date: string
  current: boolean
}

const emptyForm: JourneyForm = {
  title: '',
  description: '',
  type: 'milestone',
  company: '',
  location: '',
  start_date: '',
  end_date: '',
  current: false,
}

const typeColor: Record<string, string> = {
  job: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  education: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  milestone: 'bg-gold/10 text-gold border-gold/20',
}

export function AdminJourney() {
  const [items, setItems] = useState<Journey[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Journey | null>(null)
  const [form, setForm] = useState<JourneyForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchItems = async () => {
    const { data } = await supabase.from('journey').select('*').order('order_index')
    if (data) setItems(data as Journey[])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true) }
  const openEdit = (j: Journey) => {
    setEditing(j)
    setForm({
      title: j.title,
      description: j.description ?? '',
      type: j.type,
      company: j.company ?? '',
      location: j.location ?? '',
      start_date: j.start_date ?? '',
      end_date: j.end_date ?? '',
      current: j.current,
    })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      type: form.type,
      company: form.company.trim() || null,
      location: form.location.trim() || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      current: form.current,
      updated_at: new Date().toISOString(),
    }

    let error: any = null
    if (editing) {
      const res = await supabase.from('journey').update(payload).eq('id', editing.id)
      error = res.error
      if (!error) toast.success('Journey entry updated')
    } else {
      const res = await supabase.from('journey').insert(payload)
      error = res.error
      if (!error) toast.success('Journey entry created')
    }
    if (error) { toast.error(error.message); setSaving(false); return }
    setSaving(false); setOpen(false); fetchItems()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return
    await supabase.from('journey').delete().eq('id', id)
    toast.success('Entry deleted')
    fetchItems()
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Journey</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your career timeline</p>
        </div>
        <Button onClick={openCreate} className="bg-gold text-gold-foreground hover:bg-gold/90">
          <Plus className="mr-2 size-4" />
          Add Entry
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">No journey entries yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="border-border/40 bg-surface">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <Badge variant="outline" className={cn('text-xs', typeColor[item.type])}>
                      {item.type}
                    </Badge>
                    {item.current && (
                      <Badge className="text-xs bg-gold/10 text-gold border-gold/30">Current</Badge>
                    )}
                  </div>
                  {item.company && <p className="text-sm text-muted-foreground">{item.company}</p>}
                  {(item.start_date || item.location) && (
                    <p className="text-xs text-muted-foreground/60">
                      {[item.start_date, item.location].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="rounded-md p-2 text-muted-foreground hover:text-foreground">
                    <Pencil className="size-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-md p-2 text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg border-border/40 bg-surface">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Entry' : 'Add Journey Entry'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className="bg-secondary/30 border-border/40" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v: any) => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger className="bg-secondary/30 border-border/40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job">Job</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Company/School</Label>
                <Input value={form.company} onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))} className="bg-secondary/30 border-border/40" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} className="bg-secondary/30 border-border/40" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={form.start_date} onChange={(e) => setForm(f => ({ ...f, start_date: e.target.value }))} className="bg-secondary/30 border-border/40" />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={form.end_date} onChange={(e) => setForm(f => ({ ...f, end_date: e.target.value }))} disabled={form.current} className="bg-secondary/30 border-border/40 disabled:opacity-50" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="current" checked={form.current} onChange={(e) => setForm(f => ({ ...f, current: e.target.checked }))} className="rounded border-border/40" />
              <Label htmlFor="current">Current position</Label>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className="bg-secondary/30 border-border/40 resize-y" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-border/40">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-gold text-gold-foreground hover:bg-gold/90">
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
