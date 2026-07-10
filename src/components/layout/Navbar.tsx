import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValueEvent, useScroll, useMotionValue } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/roadmap', label: 'Roadmap' },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const toggle = () => setTheme(isDark ? 'light' : 'dark')

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative flex size-8 items-center justify-center rounded-md',
        'text-muted-foreground transition-colors duration-200',
        'hover:bg-secondary/60 hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
      style={{ overflow: 'hidden' }}
    >
      <Sun
        className="absolute size-4"
        style={{
          transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(180deg) scale(0.6)',
          opacity: isDark ? 1 : 0,
          pointerEvents: 'none',
        }}
      />
      <Moon
        className="absolute size-4"
        style={{
          transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isDark ? 'translateX(10px) scale(0.8)' : 'translateX(0px) scale(1)',
          opacity: isDark ? 0 : 1,
          pointerEvents: 'none',
        }}
      />
    </button>
  )
}

export function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Hide on scroll down, show on scroll up
  const { scrollY } = useScroll()
  const hiddenY = useMotionValue(0)
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(latest > 20)
    if (latest > prev && latest > 120 && !mobileOpen) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <motion.header
      style={{ y: hiddenY }}
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border/40 bg-background/70 backdrop-blur-xl'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-80"
        >
          <span className="text-lg font-bold tracking-tight">
            <span className="text-gradient-gold">VP</span>
            <span className="text-foreground">E</span>
          </span>
        </Link>

        {/* Desktop nav with animated underline */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              className={({ isActive }) =>
                cn(
                  'group relative rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground opacity-70 hover:text-foreground hover:opacity-100'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={cn(
                      'absolute bottom-0.5 left-1/2 h-px -translate-x-1/2 bg-gold transition-all duration-300',
                      isActive ? 'w-4 opacity-100' : 'w-0 opacity-0 group-hover:w-3 group-hover:opacity-60',
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none ring-ring transition-opacity hover:opacity-80 focus-visible:ring-2 ml-1">
                  <Avatar className="size-8">
                    <AvatarImage src={profile?.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-secondary text-xs">
                      {profile?.full_name?.[0] ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{profile?.full_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/login')}
              className="btn-glass border-border/50 text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile right: theme toggle + hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-all duration-200 hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-0.5 px-6 pb-5 pt-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    to={link.href}
                    end={link.href === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'rounded-md px-2 py-2.5 text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              {!user && (
                <Button
                  size="sm"
                  variant="outline"
                  className="btn-glass mt-3 w-fit border-border/50 hover:border-gold/40"
                  onClick={() => { setMobileOpen(false); navigate('/login') }}
                >
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
