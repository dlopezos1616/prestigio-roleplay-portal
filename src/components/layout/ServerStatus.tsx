'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, Users, Clock, Zap } from 'lucide-react'

interface ServerStatus {
  online: boolean
  players: number
  maxPlayers: number
  uptime: string
}

export default function ServerStatus() {
  const [status, setStatus] = useState<ServerStatus>({
    online: true,
    players: 127,
    maxPlayers: 256,
    uptime: '99.8%',
  })

  // Simulate player count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        players: Math.max(80, Math.min(200, prev.players + Math.floor(Math.random() * 11) - 5)),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const playerPercent = (status.players / status.maxPlayers) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative rounded-xl bg-[#0f172a] neon-border p-5 sm:p-6 overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c3aed]/5 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${status.online ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              {status.online ? (
                <Wifi className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Servidor FiveM</h4>
              <p className={`text-xs font-medium ${status.online ? 'text-green-400' : 'text-red-400'}`}>
                {status.online ? '● Online' : '● Offline'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[#7c3aed] font-bold text-2xl">{status.players}</span>
            <span className="text-[#94a3b8] text-sm">/{status.maxPlayers}</span>
          </div>
        </div>

        {/* Player bar */}
        <div className="mb-3">
          <div className="h-2 rounded-full bg-[#1e293b] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: playerPercent > 80 
                  ? 'linear-gradient(90deg, #ef4444, #f59e0b)' 
                  : 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                boxShadow: playerPercent > 80 
                  ? '0 0 10px rgba(239,68,68,0.5)' 
                  : '0 0 10px rgba(124,58,237,0.5)',
              }}
              initial={{ width: 0 }}
              whileInView={{ width: `${playerPercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
            <Users className="w-3.5 h-3.5 text-[#7c3aed]" />
            <span>{status.players} jugadores</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
            <Zap className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span>{status.uptime} uptime</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
            <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>24/7</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
