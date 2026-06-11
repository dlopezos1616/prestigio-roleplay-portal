'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Clock, Wifi, Tag, Mic, RefreshCw, Activity } from 'lucide-react'

interface ServerData {
  players: number
  maxPlayers: number
  uptime: number
  ping: number
  lastRestart: string
  version: string
  voiceChannels: number
  online: boolean
  history: number[]
}

function generateHistory(): number[] {
  const points: number[] = []
  let current = 40 + Math.floor(Math.random() * 30)
  for (let i = 0; i < 24; i++) {
    current = Math.max(15, Math.min(128, current + Math.floor(Math.random() * 21) - 10))
    points.push(current)
  }
  return points
}

function generateData(): ServerData {
  const players = 40 + Math.floor(Math.random() * 88)
  return {
    players,
    maxPlayers: 128,
    uptime: 99 + Math.random() * 0.9,
    ping: 15 + Math.floor(Math.random() * 30),
    lastRestart: `Hace ${3 + Math.floor(Math.random() * 8)}h`,
    version: 'v3.2.1',
    voiceChannels: 8 + Math.floor(Math.random() * 10),
    online: true,
    history: generateHistory(),
  }
}

function CircularProgress({ value, size = 56, strokeWidth = 4 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(124, 58, 237, 0.15)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#uptimeGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="uptimeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{value.toFixed(1)}%</span>
      </div>
    </div>
  )
}

function SignalStrength({ ping }: { ping: number }) {
  const bars = ping < 20 ? 4 : ping < 40 ? 3 : ping < 60 ? 2 : 1
  return (
    <div className="flex items-end gap-0.5 h-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm transition-all duration-300"
          style={{
            height: `${i * 25}%`,
            backgroundColor: i <= bars ? '#22c55e' : 'rgba(148, 163, 184, 0.2)',
            boxShadow: i <= bars ? '0 0 6px rgba(34, 197, 94, 0.4)' : 'none',
          }}
        />
      ))}
    </div>
  )
}

function SparklineChart({ data }: { data: number[] }) {
  const maxVal = Math.max(...data)
  const minVal = Math.min(...data)
  const range = maxVal - minVal || 1
  const width = 400
  const height = 80
  const padding = 4

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((val - minVal) / range) * (height - padding * 2)
    return { x, y }
  })

  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x},${point.y}`
    const prev = points[i - 1]
    const cpx1 = prev.x + (point.x - prev.x) / 3
    const cpx2 = prev.x + (2 * (point.x - prev.x)) / 3
    return `${acc} C ${cpx1},${prev.y} ${cpx2},${point.y} ${point.x},${point.y}`
  }, '')

  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="sparkFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#sparkFill)" />
      <path
        d={pathD}
        fill="none"
        stroke="url(#sparkGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 4px rgba(124, 58, 237, 0.5))' }}
      />
      {/* Current point indicator */}
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="4"
          fill="#06b6d4"
          stroke="#0f172a"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.6))' }}
        />
      )}
    </svg>
  )
}

export default function ServerStatusWidget() {
  const [data, setData] = useState<ServerData>(generateData)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Simulate player count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newPlayers = Math.max(10, Math.min(prev.maxPlayers, prev.players + Math.floor(Math.random() * 9) - 4))
        const newHistory = [...prev.history.slice(1), newPlayers]
        return {
          ...prev,
          players: newPlayers,
          history: newHistory,
          ping: Math.max(10, Math.min(80, prev.ping + Math.floor(Math.random() * 7) - 3)),
        }
      })
      setLastUpdate(new Date())
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const refresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setData(generateData())
      setLastUpdate(new Date())
      setRefreshing(false)
    }, 800)
  }, [])

  const playerPercent = (data.players / data.maxPlayers) * 100

  const statCards = [
    {
      icon: Users,
      label: 'Jugadores Online',
      value: `${data.players}/${data.maxPlayers}`,
      color: '#7c3aed',
      extra: (
        <div className="mt-2 h-1.5 rounded-full bg-[#1e293b] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: playerPercent > 80
                ? 'linear-gradient(90deg, #ef4444, #f59e0b)'
                : 'linear-gradient(90deg, #7c3aed, #06b6d4)',
              boxShadow: playerPercent > 80
                ? '0 0 8px rgba(239,68,68,0.5)'
                : '0 0 8px rgba(124,58,237,0.5)',
            }}
            animate={{ width: `${playerPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      ),
    },
    {
      icon: Activity,
      label: 'Uptime',
      value: `${data.uptime.toFixed(1)}%`,
      color: '#06b6d4',
      extra: <CircularProgress value={data.uptime} size={44} strokeWidth={3} />,
    },
    {
      icon: Wifi,
      label: 'Ping',
      value: `${data.ping}ms`,
      color: '#22c55e',
      extra: <SignalStrength ping={data.ping} />,
    },
    {
      icon: Clock,
      label: 'Último Reinicio',
      value: data.lastRestart,
      color: '#f59e0b',
      extra: null,
    },
    {
      icon: Tag,
      label: 'Versión',
      value: data.version,
      color: '#7c3aed',
      extra: null,
    },
    {
      icon: Mic,
      label: 'Canales de Voz',
      value: `${data.voiceChannels} activos`,
      color: '#06b6d4',
      extra: null,
    },
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.06) 0%, transparent 60%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Card */}
          <div className="relative rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl neon-border overflow-hidden cyber-corner">
            {/* Top decorative line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, #7c3aed, transparent)',
                boxShadow: '0 0 15px rgba(124,58,237,0.5)',
              }}
            />

            {/* Corner accent glows */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-[#7c3aed]/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#06b6d4]/5 rounded-full blur-2xl" />

            <div className="relative p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  {/* Pulsing green dot */}
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500" style={{ boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Estado del <span className="text-[#06b6d4]" style={{ textShadow: '0 0 15px rgba(6,182,212,0.4)' }}>Servidor</span>
                  </h2>
                </div>

                {/* Refresh button */}
                <button
                  onClick={refresh}
                  disabled={refreshing}
                  className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e293b]/60 border border-[#7c3aed]/20 text-[#94a3b8] text-xs hover:text-white hover:border-[#7c3aed]/50 transition-all duration-300"
                  aria-label="Actualizar datos del servidor"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 transition-transform duration-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}
                  />
                  <span className="hidden sm:inline">
                    {lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
                {statCards.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group relative rounded-xl bg-[#030712]/60 border border-[rgba(124,58,237,0.15)] p-4 hover:border-[rgba(124,58,237,0.35)] transition-all duration-300 overflow-hidden"
                    >
                      {/* Hover glow */}
                      <div
                        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ boxShadow: `inset 0 0 20px ${stat.color}08, 0 0 15px ${stat.color}06` }}
                      />

                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="p-1.5 rounded-md"
                            style={{
                              backgroundColor: `${stat.color}12`,
                              border: `1px solid ${stat.color}25`,
                            }}
                          >
                            <Icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                          </div>
                          <span className="text-[10px] sm:text-xs text-[#94a3b8] uppercase tracking-wider font-medium">
                            {stat.label}
                          </span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-white" style={{ textShadow: `0 0 10px ${stat.color}30` }}>
                          {stat.value}
                        </p>
                        {stat.extra && <div className="mt-1">{stat.extra}</div>}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Live Player Graph */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="rounded-xl bg-[#030712]/60 border border-[rgba(124,58,237,0.15)] p-4 sm:p-5 overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#06b6d4]" />
                      <span className="text-xs sm:text-sm text-[#94a3b8] font-medium">
                        Jugadores — Últimas 24h
                      </span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={data.players}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm font-bold text-[#06b6d4]"
                      >
                        {data.players} ahora
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="h-20 sm:h-24">
                    <SparklineChart data={data.history} />
                  </div>
                  {/* Time labels */}
                  <div className="flex justify-between mt-2 px-1">
                    <span className="text-[10px] text-[#94a3b8]/50">-24h</span>
                    <span className="text-[10px] text-[#94a3b8]/50">-18h</span>
                    <span className="text-[10px] text-[#94a3b8]/50">-12h</span>
                    <span className="text-[10px] text-[#94a3b8]/50">-6h</span>
                    <span className="text-[10px] text-[#94a3b8]/50">Ahora</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
