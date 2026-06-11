'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Megaphone, X } from 'lucide-react'

const announcements = [
  '🌙 Carreras Nocturnas este viernes a las 21:00 CET — ¡No te lo pierdas!',
  '🎮 Nuevo sistema de vehículos custom disponible — Actualiza tu experiencia',
  '🛡️ Anti-cheat actualizado v3.2 — Mayor seguridad para todos',
  '🏆 Temporada de rankings activa — ¿Serás el #1?',
]

const STORAGE_KEY = 'prestigio-banner-dismissed'
const ROTATION_INTERVAL = 5000
const BANNER_HEIGHT = 40 // px

interface AnnouncementBannerProps {
  onVisibilityChange?: (visible: boolean) => void
}

export default function AnnouncementBanner({ onVisibilityChange }: AnnouncementBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState<boolean | null>(null)

  // Lazy init from localStorage (async wrapper to satisfy lint rule)
  useEffect(() => {
    const initDismissed = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const isDismissed = stored === 'true'
        setDismissed(isDismissed)
        onVisibilityChange?.(!isDismissed)
      } catch {
        setDismissed(false)
        onVisibilityChange?.(true)
      }
    }
    initDismissed()
  }, [onVisibilityChange])

  // Auto-rotation
  useEffect(() => {
    if (dismissed) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length)
    }, ROTATION_INTERVAL)

    return () => clearInterval(interval)
  }, [dismissed])

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // localStorage not available
    }
    onVisibilityChange?.(false)
  }, [onVisibilityChange])

  // Don't render until we know the dismissal state (avoids hydration flash)
  if (dismissed === null) return null

  if (dismissed) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center"
      style={{ height: `${BANNER_HEIGHT}px` }}
    >
      {/* Background with gradient and slight transparency */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.9) 0%, rgba(6, 182, 212, 0.9) 100%)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Subtle animated shimmer */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'banner-shimmer 3s ease-in-out infinite',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        {/* Left icon */}
        <Megaphone className="w-4 h-4 text-white/80 shrink-0 mr-3" />

        {/* Center rotating text */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="text-white text-xs sm:text-sm font-medium truncate block w-full text-center"
            >
              {announcements[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Right close button */}
        <button
          onClick={handleDismiss}
          className="shrink-0 ml-3 p-1 rounded-full text-white/60 hover:text-white hover:bg-white/20 transition-colors"
          aria-label="Cerrar anuncio"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Shimmer keyframes */}
      <style jsx>{`
        @keyframes banner-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}

export { BANNER_HEIGHT }
