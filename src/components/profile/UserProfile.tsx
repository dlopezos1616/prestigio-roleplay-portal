'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User, Shield, Clock, CheckCircle2, XCircle, AlertCircle,
  Calendar, ChevronRight, FileText, ArrowRight, Hash
} from 'lucide-react'
import { useSession } from '@/hooks/useSession'
import { useNavigation } from '@/lib/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface WhitelistApp {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  attemptNumber: number
  rejectReason: string | null
  createdAt: string
  reviewer?: { username: string } | null
}

const roleColors: Record<string, string> = {
  ADMIN: '#ef4444',
  STAFF: '#06b6d4',
  USER: '#7c3aed',
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  STAFF: 'Staff',
  USER: 'Usuario',
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  PENDING: {
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    icon: <Clock className="w-5 h-5" />,
    label: 'Pendiente',
  },
  APPROVED: {
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.1)',
    icon: <CheckCircle2 className="w-5 h-5" />,
    label: 'Aprobada',
  },
  REJECTED: {
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    icon: <XCircle className="w-5 h-5" />,
    label: 'Rechazada',
  },
}

export default function UserProfile() {
  const user = useSession((s) => s.user)
  const { navigate } = useNavigation()
  const [applications, setApplications] = useState<WhitelistApp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.dbId) {
      setLoading(false)
      return
    }

    async function fetchApps() {
      try {
        const res = await fetch(`/api/whitelist?userId=${user!.dbId}`)
        if (res.ok) {
          const data = await res.json()
          const userApps = data.filter((app: WhitelistApp & { user: { discordId: string } }) =>
            app.user?.discordId === user!.discordId
          )
          setApplications(userApps)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }

    fetchApps()
  }, [user?.dbId, user?.discordId])

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-16 h-16 text-[#7c3aed]/30 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Inicia sesión</h2>
        <p className="text-[#94a3b8] mb-6">Necesitas iniciar sesión para ver tu perfil</p>
        <Button
          onClick={() => navigate('home')}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] neon-glow"
        >
          Volver al inicio
        </Button>
      </div>
    )
  }

  const hasApproved = applications.some(app => app.status === 'APPROVED')
  const hasPending = applications.some(app => app.status === 'PENDING')
  const rejectedCount = applications.filter(app => app.status === 'REJECTED').length
  const canApply = !hasApproved && !hasPending && rejectedCount < 2

  const currentStatus = applications.length > 0
    ? applications[0].status
    : null

  // Timeline steps
  const timelineSteps = [
    { label: 'Registro', completed: true, icon: <User className="w-4 h-4" /> },
    { label: 'Solicitud Enviada', completed: applications.length > 0, icon: <FileText className="w-4 h-4" /> },
    { label: 'En Revisión', completed: hasPending || hasApproved, icon: <Clock className="w-4 h-4" /> },
    { label: 'Whitelist', completed: hasApproved, icon: <Shield className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-[#0f172a] rounded-2xl p-6 sm:p-8 neon-border overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#7c3aed]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#06b6d4]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#7c3aed]/40 shadow-lg shadow-[#7c3aed]/10">
              {user.image ? (
                <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#7c3aed]/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-[#7c3aed]" />
                </div>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#22c55e] rounded-full border-[3px] border-[#0f172a] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white mb-1">{user.name || 'Usuario'}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
              <Badge
                className="border text-xs font-medium"
                style={{
                  backgroundColor: `${roleColors[user.role || 'USER']}15`,
                  borderColor: `${roleColors[user.role || 'USER']}40`,
                  color: roleColors[user.role || 'USER'],
                }}
              >
                {roleLabels[user.role || 'USER']}
              </Badge>
              {hasApproved && (
                <Badge className="bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/40 text-xs font-medium">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Whitelisted
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-[#64748b]">
              <span className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                {user.discordId || 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Miembro
              </span>
            </div>
          </div>

          {/* Quick Action */}
          {canApply && (
            <Button
              onClick={() => navigate('whitelist')}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] neon-glow shrink-0"
            >
              Solicitar Whitelist
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </motion.div>

      {/* Whitelist Status Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#0f172a] rounded-2xl p-6 sm:p-8 neon-border"
      >
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#7c3aed]" />
          Estado de Whitelist
        </h3>

        {/* Visual Progress Timeline */}
        <div className="relative mb-8">
          {/* Progress line background */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#1e293b] hidden sm:block" />
          {/* Progress line fill */}
          <div
            className="absolute top-5 left-0 h-0.5 bg-[#7c3aed] hidden sm:block transition-all duration-1000"
            style={{
              width: `${(timelineSteps.filter(s => s.completed).length / timelineSteps.length) * 100}%`,
              boxShadow: '0 0 8px rgba(124, 58, 237, 0.5)',
            }}
          />

          {/* Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0">
            {timelineSteps.map((step, index) => (
              <div key={step.label} className="flex flex-col items-center relative">
                {/* Step circle */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.15 }}
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                    step.completed
                      ? 'bg-[#7c3aed] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                      : 'bg-[#1e293b] text-[#64748b] border border-[#334155]'
                  }`}
                >
                  {step.completed ? step.icon : <span className="text-xs font-bold">{index + 1}</span>}
                </motion.div>
                <span className={`text-xs text-center font-medium ${step.completed ? 'text-[#a78bfa]' : 'text-[#64748b]'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status message */}
        <div className="rounded-xl p-4 border" style={{
          backgroundColor: currentStatus ? statusConfig[currentStatus].bg : 'rgba(30, 41, 59, 0.5)',
          borderColor: currentStatus ? `${statusConfig[currentStatus].color}30` : 'rgba(51, 65, 85, 0.5)',
        }}>
          <div className="flex items-center gap-3">
            {currentStatus ? (
              <>
                <div style={{ color: statusConfig[currentStatus].color }}>
                  {statusConfig[currentStatus].icon}
                </div>
                <div>
                  <p className="font-medium text-white text-sm">
                    Estado: <span style={{ color: statusConfig[currentStatus].color }}>
                      {statusConfig[currentStatus].label}
                    </span>
                  </p>
                  <p className="text-xs text-[#94a3b8] mt-0.5">
                    {currentStatus === 'PENDING' && 'Tu solicitud está siendo revisada por el equipo de staff. Te notificaremos cuando haya una decisión.'}
                    {currentStatus === 'APPROVED' && '¡Felicidades! Has sido aprobado para la whitelist. Ya puedes acceder al servidor.'}
                    {currentStatus === 'REJECTED' && 'Tu solicitud ha sido rechazada. Puedes revisar el motivo abajo y volver a intentar.'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-[#64748b]"><AlertCircle className="w-5 h-5" /></div>
                <div>
                  <p className="font-medium text-white text-sm">Sin solicitud</p>
                  <p className="text-xs text-[#94a3b8] mt-0.5">Aún no has enviado una solicitud de whitelist. ¡Envía una para unirte al servidor!</p>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Application History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-[#0f172a] rounded-2xl p-6 sm:p-8 neon-border"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#7c3aed]" />
          Historial de Solicitudes
        </h3>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-16 rounded-lg bg-[#1e293b] animate-pulse" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-10 h-10 text-[#64748b]/30 mx-auto mb-3" />
            <p className="text-[#64748b] text-sm">No tienes solicitudes de whitelist</p>
            {canApply && (
              <Button
                onClick={() => navigate('whitelist')}
                variant="outline"
                className="mt-4 border-[#7c3aed]/30 text-[#7c3aed] hover:bg-[#7c3aed]/10"
              >
                Enviar solicitud <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app, index) => {
              const config = statusConfig[app.status]
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4 p-4 rounded-xl border"
                  style={{
                    backgroundColor: config.bg,
                    borderColor: `${config.color}20`,
                  }}
                >
                  {/* Status icon */}
                  <div className="shrink-0" style={{ color: config.color }}>
                    {config.icon}
                  </div>

                  {/* App info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-white">
                        Intento #{app.attemptNumber}
                      </span>
                      <Badge
                        className="text-[10px] px-1.5 py-0 border"
                        style={{
                          backgroundColor: `${config.color}20`,
                          borderColor: `${config.color}40`,
                          color: config.color,
                        }}
                      >
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#94a3b8]">
                      {new Date(app.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                    {app.rejectReason && (
                      <p className="text-xs text-[#ef4444] mt-1 bg-[#ef4444]/5 rounded px-2 py-1">
                        Motivo: {app.rejectReason}
                      </p>
                    )}
                    {app.reviewer && (
                      <p className="text-xs text-[#64748b] mt-0.5">
                        Revisado por: {app.reviewer.username}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Attempts remaining */}
        {!hasApproved && (
          <div className="mt-4 pt-4 border-t border-[#1e293b]">
            <p className="text-xs text-[#64748b] flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Intentos restantes: <span className="text-white font-medium">{2 - rejectedCount} de 2</span>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
