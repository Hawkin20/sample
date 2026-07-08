import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface ContactSettings {
  name: string
  email: string
  facebook: string
  github: string
}

interface HeroSettings {
  heading: string
  subheading: string
  cta_primary: string
  cta_secondary: string
}

interface AboutSettings {
  bio: string
  philosophy: string
  fun_facts: string[]
}

export function AdminSettings() {
  const [contact, setContact] = useState<ContactSettings>({ name: '', email: '', facebook: '', github: '' })
  const [hero, setHero] = useState<HeroSettings>({ heading: '', subheading: '', cta_primary: '', cta_secondary: '' })
  const [about, setAbout] = useState<AboutSettings>({ bio: '', philosophy: '', fun_facts: [] })
  const [funFacts, setFunFacts] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('settings')
      .select('key, value')
      .in('key', ['contact', 'hero', 'about'])
      .then(({ data }: { data: any[] | null }) => {
        data?.forEach((row: any) => {
          if (row.key === 'contact') setContact(row.value as ContactSettings)
          if (row.key === 'hero') setHero(row.value as HeroSettings)
          if (row.key === 'about') {
            const v = row.value as AboutSettings
            setAbout(v)
            setFunFacts(v.fun_facts?.join('\n') ?? '')
          }
        })
        setLoading(false)
      })
  }, [])

  const saveSetting = async (key: string, value: unknown) => {
    setSaving(key)
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    if (error) { toast.error(error.message) }
    else { toast.success('Settings saved') }
    setSaving(null)
  }

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your portfolio content and contact info</p>
      </div>

      {/* Contact */}
      <Card className="border-border/40 bg-surface">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={contact.name} onChange={e => setContact(c => ({ ...c, name: e.target.value }))} className="bg-secondary/30 border-border/40" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} className="bg-secondary/30 border-border/40" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>GitHub URL</Label>
              <Input value={contact.github} onChange={e => setContact(c => ({ ...c, github: e.target.value }))} placeholder="https://github.com/..." className="bg-secondary/30 border-border/40" />
            </div>
            <div className="space-y-1.5">
              <Label>Facebook URL</Label>
              <Input value={contact.facebook} onChange={e => setContact(c => ({ ...c, facebook: e.target.value }))} placeholder="https://facebook.com/..." className="bg-secondary/30 border-border/40" />
            </div>
          </div>
          <Button onClick={() => saveSetting('contact', contact)} disabled={saving === 'contact'} size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90">
            <Save className="mr-2 size-4" />
            {saving === 'contact' ? 'Saving...' : 'Save Contact'}
          </Button>
        </CardContent>
      </Card>

      {/* Hero */}
      <Card className="border-border/40 bg-surface">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Heading</Label>
            <Input value={hero.heading} onChange={e => setHero(h => ({ ...h, heading: e.target.value }))} className="bg-secondary/30 border-border/40" />
          </div>
          <div className="space-y-1.5">
            <Label>Subheading</Label>
            <Textarea value={hero.subheading} onChange={e => setHero(h => ({ ...h, subheading: e.target.value }))} className="bg-secondary/30 border-border/40 resize-y" rows={2} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Primary CTA Text</Label>
              <Input value={hero.cta_primary} onChange={e => setHero(h => ({ ...h, cta_primary: e.target.value }))} className="bg-secondary/30 border-border/40" />
            </div>
            <div className="space-y-1.5">
              <Label>Secondary CTA Text</Label>
              <Input value={hero.cta_secondary} onChange={e => setHero(h => ({ ...h, cta_secondary: e.target.value }))} className="bg-secondary/30 border-border/40" />
            </div>
          </div>
          <Button onClick={() => saveSetting('hero', hero)} disabled={saving === 'hero'} size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90">
            <Save className="mr-2 size-4" />
            {saving === 'hero' ? 'Saving...' : 'Save Hero'}
          </Button>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-border/40 bg-surface">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">About Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Bio</Label>
            <Textarea value={about.bio} onChange={e => setAbout(a => ({ ...a, bio: e.target.value }))} className="bg-secondary/30 border-border/40 resize-y" rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label>Philosophy Quote</Label>
            <Textarea value={about.philosophy} onChange={e => setAbout(a => ({ ...a, philosophy: e.target.value }))} className="bg-secondary/30 border-border/40 resize-y" rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label>Fun Facts (one per line)</Label>
            <Textarea
              value={funFacts}
              onChange={e => setFunFacts(e.target.value)}
              className="bg-secondary/30 border-border/40 resize-y font-mono text-sm"
              rows={4}
              placeholder="Coffee-driven developer&#10;Open source contributor&#10;Night owl coder"
            />
          </div>
          <Button
            onClick={() => saveSetting('about', { ...about, fun_facts: funFacts.split('\n').map((f: string) => f.trim()).filter(Boolean) })}
            disabled={saving === 'about'}
            size="sm"
            className="bg-gold text-gold-foreground hover:bg-gold/90"
          >
            <Save className="mr-2 size-4" />
            {saving === 'about' ? 'Saving...' : 'Save About'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
