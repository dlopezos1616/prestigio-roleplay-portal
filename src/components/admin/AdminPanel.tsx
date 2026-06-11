'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  BarChart3, Users, Image as ImageIcon, Shield,
  Trash2, Download, Upload, Plus,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Stats {
  totalUsers: number
  pendingApps: number
  approvedApps: number
  rejectedApps: number
  activeTasks: number
  totalApps: number
}

interface UserRecord {
  id: string
  discordId: string
  username: string
  avatar: string | null
  role: string
  createdAt: string
}

interface GalleryImage {
  id: string
  url: string
  title: string | null
  description: string | null
  eventTag: string | null
  uploadedById: string
  createdAt: string
  uploadedBy?: { username: string }
}

interface AuditLog {
  id: string
  actorId: string
  action: string
  entityType: string | null
  entityId: string | null
  metadata: string | null
  createdAt: string
  actor: { username: string; avatar: string | null }
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

const roleBadge: Record<string, string> = {
  ADMIN: 'bg-red-500/20 text-red-400 border-red-500/40',
  STAFF: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
  USER: 'bg-gray-500/20 text-gray-400 border-gray-500/40',
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function AdminPanel() {
  /* ---- Stats state ---- */
  const [stats, setStats] = useState<Stats | null>(null)

  /* ---- Users state ---- */
  const [users, setUsers] = useState<UserRecord[]>([])
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null)

  /* ---- Gallery state ---- */
  const [images, setImages] = useState<GalleryImage[]>([])
  const [galleryForm, setGalleryForm] = useState({ url: '', title: '', description: '', eventTag: '' })
  const [galleryTagFilter, setGalleryTagFilter] = useState('')

  /* ---- Audit state ---- */
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [auditDate, setAuditDate] = useState(todayStr())
  const [auditActorFilter, setAuditActorFilter] = useState('')

  /* ---- Fetchers ---- */
  const fetchStats = useCallback(async () => {
    const res = await fetch('/api/stats')
    if (res.ok) setStats(await res.json())
  }, [])

  const fetchUsers = useCallback(async () => {
    const res = await fetch('/api/users')
    if (res.ok) setUsers(await res.json())
  }, [])

  const fetchGallery = useCallback(async () => {
    const q = galleryTagFilter ? `?tag=${galleryTagFilter}` : ''
    const res = await fetch(`/api/gallery${q}`)
    if (res.ok) setImages(await res.json())
  }, [galleryTagFilter])

  const fetchAudit = useCallback(async () => {
    let q = `?date=${auditDate}`
    if (auditActorFilter) q += `&actorId=${auditActorFilter}`
    const res = await fetch(`/api/audit${q}`)
    if (res.ok) setAuditLogs(await res.json())
  }, [auditDate, auditActorFilter])

  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { fetchUsers() }, [fetchUsers])
  useEffect(() => { fetchGallery() }, [fetchGallery])
  useEffect(() => { fetchAudit() }, [fetchAudit])

  /* ---- User actions ---- */
  async function changeRole(userId: string, newRole: string) {
    setRoleUpdating(userId)
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      fetchUsers()
    } finally {
      setRoleUpdating(null)
    }
  }

  /* ---- Gallery actions ---- */
  async function uploadImage() {
    if (!galleryForm.url.trim()) return
    await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...galleryForm, uploadedById: 'admin-user' }),
    })
    setGalleryForm({ url: '', title: '', description: '', eventTag: '' })
    fetchGallery()
  }

  async function deleteImage(id: string) {
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    fetchGallery()
  }

  /* ---- CSV Export ---- */
  function exportCSV() {
    const headers = ['Staff', 'Acción', 'Entidad', 'ID Entidad', 'Metadata', 'Fecha/Hora']
    const rows = auditLogs.map((l) => [
      l.actor.username,
      l.action,
      l.entityType || '',
      l.entityId || '',
      l.metadata ? `"${l.metadata.replace(/"/g, '""')}"` : '',
      new Date(l.createdAt).toISOString(),
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-${auditDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  /* ---- Stat cards ---- */
  const statCards = stats
    ? [
        { label: 'Total Usuarios', value: stats.totalUsers, icon: Users, color: 'text-[#a78bfa]' },
        { label: 'WL Pendientes', value: stats.pendingApps, icon: Shield, color: 'text-yellow-400' },
        { label: 'WL Aprobadas', value: stats.approvedApps, icon: Shield, color: 'text-green-400' },
        { label: 'WL Rechazadas', value: stats.rejectedApps, icon: Shield, color: 'text-red-400' },
        { label: 'Tareas Activas', value: stats.activeTasks, icon: BarChart3, color: 'text-cyan-400' },
      ]
    : []

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="rounded-xl neon-border bg-bg-card p-4 md:p-6">
      <Tabs defaultValue="metrics" className="w-full">
        {/* ---- Tab navigation ---- */}
        <TabsList className="mb-4 flex w-full flex-wrap gap-1 bg-[#0f172a] p-1 rounded-lg border border-[rgba(124,58,237,0.3)]">
          <TabsTrigger
            value="metrics"
            className="data-[state=active]:neon-glow data-[state=active]:bg-[rgba(124,58,237,0.2)] data-[state=active]:text-[#a78bfa] flex items-center gap-1.5 text-sm text-gray-400 transition-all"
          >
            <BarChart3 className="size-4" /> Métricas
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:neon-glow data-[state=active]:bg-[rgba(124,58,237,0.2)] data-[state=active]:text-[#a78bfa] flex items-center gap-1.5 text-sm text-gray-400 transition-all"
          >
            <Users className="size-4" /> Gestión de Usuarios
          </TabsTrigger>
          <TabsTrigger
            value="gallery"
            className="data-[state=active]:neon-glow data-[state=active]:bg-[rgba(124,58,237,0.2)] data-[state=active]:text-[#a78bfa] flex items-center gap-1.5 text-sm text-gray-400 transition-all"
          >
            <ImageIcon className="size-4" /> Galería
          </TabsTrigger>
          <TabsTrigger
            value="audit"
            className="data-[state=active]:neon-glow data-[state=active]:bg-[rgba(124,58,237,0.2)] data-[state=active]:text-[#a78bfa] flex items-center gap-1.5 text-sm text-gray-400 transition-all"
          >
            <Shield className="size-4" /> Auditoría
          </TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/* TAB 1 – Métricas                                             */}
        {/* ============================================================ */}
        <TabsContent value="metrics">
          {!stats ? (
            <div className="py-12 text-center text-gray-500">
              <BarChart3 className="mx-auto size-10 mb-3 opacity-30" />
              Cargando métricas...
            </div>
          ) : (
            <>
              {/* Stat Cards with trend indicators */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {statCards.map((card, i) => {
                  const trend = [12, -3, 8, -5, 15][i] // mock trends
                  return (
                    <div
                      key={card.label}
                      className="rounded-lg neon-border bg-[#0f172a] p-4 flex flex-col items-center gap-2 text-center card-lift shimmer-sweep relative overflow-hidden"
                    >
                      <div className="absolute top-2 right-2 flex items-center gap-0.5 text-[10px] font-medium">
                        {trend > 0 ? (
                          <span className="text-green-400 flex items-center gap-0.5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            +{trend}%
                          </span>
                        ) : (
                          <span className="text-red-400 flex items-center gap-0.5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                            {trend}%
                          </span>
                        )}
                      </div>
                      <card.icon className={`size-8 ${card.color}`} />
                      <span className="text-3xl font-bold text-white">{card.value}</span>
                      <span className="text-xs text-gray-400">{card.label}</span>
                      {/* Mini sparkline */}
                      <svg className="w-full h-6 mt-1" viewBox="0 0 80 24" preserveAspectRatio="none">
                        <path
                          d={[0,10,15,8,25,18,35,12,45,6,55,15,65,10,80,14][i] ? `M0,${24 - [0,10,15,8,25,18,35,12,45,6,55,15,65,10,80,14][i]} L10,${24 - [8,14,10,18,12,6,14,20,10,16,8,12,18,14,6,10][i]} L20,${24 - [12,6,18,10,8,14,6,12,18,8,14,6,10,8,12,16][i]} L30,${24 - [8,12,8,14,18,10,12,6,14,12,10,18,6,12,14,8][i]} L40,${24 - [14,18,12,6,10,16,8,14,6,18,12,10,14,6,8,12][i]} L50,${24 - [6,10,16,12,14,8,18,10,12,14,6,12,10,14,6,10][i]} L60,${24 - [10,14,6,18,8,12,10,16,14,8,16,14,12,10,10,14][i]} L70,${24 - [16,8,14,10,12,6,8,12,10,14,8,6,16,12,14,8][i]} L80,${24 - [12,12,10,14,6,10,14,8,12,6,14,10,8,14,12,10][i]}`
                          : 'M0,12 L80,12'}
                          stroke={card.color.replace('text-', '').replace('400', '500')}
                          fill="none"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                          className="opacity-50"
                        />
                      </svg>
                    </div>
                  )
                })}
              </div>

              {/* Two-column charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                {/* Whitelist Distribution - Enhanced bar chart */}
                <div className="rounded-lg neon-border bg-[#0f172a] p-5">
                  <h3 className="mb-4 text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full bg-[#7c3aed]" />
                    Distribución de Whitelist
                  </h3>
                  {stats.totalApps > 0 ? (
                    <div className="space-y-3">
                      {[
                        { label: 'Aprobadas', value: stats.approvedApps, total: stats.totalApps, color: '#22c55e', bg: 'bg-green-500/10' },
                        { label: 'Pendientes', value: stats.pendingApps, total: stats.totalApps, color: '#eab308', bg: 'bg-yellow-500/10' },
                        { label: 'Rechazadas', value: stats.rejectedApps, total: stats.totalApps, color: '#ef4444', bg: 'bg-red-500/10' },
                      ].map((bar) => {
                        const pct = stats.totalApps > 0 ? Math.round((bar.value / stats.totalApps) * 100) : 0
                        return (
                          <div key={bar.label} className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">{bar.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">{bar.value}</span>
                                <span className="text-[10px] text-gray-500">({pct}%)</span>
                              </div>
                            </div>
                            <div className="h-3 rounded-full bg-[#1e293b] overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${Math.max(pct, 2)}%`,
                                  backgroundColor: bar.color,
                                  boxShadow: `0 0 10px ${bar.color}40`,
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500 text-sm">
                      <Shield className="mx-auto size-6 mb-2 opacity-30" />
                      No hay solicitudes aún
                    </div>
                  )}
                </div>

                {/* Activity Heatmap - Last 7 days */}
                <div className="rounded-lg neon-border bg-[#0f172a] p-5">
                  <h3 className="mb-4 text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full bg-[#06b6d4]" />
                    Actividad Semanal
                  </h3>
                  <div className="space-y-2">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, i) => {
                      const activity = [45, 62, 38, 78, 92, 85, 55][i]
                      const hours = [4.2, 5.8, 3.5, 7.3, 8.6, 7.9, 5.1][i]
                      return (
                        <div key={day} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-8">{day}</span>
                          <div className="flex-1 h-7 rounded bg-[#1e293b] overflow-hidden relative">
                            <div
                              className="h-full rounded transition-all duration-500"
                              style={{
                                width: `${activity}%`,
                                background: `linear-gradient(90deg, rgba(124,58,237,0.4), rgba(6,182,212,0.6))`,
                                boxShadow: activity > 70 ? '0 0 15px rgba(6,182,212,0.3)' : 'none',
                              }}
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                              {hours}h
                            </span>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <div
                                key={j}
                                className="w-2 h-4 rounded-[1px]"
                                style={{
                                  backgroundColor: j < Math.ceil(activity / 20)
                                    ? `rgba(6,182,212,${0.3 + j * 0.15})`
                                    : 'rgba(30,41,59,0.5)',
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-[rgba(124,58,237,0.1)] flex items-center justify-between">
                    <span className="text-[10px] text-gray-600">Menos</span>
                    <div className="flex gap-1">
                      {['rgba(30,41,59,0.5)', 'rgba(6,182,212,0.2)', 'rgba(6,182,212,0.4)', 'rgba(6,182,212,0.6)', 'rgba(6,182,212,0.8)'].map((c, i) => (
                        <div key={i} className="w-3 h-3 rounded-[1px]" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-600">Más</span>
                  </div>
                </div>
              </div>

              {/* Server Health Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[
                  { label: 'Uptime', value: '99.7%', status: 'good', icon: '⚡' },
                  { label: 'Latencia', value: '42ms', status: 'good', icon: '📶' },
                  { label: 'TPS', value: '58.3', status: 'good', icon: '🔄' },
                  { label: 'Memoria', value: '67%', status: 'warn', icon: '💾' },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-lg bg-[#0f172a] border border-[rgba(124,58,237,0.15)] p-3 text-center">
                    <div className="text-lg mb-1">{metric.icon}</div>
                    <div className="text-lg font-bold text-white">{metric.value}</div>
                    <div className="text-[10px] text-gray-500">{metric.label}</div>
                    <div className={`mt-1.5 h-1 rounded-full ${metric.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ boxShadow: `0 0 6px ${metric.status === 'good' ? 'rgba(34,197,94,0.4)' : 'rgba(234,179,8,0.4)'}` }} />
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 2 – Gestión de Usuarios                                  */}
        {/* ============================================================ */}
        <TabsContent value="users">
          <div className="overflow-x-auto rounded-lg border border-[rgba(124,58,237,0.2)]">
            <Table>
              <TableHeader>
                <TableRow className="border-[rgba(124,58,237,0.2)] hover:bg-transparent">
                  <TableHead className="text-gray-400">Username</TableHead>
                  <TableHead className="text-gray-400">Discord ID</TableHead>
                  <TableHead className="text-gray-400">Rol</TableHead>
                  <TableHead className="text-gray-400">Fecha Registro</TableHead>
                  <TableHead className="text-gray-400">Cambiar Rol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      No hay usuarios
                    </TableCell>
                  </TableRow>
                )}
                {users.map((user) => (
                  <TableRow key={user.id} className="border-[rgba(124,58,237,0.15)] hover:bg-[rgba(124,58,237,0.05)]">
                    <TableCell className="font-medium text-white">{user.username}</TableCell>
                    <TableCell className="text-gray-400 text-xs font-mono">{user.discordId}</TableCell>
                    <TableCell>
                      <Badge className={`${roleBadge[user.role] || roleBadge.USER} border text-xs`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">{fmtDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(v) => changeRole(user.id, v)}
                        disabled={roleUpdating === user.id}
                      >
                        <SelectTrigger className="h-8 w-28 text-xs bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0f172a] border-[rgba(124,58,237,0.3)]">
                          {['USER', 'STAFF', 'ADMIN'].map((r) => (
                            <SelectItem key={r} value={r} className="text-white focus:bg-[rgba(124,58,237,0.2)]">
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 3 – Galería                                              */}
        {/* ============================================================ */}
        <TabsContent value="gallery">
          {/* Upload form */}
          <div className="mb-6 rounded-lg neon-border bg-[#0f172a] p-4 space-y-3">
            <h3 className="text-sm font-semibold text-[#a78bfa]">Subir Imagen</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="URL de la imagen *"
                value={galleryForm.url}
                onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                className="bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white"
              />
              <Input
                placeholder="Título (opcional)"
                value={galleryForm.title}
                onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                className="bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white"
              />
              <Input
                placeholder="Descripción (opcional)"
                value={galleryForm.description}
                onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                className="bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white"
              />
              <Input
                placeholder="Evento / Tag (opcional)"
                value={galleryForm.eventTag}
                onChange={(e) => setGalleryForm({ ...galleryForm, eventTag: e.target.value })}
                className="bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white"
              />
            </div>
            <Button size="sm" className="neon-glow" onClick={uploadImage} disabled={!galleryForm.url.trim()}>
              <Upload className="size-4 mr-1" /> Subir
            </Button>
          </div>

          {/* Tag filter */}
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm text-gray-400">Filtrar por tag:</span>
            <Input
              placeholder="Tag..."
              value={galleryTagFilter}
              onChange={(e) => setGalleryTagFilter(e.target.value)}
              className="w-40 bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white h-8 text-sm"
            />
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                <ImageIcon className="mx-auto size-8 mb-2 opacity-40" />
                No hay imágenes en la galería
              </div>
            )}
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-lg neon-border bg-[#0f172a]"
              >
                <img
                  src={img.url}
                  alt={img.title || 'Gallery image'}
                  className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.title && <p className="text-xs font-medium text-white truncate">{img.title}</p>}
                  {img.eventTag && (
                    <Badge className="mt-1 bg-[rgba(124,58,237,0.3)] text-[#a78bfa] border-0 text-[10px]">
                      {img.eventTag}
                    </Badge>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 size-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteImage(img.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 4 – Auditoría                                            */}
        {/* ============================================================ */}
        <TabsContent value="audit">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Input
              type="date"
              value={auditDate}
              onChange={(e) => setAuditDate(e.target.value)}
              className="w-44 bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white"
            />
            <Input
              placeholder="Filtrar por actor ID"
              value={auditActorFilter}
              onChange={(e) => setAuditActorFilter(e.target.value)}
              className="w-48 bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white h-9 text-sm"
            />
            <Button size="sm" variant="outline" onClick={exportCSV} disabled={auditLogs.length === 0}>
              <Download className="size-4 mr-1" /> Exportar CSV
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[rgba(124,58,237,0.2)]">
            <Table>
              <TableHeader>
                <TableRow className="border-[rgba(124,58,237,0.2)] hover:bg-transparent">
                  <TableHead className="text-gray-400">Staff</TableHead>
                  <TableHead className="text-gray-400">Acción</TableHead>
                  <TableHead className="text-gray-400">Entidad</TableHead>
                  <TableHead className="text-gray-400">ID Entidad</TableHead>
                  <TableHead className="text-gray-400">Metadata</TableHead>
                  <TableHead className="text-gray-400">Fecha/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      No hay registros de auditoría para los filtros seleccionados
                    </TableCell>
                  </TableRow>
                )}
                {auditLogs.map((log) => (
                  <TableRow key={log.id} className="border-[rgba(124,58,237,0.15)] hover:bg-[rgba(124,58,237,0.05)]">
                    <TableCell className="font-medium text-white">{log.actor.username}</TableCell>
                    <TableCell className="text-cyan-400 text-sm">{log.action}</TableCell>
                    <TableCell className="text-gray-400 text-sm">{log.entityType || '—'}</TableCell>
                    <TableCell className="text-gray-500 text-xs font-mono">{log.entityId ? log.entityId.slice(0, 12) + '…' : '—'}</TableCell>
                    <TableCell className="text-gray-500 text-xs max-w-[160px] truncate">
                      {log.metadata ? log.metadata.slice(0, 60) : '—'}
                    </TableCell>
                    <TableCell className="text-gray-500 text-xs">{fmtDate(log.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
