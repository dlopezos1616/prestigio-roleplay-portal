'use client'

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Download,
  Search,
  Wifi,
  Gamepad2,
  Copy,
  Check,
  AlertCircle,
  Monitor,
  RefreshCw,
  Server,
  Globe,
  Shield,
  ChevronRight,
} from 'lucide-react'

/* ── Step data ── */
const steps = [
  {
    step: 1,
    icon: Download,
    title: 'Instalar FiveM',
    description:
      'Descarga e instala FiveM desde fivem.net. Asegúrate de tener una copia legal de GTA V.',
    color: '#7c3aed',
    glowClass: 'neon-glow',
  },
  {
    step: 2,
    icon: Search,
    title: 'Buscar Servidor',
    description:
      "Abre FiveM, ve a la pestaña de servidores y busca 'Prestigio Roleplay' o usa la IP directa.",
    color: '#06b6d4',
    glowClass: 'neon-glow-cyan',
  },
  {
    step: 3,
    icon: Wifi,
    title: 'Conectar IP',
    description:
      "IP: play.prestigiorp.com | Puerto: 30120. También puedes usar 'connect cfx.re/join/abc123' en la consola F8.",
    color: '#f59e0b',
    glowClass: 'neon-glow-amber',
  },
  {
    step: 4,
    icon: Gamepad2,
    title: 'Disfrutar',
    description:
      '¡Ya estás dentro! Lee las normas, crea tu personaje y comienza tu aventura en Los Santos.',
    color: '#22c55e',
    glowClass: 'neon-glow',
  },
]

/* ── Connection info data ── */
const connectionInfo = [
  { label: 'IP', value: 'play.prestigiorp.com', icon: Globe },
  { label: 'Puerto', value: '30120', icon: Server },
  { label: 'Tipo', value: 'FiveM', icon: Monitor },
  { label: 'Requiere', value: 'GTA V', icon: Shield },
]

/* ── Troubleshooting data ── */
const troubleshootingItems = [
  {
    icon: RefreshCw,
    title: 'Limpiar caché de FiveM',
    description: 'Borra la carpeta de caché en %LocalAppData%\\FiveM\\FiveM.app\\data\\cache',
  },
  {
    icon: Shield,
    title: 'Verificar GTA V',
    description: 'Asegúrate de que tu copia de GTA V esté actualizada y verificada en Steam/Epic.',
  },
  {
    icon: Monitor,
    title: 'Desactivar mods',
    description: 'Elimina cualquier mod de GTA V que pueda causar conflictos con FiveM.',
  },
]

/* ── Step Card ── */
function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[number]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const Icon = step.icon

  return (
    <motion.div
      ref={ref}
      className="group relative rounded-xl bg-[#0f172a] p-6 sm:p-8 neon-border card-lift overflow-hidden"
      style={{ borderColor: `${step.color}40` }}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      {/* Gradient background overlay on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${step.color}08 0%, transparent 60%)`,
        }}
      />

      {/* Step number badge */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold text-white"
          style={{
            backgroundColor: `${step.color}20`,
            border: `2px solid ${step.color}60`,
            boxShadow: `0 0 12px ${step.color}30`,
          }}
        >
          {step.step}
        </div>
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${step.color}40, transparent)`,
          }}
        />
      </div>

      {/* Icon */}
      <div
        className={`inline-flex items-center justify-center w-14 h-14 rounded-lg mb-5 ${step.glowClass} transition-all duration-300 group-hover:scale-110 group-hover:rotate-[5deg]`}
        style={{ backgroundColor: `${step.color}15` }}
      >
        <Icon className="w-7 h-7 transition-colors duration-300" style={{ color: step.color }} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>

      {/* Description */}
      <p className="text-[#94a3b8] text-sm leading-relaxed">{step.description}</p>

      {/* Hover glow accent */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px ${step.color}10, 0 0 20px ${step.color}08`,
        }}
      />

      {/* Connector arrow (hidden on last card and mobile) */}
      {index < steps.length - 1 && (
        <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center">
          <ChevronRight
            className="w-6 h-6"
            style={{ color: `${step.color}80` }}
          />
        </div>
      )}
    </motion.div>
  )
}

/* ── Copy IP Button ── */
function CopyIPButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('play.prestigiorp.com:30120')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = 'play.prestigiorp.com:30120'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.button
      onClick={handleCopy}
      className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 overflow-hidden"
      style={{
        backgroundColor: copied ? '#22c55e20' : '#06b6d420',
        border: `1px solid ${copied ? '#22c55e60' : '#06b6d460'}`,
        color: copied ? '#22c55e' : '#06b6d4',
        boxShadow: copied
          ? '0 0 15px rgba(34, 197, 94, 0.2)'
          : '0 0 15px rgba(6, 182, 212, 0.2)',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>¡IP Copiada!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
          <span>Copiar IP</span>
        </>
      )}
    </motion.button>
  )
}

/* ── Main Section ── */
export default function HowToConnect() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 hex-pattern opacity-50" />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-[#06b6d4]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#7c3aed]/5 rounded-full blur-[120px]" />

      <div ref={sectionRef} className="relative z-10 max-w-6xl mx-auto">
        {/* Section title */}
        <motion.div
          className="text-center mb-14 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Cómo <span className="text-[#06b6d4] neon-text-glow-cyan">Conectar</span>
          </h2>
          <p className="text-[#94a3b8] text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Conecta al servidor en simples pasos y comienza tu aventura
          </p>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        </motion.div>

        {/* Step cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <StepCard key={step.step} step={step} index={index} />
          ))}
        </div>

        {/* Connection Info Card + Copy IP */}
        <motion.div
          className="rounded-xl bg-[#0f172a] p-6 sm:p-8 neon-border-cyan mb-12"
          style={{ borderColor: 'rgba(6, 182, 212, 0.4)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Connection details */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-[#06b6d4]" />
                Información de Conexión
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {connectionInfo.map((info) => {
                  const InfoIcon = info.icon
                  return (
                    <div key={info.label} className="text-center sm:text-left">
                      <p className="text-[#64748b] text-xs uppercase tracking-wider mb-1">
                        {info.label}
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-1.5">
                        <InfoIcon className="w-3.5 h-3.5 text-[#06b6d4]" />
                        <span className="text-white text-sm font-semibold">{info.value}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Copy IP Button */}
            <div className="flex-shrink-0">
              <CopyIPButton />
            </div>
          </div>

          {/* F8 console command hint */}
          <motion.div
            className="mt-5 pt-5 border-t border-[#06b6d4]/10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-[#64748b] text-xs flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5 text-[#06b6d4]" />
              <span>
                Comando alternativo:{' '}
                <code className="text-[#06b6d4] bg-[#06b6d4]/10 px-2 py-0.5 rounded text-xs font-mono">
                  connect cfx.re/join/abc123
                </code>{' '}
                en la consola F8
              </span>
            </p>
          </motion.div>
        </motion.div>

        {/* Troubleshooting section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#f59e0b]" />
            ¿Problemas para conectar?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {troubleshootingItems.map((item, index) => {
              const ItemIcon = item.icon
              return (
                <motion.div
                  key={item.title}
                  className="group rounded-lg bg-[#0f172a] p-5 border border-[#f59e0b]/20 hover:border-[#f59e0b]/40 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg"
                      style={{ backgroundColor: '#f59e0b15' }}
                    >
                      <ItemIcon className="w-4.5 h-4.5 text-[#f59e0b]" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  </div>
                  <p className="text-[#94a3b8] text-xs leading-relaxed">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
