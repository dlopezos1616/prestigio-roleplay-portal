'use client'

import { useState, useEffect, useRef } from 'react'
import { Music, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('prestigio-music')
        if (saved) return JSON.parse(saved).muted || false
      } catch { /* ignore */ }
    }
    return false
  })
  const [volume, setVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('prestigio-music')
        if (saved) return JSON.parse(saved).volume || 0.08
      } catch { /* ignore */ }
    }
    return 0.08
  })
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Save state to localStorage
    localStorage.setItem(
      'prestigio-music',
      JSON.stringify({ volume, muted: isMuted })
    )
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!hasInteracted) {
      setHasInteracted(true)
    }

    if (!audioRef.current) {
      // Create audio element with an ambient sound
      // We use a royalty-free ambient track URL
      const audio = new Audio(
        'https://cdn.pixabay.com/audio/2022/02/22/audio_d1718ab41b.mp3'
      )
      audio.loop = true
      audio.volume = isMuted ? 0 : volume
      audioRef.current = audio
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, user needs to interact
      })
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0
    }
    setIsMuted(!isMuted)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <div className="flex items-center gap-2">
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-[#0f172a]/80 border border-[#7c3aed]/30 text-gray-400 hover:text-[#7c3aed] transition-colors backdrop-blur-sm"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#0f172a]/80 border border-[#7c3aed]/30 backdrop-blur-sm">
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={
                      isPlaying && !isMuted
                        ? {
                            height: [4, 12, 8, 16, 4],
                          }
                        : { height: 4 }
                    }
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                    className="w-1 bg-[#7c3aed] rounded-full"
                    style={{ minHeight: 4 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={togglePlay}
          className={`p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
            isPlaying
              ? 'bg-[#7c3aed] text-white neon-glow'
              : 'bg-[#0f172a]/80 border border-[#7c3aed]/30 text-gray-400 hover:text-[#7c3aed] hover:border-[#7c3aed]/60'
          }`}
          title={isPlaying ? 'Pausar música' : 'Activar música'}
        >
          <Music className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}
