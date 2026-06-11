'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Shield,
  X,
  Heart,
  Drama,
  Eye,
  AlertTriangle,
  Zap,
  Bug,
  ChevronDown,
  BookOpen,
} from 'lucide-react'
import { useNavigation } from '@/lib/navigation'

/* ------------------------------------------------------------------ */
/*  Custom event name for opening the modal from outside               */
/* ------------------------------------------------------------------ */

export const OPEN_SERVER_RULES_EVENT = 'open-server-rules'

/** Dispatch this to programmatically open the server rules modal */
export function openServerRules() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_SERVER_RULES_EVENT))
  }
}

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface RuleCategory {
  id: string
  title: string
  color: string
  icon: React.ReactNode
  rules: string[]
}

const ruleCategories: RuleCategory[] = [
  {
    id: 'respeto',
    title: 'Respeto',
    color: '#7c3aed',
    icon: <Heart className="w-4 h-4" />,
    rules: [
      'Respeta a todos los jugadores y staff',
      'No se permite discriminación ni acoso',
      'Mantén un ambiente positivo',
    ],
  },
  {
    id: 'roleplay',
    title: 'Roleplay',
    color: '#06b6d4',
    icon: <Drama className="w-4 h-4" />,
    rules: [
      'Mantén el rol en todo momento',
      'No rompas personaje sin razón (OOC)',
      'Usa /ooc solo para comunicación fuera de rol',
    ],
  },
  {
    id: 'metagaming',
    title: 'Metagaming',
    color: '#f59e0b',
    icon: <Eye className="w-4 h-4" />,
    rules: [
      'No uses información OOC en rol',
      'No compartas ubicaciones por Discord',
      'La información debe obtenerse IC',
    ],
  },
  {
    id: 'vdm-rdm',
    title: 'VDM/RDM',
    color: '#ef4444',
    icon: <AlertTriangle className="w-4 h-4" />,
    rules: [
      'No ataques sin motivo (RDM)',
      'No atropelles sin rol (VDM)',
      'Las acciones violentas requieren contexto RP',
    ],
  },
  {
    id: 'powergaming',
    title: 'Powergaming',
    color: '#22c55e',
    icon: <Zap className="w-4 h-4" />,
    rules: [
      'No fuerces acciones sobre otros',
      'Usa /me y /do correctamente',
      'Permite reacciones de otros jugadores',
    ],
  },
  {
    id: 'exploits',
    title: 'Exploits',
    color: '#f97316',
    icon: <Bug className="w-4 h-4" />,
    rules: [
      'No abuses de bugs o glitches',
      'Reporta exploits al staff',
      'Uso de mods = ban permanente',
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Accordion Item Component                                           */
/* ------------------------------------------------------------------ */

function RuleAccordionItem({
  category,
  isOpen,
  onToggle,
}: {
  category: RuleCategory
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden transition-colors hover:border-white/10">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
        aria-expanded={isOpen}
      >
        {/* Icon with colored background */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${category.color}15`, color: category.color }}
        >
          {category.icon}
        </div>

        {/* Title */}
        <span className="flex-1 text-sm font-semibold text-gray-200">
          {category.title}
        </span>

        {/* Color accent dot */}
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: category.color, boxShadow: `0 0 6px ${category.color}60` }}
        />

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3.5 space-y-2">
              {category.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-sm text-gray-400"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ServerRulesModal() {
  const [open, setOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>('respeto')
  const { navigate } = useNavigation()

  // ---- Listen for custom open event ----
  useEffect(() => {
    const handleOpen = () => {
      setExpandedId('respeto')
      setOpen(true)
    }
    window.addEventListener(OPEN_SERVER_RULES_EVENT, handleOpen)
    return () => window.removeEventListener(OPEN_SERVER_RULES_EVENT, handleOpen)
  }, [])

  // ---- Close on ESC key ----
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // ---- Lock body scroll when open ----
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleToggleCategory = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  const handleViewFullRules = useCallback(() => {
    setOpen(false)
    navigate('normativa')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [navigate])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Drawer Panel */}
          <motion.div
            className="relative w-full sm:w-[420px] h-full bg-[#0f172a]/95 backdrop-blur-xl border-l border-[#7c3aed]/20 shadow-2xl shadow-[#7c3aed]/10 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#7c3aed]/15 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#7c3aed]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Normas del Servidor
                  </h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Resumen rápido de las normas principales
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Cerrar panel de normas"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5 custom-scrollbar">
              {ruleCategories.map((category) => (
                <RuleAccordionItem
                  key={category.id}
                  category={category}
                  isOpen={expandedId === category.id}
                  onToggle={() => handleToggleCategory(category.id)}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-5 py-4 border-t border-white/5">
              <button
                onClick={handleViewFullRules}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#7c3aed]/15 border border-[#7c3aed]/30 text-[#7c3aed] text-sm font-semibold hover:bg-[#7c3aed]/25 hover:border-[#7c3aed]/40 transition-all"
                style={{ boxShadow: '0 0 20px rgba(124, 58, 237, 0.1)' }}
              >
                <BookOpen className="w-4 h-4" />
                Ver normativa completa
              </button>
              <p className="text-center text-[10px] text-gray-600 mt-2">
                Prestigio RP &mdash; Normativa v2.0
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
