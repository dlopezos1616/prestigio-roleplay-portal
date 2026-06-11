'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, User, Shield, Crown, X, Database, Trash2 } from 'lucide-react'
import { useSession } from '@/hooks/useSession'
import { useNavigation } from '@/lib/navigation'
import { toast } from 'sonner'

export default function DevLogin() {
  const [open, setOpen] = useState(false)
  const user = useSession((s) => s.user)
  const setUser = useSession((s) => s.setUser)
  const { navigate } = useNavigation()

  const devLogin = async (role: string) => {
    try {
      const res = await fetch('/api/dev/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
        toast.success(`Dev login como ${role}`, {
          style: { background: '#0f172a', border: '1px solid rgba(124,58,237,0.3)', color: '#f1f5f9' },
        })
        setOpen(false)
      }
    } catch {
      toast.error('Error al hacer dev login')
    }
  }

  const seedData = async () => {
    try {
      const res = await fetch('/api/dev/seed', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        toast.success(`Datos de prueba creados: ${data.created.whitelistApps} apps, ${data.created.tasks} tareas`, {
          style: { background: '#0f172a', border: '1px solid rgba(34,197,94,0.3)', color: '#f1f5f9' },
        })
      }
    } catch {
      toast.error('Error al crear datos de prueba')
    }
  }

  const cleanup = async () => {
    try {
      const res = await fetch('/api/dev/cleanup', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setUser(null)
        toast.success('Base de datos limpiada', {
          style: { background: '#0f172a', border: '1px solid rgba(239,68,68,0.3)', color: '#f1f5f9' },
        })
      }
    } catch {
      toast.error('Error al limpiar datos')
    }
  }

  // Don't show in production
  if (process.env.NODE_ENV === 'production') return null

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, duration: 0.3 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-[#0f172a] border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-all duration-200"
        title="Dev Tools"
      >
        <Bug className="w-5 h-5" />
      </motion.button>

      {/* Dev Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 left-6 z-50 w-72 bg-[#0f172a] border border-[#f59e0b]/30 rounded-xl p-4 shadow-xl shadow-[#f59e0b]/5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-[#f59e0b]" />
                <span className="text-sm font-bold text-[#f59e0b]">Dev Tools</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current user info */}
            {user && (
              <div className="mb-4 p-2 rounded-lg bg-[#030712]/50 border border-white/5 text-xs">
                <p className="text-gray-400">Logged in as:</p>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-[#7c3aed]">Role: {user.role}</p>
              </div>
            )}

            {/* Role buttons */}
            <div className="space-y-2 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Quick Login</p>
              <button onClick={() => devLogin('USER')} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#7c3aed] hover:bg-[#7c3aed]/20 transition-colors text-sm">
                <User className="w-4 h-4" /> User
              </button>
              <button onClick={() => devLogin('STAFF')} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#06b6d4]/10 border border-[#06b6d4]/20 text-[#06b6d4] hover:bg-[#06b6d4]/20 transition-colors text-sm">
                <Shield className="w-4 h-4" /> Staff
              </button>
              <button onClick={() => devLogin('ADMIN')} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b]/20 transition-colors text-sm">
                <Crown className="w-4 h-4" /> Admin
              </button>
            </div>

            {/* Data actions */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Data</p>
              <button onClick={seedData} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors text-sm">
                <Database className="w-4 h-4" /> Seed Demo Data
              </button>
              <button onClick={cleanup} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm">
                <Trash2 className="w-4 h-4" /> Clear All Data
              </button>
            </div>

            {/* Quick navigation */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Quick Nav</p>
              <div className="grid grid-cols-3 gap-1">
                {['home', 'whitelist', 'staff', 'admin', 'galeria', 'info'].map((page) => (
                  <button
                    key={page}
                    onClick={() => { navigate(page as any); setOpen(false) }}
                    className="px-2 py-1.5 rounded text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors capitalize"
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
