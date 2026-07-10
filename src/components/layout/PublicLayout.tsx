import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/effects/CustomCursor'

export function PublicLayout() {
  const location = useLocation()

  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <CustomCursor />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
