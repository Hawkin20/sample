import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff } from 'lucide-react'
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
import type { Project } from '@/types/database'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type ProjectForm = {
  title: string
  slug: string
  description: string
  long_description: string
  status: 'published' | 'draft' | 'archived'
  featured: boolean
  cover_image: string
  github_url: string
  live_url: string
  tags: string
}

const emptyForm: ProjectForm = {
  title: '',
  slug: '',
  description: '',
  long_description: '',
  status: 'draft',
  featured: false,
  cover_image: '',
  github_url: '',
  live_url: '',
  tags: '',
}

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState<ProjectForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('order_index')
    if (data) setProjects(data)
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (p: Project) => {
    setEditing(p)
    setForm({
      title: p.title,
      slug: p.slug,
      description: p.description ?? '',
      long_description: p.long_description ?? '',
      status: p.status,
      featured: p.featured,
      cover_image: p.cover_image ?? '',
      github_url: p.github_url ?? '',
      live_url: p.live_url ?? '',
      tags: p.tags.join(', '),
    })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('Title and slug are required')
      return
    }
    setSaving(true)
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      description: form.description.trim() || null,
      long_description: form.long_description.trim() || null,
      status: form.status,
      featured: form.featured,
      cover_image: form.cover_image.trim() || null,
      github_url: form.github_url.trim() || null,
      live_url: form.live_url.trim() || null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    }

    if (editing) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editing.id)
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success('Project updated')
      await logActivity('Updated project', 'projects', editing.id)
    } else {
      const { error } = await supabase.from('projects').insert(payload)
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success('Project created')
      await logActivity('Created project', 'projects')
    }

    setSaving(false)
    setOpen(false)
    fetchProjects()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    toast.success('Project deleted')
    await logActivity('Deleted project', 'projects', id)
    fetchProjects()
  }

  const toggleStatus = async (p: Project) => {
    const next = p.status === 'published' ? 'draft' : 'published'
    await supabase.from('projects').update({ status: next }).eq('id', p.id)
    fetchProjects()
  }

  const toggleFeatured = async (p: Project) => {
    await supabase.from('projects').update({ featured: !p.featured }).eq('id', p.id)
    fetchProjects()
  }

  const statusColor: Record<string, string> = {
    published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    draft: 'bg-secondary/60 text-muted-foreground',
    archived: 'bg-secondary/30 text-muted-foreground/50',
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button onClick={openCreate} className="bg-gold text-gold-foreground hover:bg-gold/90">
          <Plus className="mr-2 size-4" />
          New Project
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <FolderEmpty />
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="border-border/40 bg-surface">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {project.cover_image && (
                      <img
                        src={project.cover_image}
                        alt={project.title}
                        className="size-12 rounded-md object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">{project.title}</p>
                        {project.featured && (
                          <Star className="size-3.5 text-gold shrink-0 fill-gold" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <Badge variant="outline" className={cn('text-xs', statusColor[project.status])}>
                          {project.status}
                        </Badge>
                        {project.tags.slice(0, 3).map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs bg-secondary/60">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleFeatured(project)}
                      className="rounded-md p-2 text-muted-foreground hover:text-gold transition-colors"
                      title="Toggle featured"
                    >
                      {project.featured ? <Star className="size-4 fill-gold text-gold" /> : <StarOff className="size-4" />}
                    </button>
                    <button
                      onClick={() => toggleStatus(project)}
                      className="rounded-md p-2 text-muted-foreground hover:text-foreground transition-colors"
                      title="Toggle status"
                    >
                      {project.status === 'published' ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                    <button
                      onClick={() => openEdit(project)}
                      className="rounded-md p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="rounded-md p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl border-border/40 bg-surface">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Project' : 'New Project'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value
                    setForm(f => ({
                      ...f,
                      title,
                      slug: f.slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    }))
                  }}
                  className="bg-secondary/30 border-border/40"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="bg-secondary/30 border-border/40 font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Short Description</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                className="bg-secondary/30 border-border/40"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="long_description">Long Description</Label>
              <Textarea
                id="long_description"
                value={form.long_description}
                onChange={(e) => setForm(f => ({ ...f, long_description: e.target.value }))}
                className="bg-secondary/30 border-border/40 min-h-[120px] resize-y"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v: any) => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger className="bg-secondary/30 border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={form.tags}
                  onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="React, TypeScript, ..."
                  className="bg-secondary/30 border-border/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input
                id="cover_image"
                value={form.cover_image}
                onChange={(e) => setForm(f => ({ ...f, cover_image: e.target.value }))}
                placeholder="https://..."
                className="bg-secondary/30 border-border/40"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  value={form.github_url}
                  onChange={(e) => setForm(f => ({ ...f, github_url: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="bg-secondary/30 border-border/40"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="live_url">Live URL</Label>
                <Input
                  id="live_url"
                  value={form.live_url}
                  onChange={(e) => setForm(f => ({ ...f, live_url: e.target.value }))}
                  placeholder="https://..."
                  className="bg-secondary/30 border-border/40"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm(f => ({ ...f, featured: e.target.checked }))}
                className="rounded border-border/40"
              />
              <Label htmlFor="featured">Featured project</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-border/40">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gold text-gold-foreground hover:bg-gold/90"
            >
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FolderEmpty() {
  return (
    <div className="space-y-2">
      <p className="text-lg font-medium">No projects yet</p>
      <p className="text-sm">Create your first project to get started.</p>
    </div>
  )
}

async function logActivity(action: string, entityType?: string, entityId?: string) {
  await supabase.from('activity_logs').insert({
    action,
    entity_type: entityType ?? null,
    entity_id: entityId ?? null,
  })
}
