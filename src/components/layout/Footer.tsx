import { Link } from 'react-router-dom'
import { GitBranch, Link2, Mail } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 pt-14 pb-10">
      <div className="mx-auto max-w-6xl px-6">
        {/* Main grid — stacks on mobile, 3-col on desktop */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="w-fit text-lg font-bold transition-opacity hover:opacity-80"
            >
              <span className="text-gradient-gold">VP</span>
              <span className="text-foreground">E</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Full Stack Developer crafting premium digital experiences.
            </p>
            {/* Social icons */}
            <div className="mt-2 flex items-center gap-1">
              <a
                href="https://github.com/Hawkin20"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="rounded-md p-2 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground"
              >
                <GitBranch className="size-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1bTEbZPFm4/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-md p-2 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground"
              >
                <Link2 className="size-4" />
              </a>
              <a
                href="mailto:vincentecaldre25@gmail.com"
                aria-label="Email"
                className="rounded-md p-2 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Navigation
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/projects', label: 'Projects' },
                { to: '/roadmap', label: 'Roadmap' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-px hover:text-foreground inline-block"
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
                  className="text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-px hover:text-foreground inline-block break-all"
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
                  className="text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-px hover:text-foreground inline-block"
                >
                  github.com/Hawkin20
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/30 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground/60">
            &copy; {year} Vincent Paul Ecaldre. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/40">
            Built with React &amp; Supabase
          </p>
        </div>
      </div>
    </footer>
  )
}
