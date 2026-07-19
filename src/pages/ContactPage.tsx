import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, GitBranch, Globe, MapPin, Send, User, MessageSquare, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { BackgroundEffects } from '@/components/effects/BackgroundEffects'
import { AnimatedSection, animVariants, animTransition } from '@/components/effects/AnimatedSection'
import { MagneticButton } from '@/components/effects/MagneticButton'
import { FloatingLabelInput, SuccessOverlay } from '@/components/effects/FloatingLabelInput'

const contactInfo = [
  { Icon: Mail, label: 'Email', value: 'vincentecaldre25@gmail.com', href: 'mailto:vincentecaldre25@gmail.com' },
  { Icon: GitBranch, label: 'GitHub', value: 'github.com/Hawkin20', href: 'https://github.com/Hawkin20' },
  { Icon: Globe, label: 'LinkedIn', value: 'in/vincent-ecaldre', href: '#' },
  { Icon: MapPin, label: 'Location', value: 'Philippines', href: null },
]

const confettiColors = [
  'oklch(0.585 0.22 264)',
  'oklch(0.54 0.26 285)',
  'oklch(0.7 0.16 210)',
  'oklch(0.78 0.14 83)',
  'oklch(0.72 0.18 145)',
]

function Confetti() {
  const pieces = Array.from({ length: 24 })
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100
        const delay = Math.random() * 0.3
        const color = confettiColors[i % confettiColors.length]
        return (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              top: '40%',
              background: color,
              animationDelay: `${delay}s`,
            }}
          />
        )
      })}
    </div>
  )
}

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting || success) return
    setSubmitting(true)
    setError(null)

    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert({ name, email, message })

    setSubmitting(false)

    if (insertError) {
      setError('Something went wrong. Please try again.')
      return
    }
    setSuccess(true)
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 text-center sm:py-32">
        <BackgroundEffects />
        <div className="relative z-10 mx-auto max-w-2xl px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={animTransition}
            className="section-label mb-3"
          >
            Get In Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 0.05 }}
            className="mb-4 text-3xl font-extrabold tracking-tight sm:text-5xl"
          >
            Let's <span className="text-gradient">Connect</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animTransition, delay: 0.1 }}
            className="text-base leading-[1.75] text-muted-foreground"
          >
            Have a project in mind or just want to say hi? I'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Split: contact info + form */}
      <section className="border-t border-border/40 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
            {/* Left: contact info */}
            <AnimatedSection stagger>
              <motion.div variants={animVariants.fadeUp} transition={animTransition} className="mb-6">
                <p className="section-label mb-2">Reach Me</p>
                <h2 className="text-2xl font-bold tracking-tight">Contact <span className="text-gradient">Info</span></h2>
              </motion.div>
              <motion.div
                variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
                className="flex flex-col gap-3"
              >
                {contactInfo.map(({ Icon, label, value, href }) => {
                  const content = (
                    <motion.div
                      variants={animVariants.fadeUp}
                      transition={animTransition}
                      whileHover={{ y: -3, transition: { duration: 0.15 } }}
                      className="glass-card flex items-center gap-3 px-4 py-3.5"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo/10 text-indigo">
                        <Icon className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">{label}</span>
                        <span className="text-sm text-foreground/90">{value}</span>
                      </div>
                    </motion.div>
                  )
                  return href ? (
                    <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                      {content}
                    </a>
                  ) : (
                    <div key={label}>{content}</div>
                  )
                })}
              </motion.div>
            </AnimatedSection>

            {/* Right: form */}
            <AnimatedSection animation="slideLeft">
              <div className="relative">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative"
                    >
                      <Confetti />
                      <SuccessOverlay message="Thanks for reaching out — I'll get back to you soon." />
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      ref={formRef}
                      onSubmit={handleSubmit}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="glass-card space-y-4 p-6 sm:p-8"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FloatingLabelInput
                          id="name"
                          label="Your Name"
                          value={name}
                          onChange={setName}
                          required
                          icon={<User className="size-4" />}
                        />
                        <FloatingLabelInput
                          id="email"
                          label="Your Email"
                          type="email"
                          value={email}
                          onChange={setEmail}
                          required
                          icon={<Mail className="size-4" />}
                        />
                      </div>
                      <FloatingLabelInput
                        id="subject"
                        label="Subject"
                        value={subject}
                        onChange={setSubject}
                        icon={<Tag className="size-4" />}
                      />
                      <FloatingLabelInput
                        id="message"
                        label="Your Message"
                        value={message}
                        onChange={setMessage}
                        required
                        textarea
                        rows={5}
                        icon={<MessageSquare className="size-4" />}
                      />

                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive"
                        >
                          {error}
                        </motion.p>
                      )}

                      <MagneticButton className="block w-full">
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="btn-primary group w-full"
                        >
                          {submitting ? (
                            <>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="mr-2 inline-block size-4 rounded-full border-2 border-white/30 border-t-white"
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <Send className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                            </>
                          )}
                        </Button>
                      </MagneticButton>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
