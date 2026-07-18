import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * FloatingLabelInput — input with a label that floats above the field
 * when focused or filled. Works with any input/textarea via children.
 */
export function FloatingLabelInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required,
  textarea,
  rows = 4,
  icon,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  textarea?: boolean
  rows?: number
  icon?: ReactNode
}) {
  const [focused, setFocused] = useState(false)
  const floated = focused || value.length > 0

  const sharedClass = cn(
    'w-full rounded-lg border bg-background/50 px-4 pb-2 pt-5 text-sm text-foreground transition-all duration-200',
    'placeholder:text-transparent focus:outline-none',
    focused
      ? 'border-gold/50 shadow-[0_0_0_3px_oklch(0.75_0.12_85_/_0.1)]'
      : 'border-border/40 hover:border-border/60',
  )

  return (
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute left-3 top-4 text-muted-foreground/60">
          {icon}
        </div>
      )}
      {textarea ? (
        <textarea
          id={id}
          rows={rows}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(sharedClass, icon && 'pl-10', 'resize-none')}
          placeholder={label}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(sharedClass, icon && 'pl-10')}
          placeholder={label}
        />
      )}
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute left-4 origin-left transition-all duration-200',
          icon && 'left-10',
          floated
            ? 'top-1.5 text-[10px] font-medium text-gold'
            : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground',
        )}
      >
        {label}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </label>
    </div>
  )
}

/**
 * SuccessOverlay — animated checkmark + message shown after form submit.
 */
export function SuccessOverlay({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gold/20 bg-surface/80 p-10 text-center backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 12 }}
        className="flex size-16 items-center justify-center rounded-full bg-gold/10 text-gold"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-8">
          <motion.path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>
      <div>
        <p className="font-semibold text-foreground">Message sent</p>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
    </motion.div>
  )
}

export { AnimatePresence }
