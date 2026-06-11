'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, Maximize2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type EventTag = 'Todos' | 'Eventos' | 'Operaciones' | 'Entrenamientos'

interface GalleryItem {
  id: number
  title: string
  description: string
  eventTag: Exclude<EventTag, 'Todos'>
  image: string
  gradient: string
  rowSpan: number
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Patrulla Nocturna',
    description: 'Las unidades de policía patrullan las calles de Los Santos manteniendo el orden y la seguridad ciudadana en cada rincón de la ciudad.',
    eventTag: 'Operaciones',
    image: '/gallery/patrol.png',
    gradient: 'from-[#06b6d4] via-[#0e7490] to-[#164e63]',
    rowSpan: 2,
  },
  {
    id: 2,
    title: 'Carrera Callejera',
    description: 'Las carreras ilegales iluminan las noches de Los Santos. Adrenalina pura en cada curva y recta de la ciudad.',
    eventTag: 'Eventos',
    image: '/gallery/race.png',
    gradient: 'from-[#ef4444] via-[#dc2626] to-[#991b1b]',
    rowSpan: 1,
  },
  {
    id: 3,
    title: 'Rescate de Emergencia',
    description: 'El equipo de EMS responde ante emergencias críticas. Cada segundo cuenta cuando se trata de salvar vidas.',
    eventTag: 'Operaciones',
    image: '/gallery/ems.png',
    gradient: 'from-[#22c55e] via-[#16a34a] to-[#166534]',
    rowSpan: 2,
  },
  {
    id: 4,
    title: 'Ciudad de Noche',
    description: 'Los Santos cobra vida bajo las luces de neón. Una ciudad que nunca duerme, llena de oportunidades y peligros.',
    eventTag: 'Eventos',
    image: '/gallery/city-night.png',
    gradient: 'from-[#7c3aed] via-[#6d28d9] to-[#4c1d95]',
    rowSpan: 2,
  },
  {
    id: 5,
    title: 'Operación Encubierta',
    description: 'Desde las sombras, los agentes del FBI recopilan información vital para desarticular redes criminales.',
    eventTag: 'Entrenamientos',
    image: '/gallery/fbi.png',
    gradient: 'from-[#f59e0b] via-[#b45309] to-[#78350f]',
    rowSpan: 1,
  },
  {
    id: 6,
    title: 'Negociaciones',
    description: 'Las negociaciones tensas entre facciones pueden cambiar el destino de la ciudad. Diplomacia y estrategia.',
    eventTag: 'Eventos',
    image: '/gallery/patrol.png',
    gradient: 'from-[#f59e0b] via-[#d97706] to-[#92400e]',
    rowSpan: 1,
  },
  {
    id: 7,
    title: 'Persecución Policial',
    description: 'Las fuerzas del orden practican protocolos de intervención y tácticas de persecución en escenarios de alta velocidad.',
    eventTag: 'Operaciones',
    image: '/gallery/race.png',
    gradient: 'from-[#64748b] via-[#475569] to-[#1e293b]',
    rowSpan: 1,
  },
  {
    id: 8,
    title: 'Entrenamiento Táctico',
    description: 'Los agentes se preparan en tácticas avanzadas de investigación y operaciones encubiertas.',
    eventTag: 'Entrenamientos',
    image: '/gallery/fbi.png',
    gradient: 'from-[#06b6d4] via-[#0891b2] to-[#155e75]',
    rowSpan: 2,
  },
]

const filterButtons: EventTag[] = ['Todos', 'Eventos', 'Operaciones', 'Entrenamientos']

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<EventTag>('Todos')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  const filteredItems = activeFilter === 'Todos'
    ? galleryItems
    : galleryItems.filter((item) => item.eventTag === activeFilter)


  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            <span className="text-[#7c3aed] neon-text-glow">Galería</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#94a3b8] text-lg flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Momentos épicos del servidor
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 h-0.5 mx-auto max-w-[120px] rounded-full bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent"
            style={{ boxShadow: '0 0 10px rgba(124,58,237,0.5)' }}
          />
        </div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {filterButtons.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-[#7c3aed] text-white neon-glow'
                  : 'bg-[#0f172a] text-[#94a3b8] border border-[rgba(124,58,237,0.2)] hover:border-[rgba(124,58,237,0.5)] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {filteredItems.length} {filteredItems.length === 1 ? 'imagen' : 'imágenes'}
            {activeFilter !== 'Todos' && <span className="text-[#7c3aed]"> en {activeFilter}</span>}
          </p>
          {activeFilter !== 'Todos' && (
            <button
              onClick={() => setActiveFilter('Todos')}
              className="text-xs text-[#7c3aed] hover:text-[#a78bfa] transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Limpiar filtro
            </button>
          )}
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[200px] gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative group cursor-pointer rounded-xl overflow-hidden neon-border card-lift neon-hover-glow shimmer-sweep"
                style={{ gridRow: `span ${item.rowSpan}` }}
                onClick={() => setSelectedItem(item)}
              >
                {/* Real image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/30 to-transparent" />

                {/* Title overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${
                    item.eventTag === 'Eventos'
                      ? 'bg-[#7c3aed]/30 text-[#a78bfa]'
                      : item.eventTag === 'Operaciones'
                      ? 'bg-[#06b6d4]/30 text-[#67e8f9]'
                      : 'bg-[#f59e0b]/30 text-[#fcd34d]'
                  }`}>
                    {item.eventTag}
                  </span>
                  <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                </div>

                {/* Hover overlay with expand icon + description */}
                <div className="absolute inset-0 bg-[#030712]/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full bg-[#7c3aed]/30 flex items-center justify-center backdrop-blur-sm border border-[#7c3aed]/40 transition-transform duration-300 group-hover:scale-110"
                  >
                    <Maximize2 className="w-5 h-5 text-white" />
                  </motion.div>
                  <p className="text-gray-300 text-xs text-center line-clamp-2 max-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.description}</p>
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: '0 0 15px rgba(124, 58, 237, 0.3), 0 0 40px rgba(124, 58, 237, 0.15)',
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="bg-[#0f172a] border-[rgba(124,58,237,0.3)] max-w-3xl p-0 overflow-hidden">
            {selectedItem && (
              <>
                {/* Full image */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <DialogTitle className="text-2xl font-bold text-white mb-2">
                    {selectedItem.title}
                  </DialogTitle>
                  <DialogDescription className="text-[#94a3b8] text-base mb-4">
                    {selectedItem.description}
                  </DialogDescription>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    selectedItem.eventTag === 'Eventos'
                      ? 'bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30'
                      : selectedItem.eventTag === 'Operaciones'
                      ? 'bg-[#06b6d4]/20 text-[#67e8f9] border border-[#06b6d4]/30'
                      : 'bg-[#f59e0b]/20 text-[#fcd34d] border border-[#f59e0b]/30'
                  }`}>
                    {selectedItem.eventTag}
                  </span>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
