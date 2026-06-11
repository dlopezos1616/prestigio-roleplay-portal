'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  CheckCheck,
  Shield,
  Zap,
  AtSign,
  Settings,
  Megaphone,
  Clock,
  Inbox,
  ExternalLink,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useNavigation, type PageId } from '@/lib/navigation'

// ─── Types ───────────────────────────────────────────────────────

interface Notification {
  id: string
  type: 'whitelist' | 'system' | 'event' | 'mention'
  title: string
  description: string
  timestamp: Date
  read: boolean
  icon: string
}

type FilterTab = 'all' | 'unread'

// ─── Mock Data ───────────────────────────────────────────────────

const now = new Date()

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'whitelist',
    title: 'Whitelist Aprobada',
    description:
      'Tu solicitud de whitelist ha sido aprobada. ¡Bienvenido a Prestigio RP!',
    timestamp: new Date(now.getTime() - 5 * 60 * 1000),
    read: false,
    icon: 'Shield',
  },
  {
    id: '2',
    type: 'event',
    title: 'Evento: Carreras Nocturnas',
    description:
      'Las carreras nocturnas comienzan en 2 horas. ¡Prepara tu vehículo!',
    timestamp: new Date(now.getTime() - 60 * 60 * 1000),
    read: false,
    icon: 'Zap',
  },
  {
    id: '3',
    type: 'system',
    title: 'Servidor Reiniciado',
    description:
      'El servidor se ha reiniciado correctamente. Versión 3.2.1 activa.',
    timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    read: true,
    icon: 'Settings',
  },
  {
    id: '4',
    type: 'mention',
    title: 'Mención en Reporte',
    description:
      "StaffMember te mencionó en el reporte #142: 'Revisar esta situación...'",
    timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    read: true,
    icon: 'AtSign',
  },
  {
    id: '5',
    type: 'event',
    title: 'Torneo Semanal',
    description:
      'El torneo semanal de persecuciones comienza mañana a las 20:00 CET.',
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    read: true,
    icon: 'Megaphone',
  },
  {
    id: '6',
    type: 'system',
    title: 'Nueva Normativa',
    description:
      'Se ha actualizado la normativa sobre New Life Rule. Revisa los cambios.',
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    icon: 'Settings',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return 'hace un momento'
  if (diffMinutes < 60) return `hace ${diffMinutes} min`
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays === 1) return 'hace 1d'
  return `hace ${diffDays}d`
}

function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ElementType> = {
    Shield,
    Zap,
    AtSign,
    Settings,
    Megaphone,
    Bell,
    Clock,
  }
  return iconMap[iconName] || Bell
}

function getTypeColor(type: Notification['type']) {
  const colorMap: Record<Notification['type'], string> = {
    whitelist: 'text-emerald-400',
    system: 'text-amber-400',
    event: 'text-purple-400',
    mention: 'text-sky-400',
  }
  return colorMap[type]
}

function getTypeBg(type: Notification['type']) {
  const bgMap: Record<Notification['type'], string> = {
    whitelist: 'bg-emerald-400/10',
    system: 'bg-amber-400/10',
    event: 'bg-purple-400/10',
    mention: 'bg-sky-400/10',
  }
  return bgMap[type]
}

function getTypeBadgeColor(type: Notification['type']) {
  const badgeMap: Record<Notification['type'], string> = {
    whitelist: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    system: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    event: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    mention: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  }
  return badgeMap[type]
}

function getTypeLabel(type: Notification['type']) {
  const labelMap: Record<Notification['type'], string> = {
    whitelist: 'Whitelist',
    system: 'Sistema',
    event: 'Evento',
    mention: 'Mención',
  }
  return labelMap[type]
}

// ─── Component ───────────────────────────────────────────────────

interface NotificationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function NotificationPanel({
  open,
  onOpenChange,
}: NotificationPanelProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const { navigate } = useNavigation()

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications =
    activeFilter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleViewAll = () => {
    onOpenChange(false)
    navigate('staff' as PageId)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[380px] sm:w-[380px] bg-[#0a0e1a] border-l border-[#7c3aed]/20 p-0 flex flex-col overflow-hidden"
      >
        {/* Visually hidden title for accessibility */}
        <SheetTitle className="sr-only">Panel de Notificaciones</SheetTitle>

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex-shrink-0 px-5 pt-6 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#7c3aed]/10">
                <Bell className="w-5 h-5 text-[#7c3aed]" />
              </div>
              <h2 className="text-lg font-bold text-white">Notificaciones</h2>
              {unreadCount > 0 && (
                <span
                  className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#7c3aed] text-white"
                  style={{ boxShadow: '0 0 10px rgba(124, 58, 237, 0.5)' }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 text-xs text-[#7c3aed] hover:text-[#a78bfa] transition-colors font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar leídas
              </button>
            )}
          </div>

          {/* ── Filter Tabs ──────────────────────────────── */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
            {(['all', 'unread'] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`relative flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeFilter === tab
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {activeFilter === tab && (
                  <motion.div
                    layoutId="notif-filter-bg"
                    className="absolute inset-0 bg-[#7c3aed]/20 border border-[#7c3aed]/30 rounded-md"
                    style={{
                      boxShadow: '0 0 12px rgba(124, 58, 237, 0.15)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {tab === 'all' ? 'Todas' : 'No leídas'}
                  {tab === 'unread' && unreadCount > 0 && (
                    <span className="ml-1.5 text-[10px] text-[#7c3aed]">
                      ({unreadCount})
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Notification List ───────────────────────────── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-16 px-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <Inbox className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  No hay notificaciones
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  {activeFilter === 'unread'
                    ? 'No tienes notificaciones sin leer'
                    : 'Estás al día con todo'}
                </p>
              </motion.div>
            ) : (
              <div className="py-2">
                {filteredNotifications.map((notification, index) => {
                  const IconComponent = getIconComponent(notification.icon)
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{
                        delay: index * 0.04,
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                      onClick={() => {
                        if (!notification.read) handleMarkAsRead(notification.id)
                      }}
                      className={`group relative mx-3 my-1.5 p-3.5 rounded-xl cursor-pointer transition-all duration-200 ${
                        notification.read
                          ? 'bg-white/[0.02] hover:bg-white/[0.05]'
                          : 'bg-[#7c3aed]/[0.06] hover:bg-[#7c3aed]/[0.1] border border-[#7c3aed]/10'
                      }`}
                    >
                      {/* Unread dot */}
                      {!notification.read && (
                        <div
                          className="absolute top-4 right-3.5 w-2 h-2 rounded-full bg-blue-500"
                          style={{
                            boxShadow: '0 0 6px rgba(59, 130, 246, 0.6)',
                          }}
                        />
                      )}

                      <div className="flex gap-3">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${getTypeBg(notification.type)}`}
                        >
                          <IconComponent
                            className={`w-4 h-4 ${getTypeColor(notification.type)}`}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4
                              className={`text-sm font-semibold truncate ${
                                notification.read
                                  ? 'text-gray-400'
                                  : 'text-white'
                              }`}
                            >
                              {notification.title}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">
                            {notification.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded border ${getTypeBadgeColor(notification.type)}`}
                            >
                              {getTypeLabel(notification.type)}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-gray-600">
                              <Clock className="w-3 h-3" />
                              {formatRelativeTime(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-white/5">
          <button
            onClick={handleViewAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#7c3aed] hover:bg-[#7c3aed]/20 hover:border-[#7c3aed]/30 transition-all duration-200 text-sm font-medium"
            style={{
              boxShadow: '0 0 15px rgba(124, 58, 237, 0.1)',
            }}
          >
            Ver todas
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
