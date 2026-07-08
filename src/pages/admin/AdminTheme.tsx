import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface ThemeSettings {
  accent: string
  background: string
  surface: string
}

const presets = [
  { name: 'Gold (Default)', accent: '#E8B86D', background: '#090909', surface: '#131313' },
  { name: 'Cyan', accent: '#67E8F9', background: '#090909', surface: '#0D1117' },
  { name: 'Purple', accent: '#C084FC', background: '#09090F', surface: '#13131F' },
  { name: 'Emerald', accent: '#6EE7B7', background: '#090909', surface: '#0D1310' },
  { name: 'Rose', accent: '#FDA4AF', background: '#09090A', surface: '#130D0E' },
]

export function AdminTheme() {
  const [theme, setTheme] = useState<ThemeSettings>({ accent: '#E8B86D', background: '#090909', surface: '#131313' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('value').eq('key', 'theme').maybeSingle().then(({ data }: { data: any }) => {
      if (data?.value) setTheme(data.value as ThemeSettings)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'theme', value: theme, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    if (error) toast.error(error.message)
    else toast.success('Theme saved — refresh to see changes')
    setSaving(false)
  }

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Theme</h1>
        <p className="mt-1 text-sm text-muted-foreground">Customize your portfolio's color scheme</p>
      </div>

      {/* Presets */}
      <Card className="border-border/40 bg-surface">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {presets.map(preset => (
              <button
                key={preset.name}
                onClick={() => setTheme({ accent: preset.accent, background: preset.background, surface: preset.surface })}
                className="flex items-center gap-2 rounded-lg border border-border/40 px-3 py-2 text-sm text-muted-foreground transition-all hover:border-gold/30 hover:text-foreground"
              >
                <div
                  className="size-4 rounded-full border border-white/10"
                  style={{ background: preset.accent }}
                />
                {preset.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom */}
      <Card className="border-border/40 bg-surface">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Custom Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            {([
              { key: 'accent', label: 'Accent Color', description: 'Primary brand color' },
              { key: 'background', label: 'Background', description: 'Main page background' },
              { key: 'surface', label: 'Surface', description: 'Cards and panels' },
            ] as const).map(({ key, label, description }) => (
              <div key={key} className="space-y-2">
                <Label>{label}</Label>
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 shrink-0 rounded-md border border-border/40 cursor-pointer relative"
                    style={{ background: theme[key] }}
                  >
                    <input
                      type="color"
                      value={theme[key]}
                      onChange={e => setTheme(t => ({ ...t, [key]: e.target.value }))}
                      className="absolute inset-0 opacity-0 cursor-pointer size-full"
                    />
                  </div>
                  <Input
                    value={theme[key]}
                    onChange={e => setTheme(t => ({ ...t, [key]: e.target.value }))}
                    className="bg-secondary/30 border-border/40 font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div>
            <Label className="mb-3 block">Preview</Label>
            <div
              className="rounded-xl p-6 border border-border/20"
              style={{ background: theme.background }}
            >
              <div
                className="rounded-lg p-4 mb-3"
                style={{ background: theme.surface, border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <p className="text-sm font-medium text-white/90 mb-1">Portfolio Card</p>
                <p className="text-xs text-white/50">Card content preview</p>
              </div>
              <div className="flex gap-2">
                <div
                  className="rounded-md px-4 py-2 text-sm font-medium"
                  style={{ background: theme.accent, color: '#000' }}
                >
                  Primary Button
                </div>
                <div
                  className="rounded-md px-4 py-2 text-sm font-medium border"
                  style={{ border: `1px solid ${theme.accent}30`, color: theme.accent }}
                >
                  Outline
                </div>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="bg-gold text-gold-foreground hover:bg-gold/90">
            <Save className="mr-2 size-4" />
            {saving ? 'Saving...' : 'Save Theme'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
