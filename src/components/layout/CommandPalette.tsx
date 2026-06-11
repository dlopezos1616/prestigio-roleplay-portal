'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search,
  Home,
  BookOpen,
  ImageIcon,
  Swords,
  Info,
  Heart,
  Shield,
  Crown,
  UserCircle,
  MessageSquare,
  Copy,
} from 'lucide-react'
import { useNavigation, type PageId } from '@/lib/navigation'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Custom event name for opening the palette from outside             */
/* ------------------------------------------------------------------ */

export const OPEN_COMMAND_PALETTE_EVENT = 'open-command-palette'

/** Dispatch this to programmatically open the command palette */
export function openCommandPalette() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE_EVENT))
  }
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CommandItem {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
  category: 'page' | 'action'
  keywords?: string[]
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DISCORD_LINK = 'https://discord.gg/prestigiorp'
const SERVER_IP = 'play.prestigiorp.es'

const commandItems: CommandItem[] = [
  // Pages
  {
    id: 'page-home',
    label: 'Inicio',
    description: 'Página principal del portal',
    icon: <Home className="w-4 h-4" />,
    action: () => {},
    category: 'page',
    keywords: ['home', 'principal', 'inicio'],
  },
  {
    id: 'page-normativa',
    label: 'Normativa',
    description: 'Reglas y normas del servidor',
    icon: <BookOpen className="w-4 h-4" />,
    action: () => {},
    category: 'page',
    keywords: ['rules', 'reglas', 'normas'],
  },
  {
    id: 'page-galeria',
    label: 'Galería',
    description: 'Capturas y momentos del servidor',
    icon: <ImageIcon className="w-4 h-4" />,
    action: () => {},
    category: 'page',
    keywords: ['gallery', 'fotos', 'photos', 'images'],
  },
  {
    id: 'page-facciones',
    label: 'Facciones',
    description: 'Organizaciones y bandas del servidor',
    icon: <Swords className="w-4 h-4" />,
    action: () => {},
    category: 'page',
    keywords: ['factions', 'bandas', 'organizaciones'],
  },
  {
    id: 'page-info',
    label: 'Info',
    description: 'Información técnica del servidor',
    icon: <Info className="w-4 h-4" />,
    action: () => {},
    category: 'page',
    keywords: ['information', 'información', 'servidor'],
  },
  {
    id: 'page-donaciones',
    label: 'Donaciones',
    description: 'Apoya el servidor con una donación',
    icon: <Heart className="w-4 h-4" />,
    action: () => {},
    category: 'page',
    keywords: ['donate', 'donar', 'tienda', 'shop'],
  },
  {
    id: 'page-whitelist',
    label: 'Whitelist',
    description: 'Solicita acceso al servidor',
    icon: <Shield className="w-4 h-4" />,
    action: () => {},
    category: 'page',
    shortcut: 'W',
    keywords: ['whitelist', 'solicitud', 'acceso'],
  },
  {
    id: 'page-staff',
    label: 'Staff',
    description: 'Panel de administración del staff',
    icon: <Shield className="w-4 h-4" />,
    action: () => {},
    category: 'page',
    keywords: ['moderator', 'moderador', 'admin'],
  },
  {
    id: 'page-admin',
    label: 'Admin',
    description: 'Panel de administración general',
    icon: <Crown className="w-4 h-4" />,
    action: () => {},
    category: 'page',
    keywords: ['administrator', 'administración'],
  },
  {
    id: 'page-profile',
    label: 'Perfil',
    description: 'Tu perfil y estado de whitelist',
    icon: <UserCircle className="w-4 h-4" />,
    action: () => {},
    category: 'page',
    shortcut: 'P',
    keywords: ['profile', 'usuario', 'cuenta', 'account'],
  },
  // Actions
  {
    id: 'action-discord',
    label: 'Unirse a Discord',
    description: 'Abre el enlace de invitación de Discord',
    icon: <MessageSquare className="w-4 h-4" />,
    action: () => {
      window.open(DISCORD_LINK, '_blank', 'noopener')
    },
    category: 'action',
    shortcut: 'D',
    keywords: ['discord', 'unirse', 'join', 'chat'],
  },
  {
    id: 'action-copy-ip',
    label: 'Copiar IP del servidor',
    description: `Copia ${SERVER_IP} al portapapeles`,
    icon: <Copy className="w-4 h-4" />,
    action: () => {
      navigator.clipboard.writeText(SERVER_IP).then(() => {
        toast.success('IP copiada al portapapeles', {
          description: SERVER_IP,
        })
      })
    },
    category: 'action',
    shortcut: 'C',
    keywords: ['copy', 'ip', 'copiar', 'connect', 'conectar'],
  },
]

/** Map command item IDs to PageId for navigation */
const idToPage: Record<string, PageId> = {
  'page-home': 'home',
  'page-normativa': 'normativa',
  'page-galeria': 'galeria',
  'page-facciones': 'facciones',
  'page-info': 'info',
  'page-donaciones': 'donaciones',
  'page-whitelist': 'whitelist',
  'page-staff': 'staff',
  'page-admin': 'admin',
  'page-profile': 'profile',
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const { navigate } = useNavigation()

  // ---- Filter items by query ----
  const filteredItems = commandItems.filter((item) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.keywords?.some((k) => k.includes(q)) ?? false)
    )
  })

  // ---- Keyboard shortcut to open (Cmd+K / Ctrl+K) ----
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => {
          if (!prev) {
            setQuery('')
            setSelectedIndex(0)
          }
          return !prev
        })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ---- Listen for custom open event (from Navbar button, etc.) ----
  useEffect(() => {
    const handleOpen = () => {
      setQuery('')
      setSelectedIndex(0)
      setOpen(true)
    }
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, handleOpen)
    return () => window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, handleOpen)
  }, [])

  // Focus input when opening
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [open])

  // ---- Select an item ----
  const selectItem = (item: CommandItem) => {
    const pageId = idToPage[item.id]
    if (pageId) {
      navigate(pageId)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    item.action()
    setOpen(false)
    setQuery('')
  }

  // ---- Keyboard navigation inside palette ----
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        setQuery('')
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        )
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        )
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        const item = filteredItems[selectedIndex]
        if (item) {
          selectItem(item)
        }
        return
      }
    },
    [filteredItems, selectedIndex, selectItem]
  )

  // ---- Scroll selected item into view ----
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector(
        `[data-command-index="${selectedIndex}"]`
      )
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  // ---- Group items by category ----
  const pageItems = filteredItems.filter((i) => i.category === 'page')
  const actionItems = filteredItems.filter((i) => i.category === 'action')

  /** Get the absolute index across grouped sections */
  const getAbsoluteIndex = (category: 'page' | 'action', localIdx: number) => {
    if (category === 'page') return localIdx
    return pageItems.length + localIdx
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setOpen(false)
              setQuery('')
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />

          {/* Dialog */}
          <motion.div
            className="relative w-full max-w-xl mx-4 overflow-hidden rounded-2xl border border-[#7c3aed]/30 bg-[#0f172a]/95 backdrop-blur-xl shadow-2xl shadow-[#7c3aed]/10"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 border-b border-white/5">
              <Search className="w-5 h-5 text-[#7c3aed] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar páginas, acciones..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                className="flex-1 bg-transparent py-4 text-sm text-white placeholder-gray-500 outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 bg-white/5 border border-white/10 rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-80 overflow-y-auto p-2 custom-scrollbar"
            >
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Search className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-sm">Sin resultados para &quot;{query}&quot;</p>
                </div>
              ) : (
                <>
                  {/* Pages section */}
                  {pageItems.length > 0 && (
                    <div className="mb-1">
                      <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        Páginas
                      </p>
                      {pageItems.map((item, localIdx) => {
                        const absIdx = getAbsoluteIndex('page', localIdx)
                        const isSelected = absIdx === selectedIndex
                        return (
                          <button
                            key={item.id}
                            data-command-index={absIdx}
                            onClick={() => selectItem(item)}
                            onMouseEnter={() => setSelectedIndex(absIdx)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-100 ${
                              isSelected
                                ? 'bg-[#7c3aed]/20 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <span
                              className={`shrink-0 ${
                                isSelected ? 'text-[#7c3aed]' : 'text-gray-500'
                              }`}
                            >
                              {item.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.label}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {item.description}
                              </p>
                            </div>
                            {item.shortcut && (
                              <kbd
                                className={`hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded border ${
                                  isSelected
                                    ? 'text-[#7c3aed] border-[#7c3aed]/30 bg-[#7c3aed]/10'
                                    : 'text-gray-600 border-white/10 bg-white/5'
                                }`}
                              >
                                {item.shortcut}
                              </kbd>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Actions section */}
                  {actionItems.length > 0 && (
                    <div>
                      <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        Acciones
                      </p>
                      {actionItems.map((item, localIdx) => {
                        const absIdx = getAbsoluteIndex('action', localIdx)
                        const isSelected = absIdx === selectedIndex
                        return (
                          <button
                            key={item.id}
                            data-command-index={absIdx}
                            onClick={() => selectItem(item)}
                            onMouseEnter={() => setSelectedIndex(absIdx)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-100 ${
                              isSelected
                                ? 'bg-[#7c3aed]/20 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <span
                              className={`shrink-0 ${
                                isSelected ? 'text-[#7c3aed]' : 'text-gray-500'
                              }`}
                            >
                              {item.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.label}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {item.description}
                              </p>
                            </div>
                            {item.shortcut && (
                              <kbd
                                className={`hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded border ${
                                  isSelected
                                    ? 'text-[#7c3aed] border-[#7c3aed]/30 bg-[#7c3aed]/10'
                                    : 'text-gray-600 border-white/10 bg-white/5'
                                }`}
                              >
                                {item.shortcut}
                              </kbd>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5 text-[10px] text-gray-600">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[9px]">↑</kbd>
                  <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[9px]">↓</kbd>
                  Navegar
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[9px]">↵</kbd>
                  Seleccionar
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[9px]">esc</kbd>
                  Cerrar
                </span>
              </div>
              <span className="text-gray-700">Prestigio RP</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/*  Navbar Search Button                                                */
/* ------------------------------------------------------------------ */

export function CommandPaletteTrigger() {
  return (
    <button
      onClick={openCommandPalette}
      className="hidden md:flex items-center gap-2 bg-[#0f172a] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:text-white hover:border-[#7c3aed]/30 transition-all"
      aria-label="Abrir búsqueda (⌘K)"
    >
      <Search className="w-3.5 h-3.5" />
      <span className="text-xs">Buscar...</span>
      <kbd className="flex items-center px-1.5 py-0.5 text-[10px] font-medium text-gray-600 bg-white/5 border border-white/10 rounded ml-2">
        ⌘K
      </kbd>
    </button>
  )
}
