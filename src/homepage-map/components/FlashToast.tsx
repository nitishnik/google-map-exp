import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface FlashToastProps {
  message: string | null
  onDone: () => void
}

export function FlashToast({ message, onDone }: FlashToastProps) {
  useEffect(() => {
    if (!message) return
    const t = window.setTimeout(onDone, 2200)
    return () => window.clearTimeout(t)
  }, [message, onDone])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="pointer-events-none absolute inset-x-4 bottom-10 z-30 mx-auto max-w-sm rounded-xl bg-[var(--hm-navy)]/92 px-3 py-2 text-center font-[var(--hm-sans)] text-xs text-white shadow-lg backdrop-blur"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
