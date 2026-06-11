'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: '¿Cómo me uno al servidor?',
    answer:
      'El proceso es sencillo: primero únete a nuestro Discord oficial, luego solicita la whitelist completando el formulario correspondiente. Una vez aceptado, podrás conectarte a través de FiveM buscando "Prestigio RP" en la lista de servidores o usando la IP de conexión directa.',
  },
  {
    question: '¿Qué es la whitelist?',
    answer:
      'La whitelist es un proceso de selección para asegurar la calidad del roleplay dentro del servidor. Consiste en un formulario donde demuestras tu conocimiento de las normas y tu compromiso con el roleplay inmersivo. Solo los jugadores aprobados pueden acceder al servidor.',
  },
  {
    question: '¿Necesito experiencia previa?',
    answer:
      'No es obligatorio tener experiencia previa en roleplay, pero es recomendable leer las normas del servidor y familiarizarte con los conceptos básicos de RP antes de solicitar la whitelist. Nuestra comunidad está dispuesta a ayudar a los nuevos a integrarse.',
  },
  {
    question: '¿Cuántas veces puedo solicitar la whitelist?',
    answer:
      'Puedes solicitar la whitelist un máximo de 2 intentos. Si no eres aprobado en el primer intento, recibirás retroalimentación del staff para que puedas mejorar tu solicitud. Te recomendamos leer cuidadosamente las normas antes de volver a aplicar.',
  },
  {
    question: '¿Qué facciones hay disponibles?',
    answer:
      'Contamos con múltiples facciones: Policía (LSPD/BCSO), EMS (Servicios Médicos), FBI, Mecánico, Crimen Organizado y Civil. Cada facción tiene sus propios roles, responsabilidades y cadenas de mando que enriquecen la experiencia de roleplay.',
  },
  {
    question: '¿Es obligatorio el voice chat?',
    answer:
      'Sí, la comunicación oral es fundamental para el roleplay inmersivo. Necesitas un micrófono funcional para interactuar con otros jugadores. El voice chat permite situaciones de roleplay más realistas y dinámicas que el chat de texto por sí solo.',
  },
  {
    question: '¿Cómo puedo ser staff?',
    answer:
      'Para ser parte del equipo de staff debes demostrar compromiso con la comunidad, tiempo activo en el servidor, conocimiento profundo de las normas y una actitud proactiva. Periódicamente abrimos convocatorias que se anuncian en nuestro Discord.',
  },
  {
    question: '¿Hay eventos especiales?',
    answer:
      'Sí, cada viernes y sábado organizamos eventos especiales para la comunidad: carreras callejeras, torneos de boxeo, misiones de facción, eventos temáticos y mucho más. Los eventos se anuncian con anticipación en Discord y en la sección de eventos del portal.',
  },
]

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group"
    >
      <div
        className={`relative rounded-xl bg-[#0f172a] transition-all duration-300 overflow-hidden ${
          isOpen
            ? 'shadow-[0_0_25px_rgba(124,58,237,0.15)]'
            : 'hover:shadow-[0_0_15px_rgba(124,58,237,0.08)]'
        }`}
        style={{
          border: isOpen
            ? '1px solid rgba(124, 58, 237, 0.5)'
            : '1px solid rgba(124, 58, 237, 0.15)',
        }}
      >
        {/* Purple left border accent when expanded */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-300 ${
            isOpen ? 'bg-[#7c3aed] shadow-[0_0_10px_rgba(124,58,237,0.6)]' : 'bg-transparent'
          }`}
        />

        {/* Question button */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer"
          aria-expanded={isOpen}
        >
          <span
            className={`text-base sm:text-lg font-semibold transition-colors duration-300 pr-4 ${
              isOpen ? 'text-[#7c3aed]' : 'text-white group-hover:text-[#a78bfa]'
            }`}
          >
            {item.question}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-shrink-0"
          >
            <ChevronDown
              className={`w-5 h-5 transition-colors duration-300 ${
                isOpen ? 'text-[#7c3aed]' : 'text-[#94a3b8]'
              }`}
            />
          </motion.div>
        </button>

        {/* Answer with animated height */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent mb-4" />
                <p className="text-[#94a3b8] text-sm sm:text-base leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a0f1e] to-[#030712]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Decorative glow orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[#7c3aed]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-[#06b6d4]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section title */}
        <motion.div
          className="text-center mb-14 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 bg-[#7c3aed]/10 border border-[#7c3aed]/20 shadow-[0_0_20px_rgba(124,58,237,0.15)]">
            <HelpCircle className="w-8 h-8 text-[#7c3aed]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Preguntas <span className="text-[#7c3aed]">Frecuentes</span>
          </h2>
          <p className="text-[#94a3b8] text-base sm:text-lg max-w-2xl mx-auto">
            Todo lo que necesitas saber antes de unirte a Prestigio RP
          </p>
          <div
            className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] mt-6"
            style={{ boxShadow: '0 0 15px rgba(124,58,237,0.5)' }}
          />
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-3 sm:space-y-4">
          {faqItems.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
