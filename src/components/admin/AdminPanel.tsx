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
      <h2 className="mb-4 text-xl font-bold text-white neon-text-glow">
        Panel de Administración
      </h2>

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
            <div className="py-12 text-center text-gray-500">Cargando métricas...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-lg neon-border bg-[#0f172a] p-4 flex flex-col items-center gap-2 text-center"
                >
                  <card.icon className={`size-8 ${card.color}`} />
                  <span className="text-3xl font-bold text-white">{card.value}</span>
                  <span className="text-xs text-gray-400">{card.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Simple bar visualization */}
          {stats && stats.totalApps > 0 && (
            <div className="mt-6 rounded-lg neon-border bg-[#0f172a] p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-400">Distribución de Whitelist</h3>
              <div className="flex items-end gap-4 h-40">
                {[
                  { label: 'Aprobadas', value: stats.approvedApps, color: 'bg-green-500' },
                  { label: 'Pendientes', value: stats.pendingApps, color: 'bg-yellow-500' },
                  { label: 'Rechazadas', value: stats.rejectedApps, color: 'bg-red-500' },
                ].map((bar) => {
                  const maxVal = Math.max(stats.approvedApps, stats.pendingApps, stats.rejectedApps, 1)
                  const heightPct = (bar.value / maxVal) * 100
                  return (
                    <div key={bar.label} className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-xs text-white font-medium">{bar.value}</span>
                      <div className="w-full flex justify-center" style={{ height: `${heightPct}%` }}>
                        <div
                          className={`w-12 ${bar.color} rounded-t-md transition-all`}
                          style={{ height: '100%', boxShadow: `0 0 10px ${bar.color === 'bg-green-500' ? 'rgba(34,197,94,0.3)' : bar.color === 'bg-yellow-500' ? 'rgba(234,179,8,0.3)' : 'rgba(239,68,68,0.3)'}` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500">{bar.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
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
