'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  X,
  Info,
  User,
  Zap,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

/* ────────────────────────────────────────────
   Types & Constants
   ──────────────────────────────────────────── */

type EventCategory = 'operaciones' | 'eventos_sociales' | 'entrenamientos' | 'reuniones'

interface CalendarEvent {
  id: string
  title: string
  date: Date
  time: string
  category: EventCategory
  description: string
  organizer: string
  location: string
}

const CATEGORY_CONFIG: Record<EventCategory, { label: string; color: string; glowColor: string }> = {
  operaciones: { label: 'Operaciones', color: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.4)' },
  eventos_sociales: { label: 'Eventos Sociales', color: '#7c3aed', glowColor: 'rgba(124, 58, 237, 0.4)' },
  entrenamientos: { label: 'Entrenamientos', color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' },
  reuniones: { label: 'Reuniones', color: '#22c55e', glowColor: 'rgba(34, 197, 94, 0.4)' },
}

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

/* ────────────────────────────────────────────
   Mock Events Data
   ──────────────────────────────────────────── */

function generateMockEvents(): CalendarEvent[] {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  return [
    {
      id: '1',
      title: 'Operación Heist al Banco Central',
      date: new Date(y, m, Math.max(1, now.getDate() + 1)),
      time: '21:00',
      category: 'operaciones',
      description: 'Gran asalto coordinado al Banco Central de Los Santos. Se requiere equipo completo, plan de escape y comunicaciones cifradas. Solo agentes experimentados.',
      organizer: 'Comandante Wolf',
      location: 'Banco Central, Downtown LS',
    },
    {
      id: '2',
      title: 'Noche de Carreras Callejeras',
      date: new Date(y, m, Math.max(1, now.getDate() + 3)),
      time: '22:00',
      category: 'eventos_sociales',
      description: 'Carreras nocturnas ilegales por las calles de Los Santos. Premios en efectivo para los 3 primeros puestos. Vehículos tuning permitidos.',
      organizer: 'Racing Crew LS',
      location: 'Start Line: Boulevard Vinewood',
    },
    {
      id: '3',
      title: 'Entrenamiento Táctico LSPD',
      date: new Date(y, m, Math.max(1, now.getDate() + 5)),
      time: '19:00',
      category: 'entrenamientos',
      description: 'Sesión de entrenamiento táctico obligatoria para todos los oficiales de la LSPD. Prácticas de intervención, detención y uso de la fuerza.',
      organizer: 'Sargento Martínez',
      location: 'Base Militar, Zona 51',
    },
    {
      id: '4',
      title: 'Reunión de Facciones Semanal',
      date: new Date(y, m, Math.max(1, now.getDate() + 2)),
      time: '20:00',
      category: 'reuniones',
      description: 'Reunión semanal de líderes de facciones para coordinar actividades, resolver conflictos y planificar eventos futuros. Asistencia obligatoria.',
      organizer: 'Admin Team',
      location: 'Sala de Juntas, City Hall',
    },
    {
      id: '5',
      title: 'Operación Narcóticos',
      date: new Date(y, m, Math.max(1, now.getDate() + 8)),
      time: '21:30',
      category: 'operaciones',
      description: 'Operación encubierta para desmantelar la red de narcotráfico en el puerto. Se necesitan infiltrados y equipo de vigilancia.',
      organizer: 'Agente Especial Cruz',
      location: 'Puerto de Los Santos',
    },
    {
      id: '6',
      title: 'Festival de Música Beach Party',
      date: new Date(y, m, Math.max(1, now.getDate() + 10)),
      time: '18:00',
      category: 'eventos_sociales',
      description: 'Gran festival de música en la playa con DJ en vivo, food trucks y competiciones. ¡Todos invitados a la mejor fiesta de LS!',
      organizer: 'Social Events Team',
      location: 'Del Perro Beach',
    },
    {
      id: '7',
      title: 'Entrenamiento Médico de Emergencia',
      date: new Date(y, m, Math.max(1, now.getDate() + 6)),
      time: '17:00',
      category: 'entrenamientos',
      description: 'Capacitación en primeros auxilios avanzados y procedimientos de emergencia. Prácticas con simuladores y escenarios reales.',
      organizer: 'Dr. Helena Vance',
      location: 'Hospital Pillbox, Sala 3',
    },
    {
      id: '8',
      title: 'Reunión de la Mafia',
      date: new Date(y, m, Math.max(1, now.getDate() + 12)),
      time: '23:00',
      category: 'reuniones',
      description: 'Reunión privada de las familias criminales. Negociación de territorios y distribución de recursos. Solo miembros invitados.',
      organizer: 'Don Vittorio',
      location: 'Ubicación Secreta',
    },
    {
      id: '9',
      title: 'Operación Rescate de Rehenes',
      date: new Date(y, m, Math.max(1, now.getDate() + 14)),
      time: '20:00',
      category: 'operaciones',
      description: 'Simulación de rescate de rehenes en edificio comercial. Participación conjunta de LSPD, FBI y EMS. Evaluación de protocolos.',
      organizer: 'Capitán Reyes',
      location: 'Maze Bank Tower',
    },
    {
      id: '10',
      title: 'Torneo de Boxeo Club Deportivo',
      date: new Date(y, m, Math.max(1, now.getDate() + 7)),
      time: '19:30',
      category: 'eventos_sociales',
      description: 'Torneo de boxeo amateur en el gimnasio de LS. Inscripción abierta hasta 24h antes. Categorías por peso. ¡Demuestra tu fuerza!',
      organizer: 'Coach Rivera',
      location: 'Gimnasio Ganton',
    },
    // Next month events
    {
      id: '11',
      title: 'Entrenamiento de Conducción Extrema',
      date: new Date(y, m + 1, 5),
      time: '16:00',
      category: 'entrenamientos',
      description: 'Curso avanzado de conducción evasiva y persecución. Incluye práctica en circuito cerrado y simulaciones de chase.',
      organizer: 'Instructor Dom',
      location: 'Circuito de Los Santos',
    },
    {
      id: '12',
      title: 'Operación Contrabando Portuario',
      date: new Date(y, m + 1, 8),
      time: '22:00',
      category: 'operaciones',
      description: 'Misión de contrabando coordinado en los muelles. Transporte de mercancía especial desde el puerto. Equipo de logística requerido.',
      organizer: 'Capitán Naviero',
      location: 'Puerto de Los Santos, Muelle 7',
    },
    {
      id: '13',
      title: 'Gala Benéfica Anual',
      date: new Date(y, m + 1, 12),
      time: '20:00',
      category: 'eventos_sociales',
      description: 'Elegante gala benéfica en el hotel más lujoso de LS. Dress code: formal. Subasta silenciosa y cena de gala para recaudar fondos.',
      organizer: 'Socialite Club',
      location: 'Hotel Richman, Salón Dorado',
    },
    {
      id: '14',
      title: 'Reunión del Concejo Municipal',
      date: new Date(y, m + 1, 3),
      time: '18:00',
      category: 'reuniones',
      description: 'Sesión ordinaria del concejo municipal. Temas: presupuesto, zonificación y nuevas regulaciones. Abierto al público.',
      organizer: 'Alcalde Johnson',
      location: 'City Hall, Salón Principal',
    },
    {
      id: '15',
      title: 'Entrenamiento Tiro al Blanco FBI',
      date: new Date(y, m + 1, 10),
      time: '10:00',
      category: 'entrenamientos',
      description: 'Sesión de puntería y tácticas de disparo en el campo de tiro. Evaluación de precisión para agentes federales.',
      organizer: 'Agente Supervisor Blake',
      location: 'Campo de Tiro, Paleto Bay',
    },
  ]
}

/* ────────────────────────────────────────────
   Helper: calendar grid
   ──────────────────────────────────────────── */

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7 // Mon=0
  const totalCells = Math.ceil((startDow + lastDay.getDate()) / 7) * 7
  const days: (number | null)[] = []
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startDow + 1
    if (dayNum < 1 || dayNum > lastDay.getDate()) {
      days.push(null)
    } else {
      days.push(dayNum)
    }
  }
  return days
}

/* ────────────────────────────────────────────
   Sub-components
   ──────────────────────────────────────────── */

function CategoryDot({ category, size = 'sm' }: { category: EventCategory; size?: 'sm' | 'md' }) {
  const cfg = CATEGORY_CONFIG[category]
  const sz = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'
  return (
    <span
      className={`${sz} rounded-full inline-block shrink-0`}
      style={{
        backgroundColor: cfg.color,
        boxShadow: `0 0 6px ${cfg.glowColor}`,
      }}
    />
  )
}

function CategoryBadge({ category }: { category: EventCategory }) {
  const cfg = CATEGORY_CONFIG[category]
  return (
    <Badge
      className="text-[10px] px-2 py-0.5 border-0 font-medium"
      style={{
        backgroundColor: `${cfg.color}20`,
        color: cfg.color,
        boxShadow: `0 0 8px ${cfg.color}15`,
      }}
    >
      {cfg.label}
    </Badge>
  )
}

function EventCard({
  event,
  onClick,
  index,
}: {
  event: CalendarEvent
  onClick: () => void
  index: number
}) {
  const cfg = CATEGORY_CONFIG[event.category]

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      onClick={onClick}
      className="w-full text-left group relative rounded-xl p-3 sm:p-4 bg-[#0f172a]/60 border border-[rgba(124,58,237,0.15)] hover:border-[rgba(124,58,237,0.35)] transition-all duration-300 shimmer-sweep card-lift cursor-pointer"
    >
      {/* Accent line left */}
      <div
        className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full"
        style={{ backgroundColor: cfg.color, boxShadow: `0 0 8px ${cfg.glowColor}` }}
      />

      <div className="pl-3">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className="text-sm font-semibold text-[#e2e8f0] group-hover:text-white transition-colors leading-tight">
            {event.title}
          </h4>
          <CategoryDot category={event.category} size="md" />
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#94a3b8]">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {event.time}h
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {event.location.split(',')[0]}
          </span>
        </div>
      </div>
    </motion.button>
  )
}

/* ────────────────────────────────────────────
   Event Detail Modal
   ──────────────────────────────────────────── */

function EventDetailModal({
  event,
  open,
  onClose,
}: {
  event: CalendarEvent | null
  open: boolean
  onClose: () => void
}) {
  if (!event) return null
  const cfg = CATEGORY_CONFIG[event.category]
  const dateStr = event.date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-[#0f172a] border-[rgba(124,58,237,0.3)] rounded-2xl max-w-md p-0 overflow-hidden"
        style={{
          boxShadow: `0 0 30px ${cfg.color}20, 0 25px 50px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Top accent line */}
        <div
          className="h-[3px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${cfg.color}, ${cfg.color}, transparent)`,
            boxShadow: `0 0 12px ${cfg.glowColor}`,
          }}
        />

        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CategoryBadge category={event.category} />
            </div>
            <DialogTitle className="text-xl font-bold text-white leading-tight">
              {event.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detalle del evento {event.title}
            </DialogDescription>
          </DialogHeader>

          {/* Info rows */}
          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 text-sm">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}
              >
                <Calendar className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <div>
                <p className="text-[#e2e8f0] capitalize">{dateStr}</p>
                <p className="text-[#94a3b8] text-xs">{event.time}h CET</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}
              >
                <MapPin className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <p className="text-[#e2e8f0]">{event.location}</p>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}
              >
                <User className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <p className="text-[#e2e8f0]">{event.organizer}</p>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl bg-[#030712]/60 border border-[rgba(124,58,237,0.15)] p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Info className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-xs text-[#94a3b8] uppercase tracking-wider font-medium">
                Descripción
              </span>
            </div>
            <p className="text-[#cbd5e1] text-sm leading-relaxed">{event.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ────────────────────────────────────────────
   Main EventCalendar Section
   ──────────────────────────────────────────── */

export default function EventCalendar() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const events = useMemo(() => generateMockEvents(), [])

  const calendarDays = useMemo(
    () => getCalendarDays(currentYear, currentMonth),
    [currentYear, currentMonth],
  )

  // Events for selected date
  const selectedDateEvents = useMemo(() => {
    if (selectedDate === null) return []
    return events.filter(
      (e) =>
        e.date.getFullYear() === currentYear &&
        e.date.getMonth() === currentMonth &&
        e.date.getDate() === selectedDate,
    )
  }, [events, selectedDate, currentYear, currentMonth])

  // Events map for quick lookup on calendar dots
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    events.forEach((e) => {
      const key = `${e.date.getFullYear()}-${e.date.getMonth()}-${e.date.getDate()}`
      const existing = map.get(key) || []
      existing.push(e)
      map.set(key, existing)
    })
    return map
  }, [events])

  // Next 5 upcoming events
  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return [...events]
      .filter((e) => e.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
  }, [events])

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear()

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
    setSelectedDate(null)
  }

  const openEventModal = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setModalOpen(true)
  }

  return (
    <section
      className="relative py-20 px-4 sm:px-6 overflow-hidden"
      aria-label="Calendario de Eventos"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#030712]" />
      <div className="absolute inset-0 hex-pattern opacity-10" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 60% 20%, rgba(6,182,212,0.04) 0%, transparent 50%)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 30% 80%, rgba(124,58,237,0.04) 0%, transparent 50%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section Header ── */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Calendario de{' '}
            <span
              className="gradient-text animate-gradient-text"
              style={{
                backgroundImage: 'linear-gradient(90deg, #06b6d4, #f59e0b, #06b6d4)',
              }}
            >
              Eventos
            </span>
          </h2>
          <p className="text-[#94a3b8] text-sm sm:text-base max-w-xl mx-auto">
            Planifica tu semana — operaciones, eventos sociales, entrenamientos y reuniones
          </p>
          <div
            className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#06b6d4] to-[#f59e0b] mt-4"
            style={{ boxShadow: '0 0 15px rgba(6,182,212,0.5)' }}
          />
        </motion.div>

        {/* ── Main Layout: Calendar + Side Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Calendar ── */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl neon-border overflow-hidden cyber-corner">
              {/* Top decorative line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, #06b6d4, #f59e0b, #06b6d4, transparent)',
                  boxShadow: '0 0 12px rgba(6,182,212,0.4)',
                }}
              />
              {/* Corner glows */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-[#06b6d4]/5 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#f59e0b]/5 rounded-full blur-2xl" />

              <div className="relative p-4 sm:p-6">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevMonth}
                    className="h-9 w-9 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[rgba(124,58,237,0.15)] transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-5 h-5 text-[#06b6d4]" />
                    <h3 className="text-lg sm:text-xl font-bold text-white neon-text-glow-cyan">
                      {MONTH_NAMES[currentMonth]} {currentYear}
                    </h3>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextMonth}
                    className="h-9 w-9 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[rgba(124,58,237,0.15)] transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Day-of-week headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {DAYS_OF_WEEK.map((d) => (
                    <div
                      key={d}
                      className="text-center text-[11px] font-medium text-[#94a3b8]/60 uppercase tracking-wider py-1.5"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    if (day === null) {
                      return <div key={`empty-${i}`} className="aspect-square" />
                    }

                    const key = `${currentYear}-${currentMonth}-${day}`
                    const dayEvents = eventsByDate.get(key) || []
                    const hasEvents = dayEvents.length > 0
                    const todayFlag = isToday(day)
                    const isSelected = selectedDate === day

                    return (
                      <motion.button
                        key={key}
                        type="button"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5
                          transition-all duration-200 relative cursor-pointer
                          ${isSelected
                            ? 'bg-[rgba(6,182,212,0.15)] border border-[#06b6d4]/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                            : todayFlag
                              ? 'bg-[rgba(124,58,237,0.12)] border border-[#7c3aed]/30 shadow-[0_0_8px_rgba(124,58,237,0.15)]'
                              : 'border border-transparent hover:bg-[rgba(124,58,237,0.08)] hover:border-[rgba(124,58,237,0.2)]'
                          }
                        `}
                      >
                        <span
                          className={`text-sm font-medium leading-none ${
                            todayFlag
                              ? 'text-[#7c3aed]'
                              : isSelected
                                ? 'text-white'
                                : 'text-[#e2e8f0]'
                          }`}
                          style={
                            todayFlag
                              ? { textShadow: '0 0 8px rgba(124,58,237,0.5)' }
                              : undefined
                          }
                        >
                          {day}
                        </span>
                        {/* Event dots row */}
                        {hasEvents && (
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {dayEvents.slice(0, 3).map((ev) => (
                              <CategoryDot key={ev.id} category={ev.category} />
                            ))}
                            {dayEvents.length > 3 && (
                              <span className="text-[8px] text-[#94a3b8]/50 leading-none">
                                +{dayEvents.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Category legend */}
                <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-[rgba(124,58,237,0.1)]">
                  {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cfg.color, boxShadow: `0 0 5px ${cfg.glowColor}` }}
                      />
                      <span className="text-[10px] text-[#94a3b8]/70">{cfg.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Side Panel ── */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {/* Selected Date Events */}
            <div className="relative rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl neon-border overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)',
                  boxShadow: '0 0 10px rgba(124,58,237,0.4)',
                }}
              />

              <div className="relative p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-[#06b6d4]" />
                  <h3 className="text-sm font-semibold text-[#e2e8f0]">
                    {selectedDate !== null
                      ? `Eventos del ${selectedDate} de ${MONTH_NAMES[currentMonth]}`
                      : 'Selecciona un día'}
                  </h3>
                </div>

                <AnimatePresence mode="wait">
                  {selectedDate === null ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <Calendar className="w-10 h-10 text-[#94a3b8]/20 mx-auto mb-3" />
                      <p className="text-[#94a3b8]/50 text-xs">
                        Haz clic en un día del calendario para ver sus eventos
                      </p>
                    </motion.div>
                  ) : selectedDateEvents.length === 0 ? (
                    <motion.div
                      key="no-events"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <Calendar className="w-10 h-10 text-[#94a3b8]/20 mx-auto mb-3" />
                      <p className="text-[#94a3b8]/50 text-xs">
                        No hay eventos programados para este día
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`events-${selectedDate}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2.5 max-h-72 overflow-y-auto pr-1"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(124,58,237,0.3) transparent',
                      }}
                    >
                      {selectedDateEvents.map((ev, idx) => (
                        <EventCard
                          key={ev.id}
                          event={ev}
                          index={idx}
                          onClick={() => openEventModal(ev)}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Próximos Eventos */}
            <div className="relative rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl neon-border overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, #f59e0b, #7c3aed, transparent)',
                  boxShadow: '0 0 10px rgba(245,158,11,0.4)',
                }}
              />

              <div className="relative p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-[#f59e0b]" />
                  <h3 className="text-sm font-semibold text-[#e2e8f0]">Próximos Eventos</h3>
                </div>

                <div className="space-y-2.5">
                  {upcomingEvents.map((ev, idx) => {
                    const cfg = CATEGORY_CONFIG[ev.category]
                    const dateLabel = ev.date.toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                    })

                    return (
                      <motion.button
                        key={ev.id}
                        type="button"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.08 }}
                        onClick={() => openEventModal(ev)}
                        className="w-full text-left group flex items-center gap-3 p-2.5 rounded-lg bg-[#030712]/40 border border-[rgba(124,58,237,0.1)] hover:border-[rgba(124,58,237,0.3)] transition-all duration-200 cursor-pointer"
                      >
                        {/* Date badge */}
                        <div
                          className="w-11 h-11 rounded-lg flex flex-col items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${cfg.color}10`,
                            border: `1px solid ${cfg.color}25`,
                          }}
                        >
                          <span
                            className="text-sm font-bold leading-none"
                            style={{ color: cfg.color }}
                          >
                            {ev.date.getDate()}
                          </span>
                          <span className="text-[8px] uppercase leading-none mt-0.5" style={{ color: cfg.color }}>
                            {ev.date.toLocaleDateString('es-ES', { month: 'short' }).slice(0, 3)}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-[#e2e8f0] truncate group-hover:text-white transition-colors">
                            {ev.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-[#94a3b8]/60">
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {ev.time}h
                            </span>
                            <span>{dateLabel}</span>
                          </div>
                        </div>

                        <CategoryDot category={ev.category} />
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  )
}
