'use client'

import { useState, useCallback, useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Cookie, Settings } from 'lucide-react'

const STORAGE_KEY = 'prestigio-cookie-consent'
const CONSENT_EVENT = 'prestigio-consent-change'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

type ConsentState = 'accepted' | 'rejected' | 'custom' | null

const DEFAULT_PREFS: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
}

function getStoredConsent(): ConsentState {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEY) as ConsentState
}

function readPreferencesFromStorage(): CookiePreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-prefs`)
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_PREFS
}

// Module-level cached snapshot for the preferences OBJECT.
// useSyncExternalStore's getSnapshot MUST return a referentially stable value
// for objects — returning JSON.parse(raw) each call causes an infinite loop.
let cachedPrefsSnapshot: CookiePreferences = DEFAULT_PREFS

if (typeof window !== 'undefined') {
  cachedPrefsSnapshot = readPreferencesFromStorage()
}

function getPrefsSnapshot(): CookiePreferences {
  return cachedPrefsSnapshot
}

function saveConsent(state: ConsentState, prefs?: CookiePreferences) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, state ?? '')
  if (prefs) {
    localStorage.setItem(`${STORAGE_KEY}-prefs`, JSON.stringify(prefs))
    cachedPrefsSnapshot = prefs
  }
  window.dispatchEvent(new Event(CONSENT_EVENT))
}

function subscribeConsent(callback: () => void) {
  const handler = () => {
    cachedPrefsSnapshot = readPreferencesFromStorage()
    callback()
  }
  window.addEventListener('storage', handler)
  window.addEventListener(CONSENT_EVENT, handler)
  return () => {
    window.removeEventListener('storage', handler)
    window.removeEventListener(CONSENT_EVENT, handler)
  }
}

const noopSubscribe = () => () => {}

/** SSR-safe "mounted" flag via useSyncExternalStore (boolean primitive — safe). */
function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )
}

/** Read consent state (string | null — primitive, safe with useSyncExternalStore). */
function useStoredConsent(): ConsentState {
  return useSyncExternalStore(
    subscribeConsent,
    () => getStoredConsent(),
    () => null
  )
}

/** Read cookie preferences (object — uses cached snapshot to avoid infinite loop). */
function useStoredPreferences(): CookiePreferences {
  return useSyncExternalStore(
    subscribeConsent,
    getPrefsSnapshot,
    () => DEFAULT_PREFS
  )
}

export default function CookieConsent() {
  const mounted = useMounted()
  const consentState = useStoredConsent()
  const storedPrefs = useStoredPreferences()
  const [showPreferences, setShowPreferences] = useState(false)
  // Local overrides for the preferences panel toggles (merged over stored values)
  const [localOverrides, setLocalOverrides] = useState<Partial<CookiePreferences>>({})

  // Derived preferences: stored values + any local toggle overrides
  const preferences: CookiePreferences = { ...storedPrefs, ...localOverrides }

  // Only show banner after mount AND when no consent has been given.
  // Before mount, visible=false on both server and client (no hydration mismatch).
  const visible = mounted && consentState === null

  const handleAcceptAll = useCallback(() => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    }
    setLocalOverrides(allAccepted)
    saveConsent('accepted', allAccepted)
    setShowPreferences(false)
  }, [])

  const handleRejectAll = useCallback(() => {
    setLocalOverrides(DEFAULT_PREFS)
    saveConsent('rejected', DEFAULT_PREFS)
    setShowPreferences(false)
  }, [])

  const handleSavePreferences = useCallback(() => {
    saveConsent('custom', preferences)
    setShowPreferences(false)
  }, [preferences])

  const togglePreference = useCallback((key: keyof CookiePreferences) => {
    if (key === 'essential') return // essential is always on
    setLocalOverrides((prev) => ({ ...prev, [key]: !preferences[key] }))
  }, [preferences])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="mx-auto max-w-3xl rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-[#7c3aed]/20 shadow-[0_0_40px_rgba(124,58,237,0.15)] overflow-hidden">
            {/* Main content */}
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center">
                    <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-[#7c3aed]" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#7c3aed]" />
                      Configuración de Cookies
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                      Utilizamos cookies para mejorar tu experiencia en el
                      portal. Puedes aceptar todas, rechazar o configurar tus
                      preferencias.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleRejectAll}
                  className="order-3 sm:order-1 px-4 py-2.5 rounded-lg border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 hover:border-red-500/50 hover:shadow-[0_0_12px_rgba(239,68,68,0.15)] transition-all duration-200"
                >
                  Rechazar Todo
                </button>
                <button
                  onClick={() => setShowPreferences((prev) => !prev)}
                  className="order-2 sm:order-2 px-4 py-2.5 rounded-lg border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Configurar
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="order-1 sm:order-3 px-4 py-2.5 rounded-lg bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] hover:shadow-[0_0_20px_rgba(124,58,237,0.5),0_0_40px_rgba(124,58,237,0.25)] transition-all duration-200 neon-glow"
                >
                  Aceptar Todo
                </button>
              </div>
            </div>

            {/* Preferences Panel */}
            <AnimatePresence>
              {showPreferences && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[#7c3aed]/15 bg-[#0b1120]/60 px-5 sm:px-6 py-5 space-y-4">
                    <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-[#7c3aed]" />
                      Preferencias de Cookies
                    </h4>

                    {/* Essential */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-sm font-medium text-white">
                          Cookies Esenciales
                        </p>
                        <p className="text-xs text-gray-500">
                          Necesarias para el funcionamiento del sitio
                        </p>
                      </div>
                      <button
                        disabled
                        className="flex-shrink-0 w-11 h-6 rounded-full bg-[#7c3aed]/80 relative cursor-not-allowed opacity-80"
                        aria-label="Cookies esenciales siempre activadas"
                      >
                        <span className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-sm font-medium text-white">
                          Cookies de Análisis
                        </p>
                        <p className="text-xs text-gray-500">
                          Nos ayudan a entender cómo usas el portal
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference('analytics')}
                        className={`flex-shrink-0 w-11 h-6 rounded-full relative transition-colors duration-200 ${
                          preferences.analytics
                            ? 'bg-[#7c3aed] shadow-[0_0_8px_rgba(124,58,237,0.4)]'
                            : 'bg-gray-700'
                        }`}
                        role="switch"
                        aria-checked={preferences.analytics}
                        aria-label="Cookies de análisis"
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            preferences.analytics
                              ? 'translate-x-[22px]'
                              : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Marketing */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-sm font-medium text-white">
                          Cookies de Marketing
                        </p>
                        <p className="text-xs text-gray-500">
                          Usadas para mostrar contenido relevante
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference('marketing')}
                        className={`flex-shrink-0 w-11 h-6 rounded-full relative transition-colors duration-200 ${
                          preferences.marketing
                            ? 'bg-[#7c3aed] shadow-[0_0_8px_rgba(124,58,237,0.4)]'
                            : 'bg-gray-700'
                        }`}
                        role="switch"
                        aria-checked={preferences.marketing}
                        aria-label="Cookies de marketing"
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            preferences.marketing
                              ? 'translate-x-[22px]'
                              : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Save preferences button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSavePreferences}
                        className="px-5 py-2 rounded-lg bg-[#7c3aed]/20 border border-[#7c3aed]/30 text-[#7c3aed] text-sm font-medium hover:bg-[#7c3aed]/30 hover:shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all duration-200"
                      >
                        Guardar Preferencias
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
