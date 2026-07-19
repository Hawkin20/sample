import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GitBranch, Link2, Mail, ArrowUp } from 'lucide-react'

const socials = [
  { href: 'https://github.com/Hawkin20', label: 'GitHub', Icon: GitBranch },
  { href: 'https://www.facebook.com/share/1bTEbZPFm4/', label: 'Facebook', Icon: Link2 },
  { href: 'mailto:vincentecaldre25@gmail.com', label: 'Email', Icon: Mail },
]

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/contact', label: 'Contact' },
]

export function Footer() {
  const year = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-border/40 pt-16 pb-10">
      <div className="mx-auto max-w-6xl px-6">
        {/* Animated divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-indigo/40 to-transparent"
        />

        {/* Main grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8"
        >
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link to="/" className="w-fit text-lg font-bold transition-opacity hover:opacity-80">
              <span className="text-gradient">VP</span>
              <span className="text-foreground">E</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Full Stack Developer crafting premium digital experiences.
            </p>
            {/* Social icons with hover glow */}
            <div className="mt-2 flex items-center gap-1">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group relative rounded-md p-2 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground"
                >
                  <Icon className="size-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:shadow-[0_0_12px_2px_oklch(0.585_0.22_264_/_0.2)]" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Navigation
            </p>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-block text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-px hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Contact
            </p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href="mailto:vincentecaldre25@gmail.com"
                  className="inline-block break-all text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-px hover:text-foreground"
                >
                  vincentecaldre25@gmail.com
                </a>
              </li>
              <li className="text-sm text-muted-foreground">Philippines</li>
              <li>
                <a
                  href="https://github.com/Hawkin20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-px hover:text-foreground"
                >
                  github.com/Hawkin20
                </a>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/30 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground/60">
            &copy; {year} Vincent Paul Ecaldre. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground/40">Built with React &amp; Supabase</p>
            {/* Back to top */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group flex size-8 items-center justify-center rounded-full border border-border/40 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo/40 hover:text-indigo"
            >
              <ArrowUp className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
