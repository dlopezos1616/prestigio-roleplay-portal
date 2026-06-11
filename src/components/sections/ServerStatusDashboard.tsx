'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wifi, Users, Clock, Cpu, HardDrive, Activity, 
  Globe, Shield, Zap, Server, TrendingUp, ArrowUpRight,
  Radio
} from 'lucide-react'
import ScrollReveal from '@/components/layout/ScrollReveal'

interface ServerMetric {
  label: string
  value: string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  color: string
  icon: React.ElementType
}

const serverMetrics: ServerMetric[] = [
  { label: 'Jugadores', value: '64', unit: '/128', trend: 'up', color: '#7c3aed', icon: Users },
  { label: 'Uptime', value: '99.8', unit: '%', trend: 'stable', color: '#22c55e', icon: Activity },
  { label: 'Ping', value: '32', unit: 'ms', trend: 'down', color: '#06b6d4', icon: Wifi },
  { label: 'CPU', value: '45', unit: '%', trend: 'stable', color: '#f59e0b', icon: Cpu },
  { label: 'RAM', value: '6.2', unit: 'GB', trend: 'up', color: '#ef4444', icon: HardDrive },
  { label: 'TPS', value: '60', unit: 'ticks', trend: 'stable', color: '#22c55e', icon: Zap },
]

const serverInfo = [
  { label: 'IP', value: 'cfx.re/join/4kp2z9', icon: Globe, color: '#7c3aed' },
  { label: 'Tipo', value: 'Roleplay Serio', icon: Shield, color: '#06b6d4' },
  { label: 'Versión', value: 'v3.2.1', icon: Server, color: '#f59e0b' },
  { label: 'Región', value: 'Europa', icon: Radio, color: '#22c55e' },
]

function RadarWidget() {
  return (
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-[#7c3aed]/20" />
      {/* Middle ring */}
      <div className="absolute inset-3 rounded-full border border-[#7c3aed]/15" />
      {/* Inner ring */}
      <div className="absolute inset-6 rounded-full border border-[#7c3aed]/10" />
      {/* Center dot */}
      <div className="absolute inset-[45%] rounded-full bg-[#7c3aed]/30 animate-breathe" style={{ boxShadow: '0 0 20px rgba(124,58,237,0.5)' }} />
      
      {/* Radar sweep line */}
      <div className="absolute inset-0 animate-radar-sweep">
        <div 
          className="absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left"
          style={{ 
            background: 'linear-gradient(90deg, rgba(124,58,237,0.8), transparent)',
            boxShadow: '0 0 10px rgba(124,58,237,0.5)'
          }}
        />
      </div>
      
      {/* Blip dots */}
      <div className="absolute w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" style={{ top: '25%', left: '60%', boxShadow: '0 0 6px rgba(6,182,212,0.8)' }} />
      <div className="absolute w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" style={{ top: '60%', left: '30%', boxShadow: '0 0 6px rgba(245,158,11,0.8)', animationDelay: '0.5s' }} />
      <div className="absolute w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" style={{ top: '40%', left: '70%', boxShadow: '0 0 6px rgba(34,197,94,0.8)', animationDelay: '1s' }} />
    </div>
  )
}

export default function ServerStatusDashboard() {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})

  // Simulate live metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValues(prev => ({
        ...prev,
        players: 60 + Math.floor(Math.random() * 10),
        ping: 28 + Math.floor(Math.random() * 12),
        cpu: 40 + Math.floor(Math.random() * 15),
        tps: 58 + Math.floor(Math.random() * 4),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 hex-pattern opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(124,58,237,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(6,182,212,0.06)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="text-[#06b6d4] neon-text-glow-cyan">Estado</span> del Servidor
            </motion.h2>
            <p className="text-[#94a3b8] text-lg flex items-center justify-center gap-2">
              <Activity className="w-5 h-5 text-[#22c55e] animate-live-pulse" style={{ color: '#22c55e' }} />
              Monitoreo en tiempo real
            </p>
            <div className="mt-4 h-0.5 mx-auto max-w-[120px] rounded-full bg-gradient-to-r from-transparent via-[#06b6d4] to-transparent" style={{ boxShadow: '0 0 10px rgba(6,182,212,0.5)' }} />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Radar + Status */}
          <ScrollReveal direction="left" delay={0.2}>
            <div className="neon-card-animated rounded-2xl p-6 flex flex-col items-center gap-6">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 text-sm font-medium text-[#22c55e]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                SERVIDOR EN LÍNEA
              </div>

              {/* Radar animation */}
              <RadarWidget />

              {/* Quick server info */}
              <div className="w-full space-y-3">
                {serverInfo.map((info) => {
                  const Icon = info.icon
                  return (
                    <div key={info.label} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                      <Icon className="w-4 h-4 shrink-0" style={{ color: info.color }} />
                      <span className="text-xs text-gray-500 w-16 shrink-0">{info.label}</span>
                      <span className="text-sm text-white font-medium truncate">{info.value}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Metrics Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {serverMetrics.map((metric, index) => {
              const Icon = metric.icon
              const liveValue = metric.label === 'Jugadores' ? (animatedValues.players ?? parseInt(metric.value))
                : metric.label === 'Ping' ? (animatedValues.ping ?? parseInt(metric.value))
                : metric.label === 'CPU' ? (animatedValues.cpu ?? parseInt(metric.value))
                : metric.label === 'TPS' ? (animatedValues.tps ?? parseInt(metric.value))
                : parseFloat(metric.value)

              return (
                <ScrollReveal key={metric.label} direction="scale" delay={0.1 * index}>
                  <div className="neon-card-animated rounded-xl p-4 sm:p-5 h-full flex flex-col group cursor-default transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      boxShadow: `0 0 0 1px ${metric.color}15`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 15px ${metric.color}20, 0 0 40px ${metric.color}10, 0 0 0 1px ${metric.color}30`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 1px ${metric.color}15`
                    }}
                  >
                    {/* Icon + Label */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${metric.color}12`, border: `1px solid ${metric.color}25` }}>
                        <Icon className="w-4 h-4" style={{ color: metric.color }} />
                      </div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">{metric.label}</span>
                    </div>

                    {/* Value */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-bold text-white" style={{ textShadow: `0 0 10px ${metric.color}30` }}>
                        {typeof liveValue === 'number' ? (Number.isInteger(liveValue) ? liveValue : liveValue.toFixed(1)) : liveValue}
                      </span>
                      {metric.unit && (
                        <span className="text-sm text-gray-500">{metric.unit}</span>
                      )}
                    </div>

                    {/* Trend indicator */}
                    {metric.trend && (
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className={`w-3 h-3 ${metric.trend === 'up' ? 'text-[#22c55e]' : metric.trend === 'down' ? 'text-[#ef4444]' : 'text-[#64748b]'} ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                        <span className={`text-[10px] uppercase tracking-wider ${metric.trend === 'up' ? 'text-[#22c55e]' : metric.trend === 'down' ? 'text-[#ef4444]' : 'text-[#64748b]'}`}>
                          {metric.trend === 'stable' ? 'Estable' : metric.trend === 'up' ? 'Subiendo' : 'Bajando'}
                        </span>
                      </div>
                    )}

                    {/* Mini progress bar */}
                    <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(typeof liveValue === 'number' ? (liveValue / (metric.label === 'Jugadores' ? 128 : metric.label === 'Uptime' ? 100 : 100)) * 100 : 50, 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${metric.color}, ${metric.color}80)`,
                          boxShadow: `0 0 8px ${metric.color}40`,
                        }}
                      />
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
