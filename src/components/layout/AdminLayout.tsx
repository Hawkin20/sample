import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderOpen,
  Map,
  Route,
  Settings,
  Palette,
  ScrollText,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const adminLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { href: '/admin/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/admin/journey', icon: Map, label: 'Journey' },
  { href: '/admin/roadmap', icon: Route, label: 'Roadmap' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
  { href: '/admin/theme', icon: Palette, label: 'Theme' },
  { href: '/admin/logs', icon: ScrollText, label: 'Logs' },
]

export function AdminLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh bg-background">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-border/40 bg-surface">
        {/* Brand */}
        <div className="flex items-center gap-3 p-5">
          <div className="flex size-8 items-center justify-center rounded-md bg-gold text-gold-foreground text-sm font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-semibold">Admin CMS</p>
            <p className="text-xs text-muted-foreground">Portfolio</p>
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {adminLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gold/10 text-gold'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )
              }
            >
              <link.icon className="size-4 shrink-0" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Separator className="opacity-50" />

        {/* Bottom */}
        <div className="p-3 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
          >
            <ExternalLink className="size-4" />
            View Site
          </button>
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="size-7 shrink-0">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs bg-secondary">
                {profile?.full_name?.[0] ?? 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{profile?.full_name ?? 'Admin'}</p>
            </div>
            <button
              onClick={signOut}
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-destructive"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
