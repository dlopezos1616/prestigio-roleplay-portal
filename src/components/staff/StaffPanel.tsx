'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Inbox, ClipboardList, Activity, Bell,
  CheckCircle2, XCircle, Clock, Eye,
  Plus, Trash2, BellOff,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface WhitelistApp {
  id: string
  userId: string
  answer1: string
  answer2: string
  answer3: string
  answer4: string
  answer5: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  attemptNumber: number
  rejectReason?: string | null
  createdAt: string
  user: { username: string; avatar: string | null; discordId: string }
  reviewer?: { username: string } | null
}

interface Task {
  id: string
  title: string
  assigneeId: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: string | null
  notes: string | null
  date: string
  createdAt: string
  assignee: { username: string; avatar: string | null } | null
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

interface Notification {
  id: string
  userId: string
  type: string
  payload: string | null
  readAt: string | null
  createdAt: string
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  APPROVED: 'bg-green-500/20 text-green-400 border-green-500/40',
  REJECTED: 'bg-red-500/20 text-red-400 border-red-500/40',
}

const taskStatusColor: Record<string, string> = {
  TODO: 'bg-gray-500/20 text-gray-400 border-gray-500/40',
  IN_PROGRESS: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
  DONE: 'bg-green-500/20 text-green-400 border-green-500/40',
  BLOCKED: 'bg-red-500/20 text-red-400 border-red-500/40',
}

const priorityColor: Record<string, string> = {
  LOW: 'bg-gray-500/20 text-gray-400 border-gray-500/40',
  MEDIUM: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  URGENT: 'bg-red-500/20 text-red-400 border-red-500/40',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function StaffPanel() {
  /* ---- Whitelist state ---- */
  const [apps, setApps] = useState<WhitelistApp[]>([])
  const [wlFilter, setWlFilter] = useState<string>('ALL')
  const [selectedApp, setSelectedApp] = useState<WhitelistApp | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  /* ---- Tasks state ---- */
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskDate, setTaskDate] = useState(todayStr())
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', priority: 'MEDIUM' as const, notes: '' })

  /* ---- Audit state ---- */
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [auditDate, setAuditDate] = useState(todayStr())

  /* ---- Notifications state ---- */
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notifUserId] = useState('demo-user')

  /* ---- Fetchers ---- */
  const fetchApps = useCallback(async () => {
    const q = wlFilter !== 'ALL' ? `?status=${wlFilter}` : ''
    const res = await fetch(`/api/whitelist${q}`)
    if (res.ok) setApps(await res.json())
  }, [wlFilter])

  const fetchTasks = useCallback(async () => {
    const res = await fetch(`/api/tasks?date=${taskDate}`)
    if (res.ok) setTasks(await res.json())
  }, [taskDate])

  const fetchAudit = useCallback(async () => {
    const res = await fetch(`/api/audit?date=${auditDate}`)
    if (res.ok) setAuditLogs(await res.json())
  }, [auditDate])

  const fetchNotifications = useCallback(async () => {
    const res = await fetch(`/api/notifications?userId=${notifUserId}`)
    if (res.ok) setNotifications(await res.json())
  }, [notifUserId])

  useEffect(() => { fetchApps() }, [fetchApps])
  useEffect(() => { fetchTasks() }, [fetchTasks])
  useEffect(() => { fetchAudit() }, [fetchAudit])
  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  /* ---- Whitelist actions ---- */
  async function handleReview(appId: string, status: 'APPROVED' | 'REJECTED') {
    setActionLoading(true)
    try {
      const body: Record<string, unknown> = { status, reviewerId: 'staff-user' }
      if (status === 'REJECTED' && rejectReason) body.rejectReason = rejectReason
      await fetch(`/api/whitelist/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setSelectedApp(null)
      setRejectReason('')
      fetchApps()
    } finally {
      setActionLoading(false)
    }
  }

  /* ---- Task actions ---- */
  async function addTask() {
    if (!newTask.title.trim()) return
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, date: taskDate }),
    })
    setNewTask({ title: '', priority: 'MEDIUM', notes: '' })
    setShowTaskForm(false)
    fetchTasks()
  }

  async function updateTask(id: string, data: Partial<Task>) {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    fetchTasks()
  }

  async function deleteTask(id: string) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    fetchTasks()
  }

  /* ---- Notification actions ---- */
  async function markRead(notificationId?: string) {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationId ? { notificationId } : { userId: notifUserId }),
    })
    fetchNotifications()
  }

  const unreadCount = notifications.filter((n) => !n.readAt).length

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="rounded-xl neon-border bg-bg-card p-4 md:p-6">
      <h2 className="mb-4 text-xl font-bold text-white neon-text-glow">
        Panel de Staff
      </h2>

      <Tabs defaultValue="whitelist" className="w-full">
        {/* ---- Tab navigation ---- */}
        <TabsList className="mb-4 flex w-full flex-wrap gap-1 bg-[#0f172a] p-1 rounded-lg border border-[rgba(124,58,237,0.3)]">
          <TabsTrigger
            value="whitelist"
            className="data-[state=active]:neon-glow data-[state=active]:bg-[rgba(124,58,237,0.2)] data-[state=active]:text-[#a78bfa] flex items-center gap-1.5 text-sm text-gray-400 transition-all"
          >
            <Inbox className="size-4" /> Whitelist Inbox
            {apps.filter((a) => a.status === 'PENDING').length > 0 && (
              <span className="ml-1 rounded-full bg-yellow-500/30 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400">
                {apps.filter((a) => a.status === 'PENDING').length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:neon-glow data-[state=active]:bg-[rgba(124,58,237,0.2)] data-[state=active]:text-[#a78bfa] flex items-center gap-1.5 text-sm text-gray-400 transition-all"
          >
            <ClipboardList className="size-4" /> Tareas Diarias
          </TabsTrigger>
          <TabsTrigger
            value="audit"
            className="data-[state=active]:neon-glow data-[state=active]:bg-[rgba(124,58,237,0.2)] data-[state=active]:text-[#a78bfa] flex items-center gap-1.5 text-sm text-gray-400 transition-all"
          >
            <Activity className="size-4" /> Actividad del Staff
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:neon-glow data-[state=active]:bg-[rgba(124,58,237,0.2)] data-[state=active]:text-[#a78bfa] flex items-center gap-1.5 text-sm text-gray-400 transition-all"
          >
            <Bell className="size-4" /> Notificaciones
            {unreadCount > 0 && (
              <span className="ml-1 rounded-full bg-red-500/30 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/* TAB 1 – Whitelist Inbox                                      */}
        {/* ============================================================ */}
        <TabsContent value="whitelist">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-400">Filtrar:</span>
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
              <Button
                key={s}
                size="sm"
                variant={wlFilter === s ? 'default' : 'outline'}
                className={wlFilter === s ? 'neon-glow' : ''}
                onClick={() => setWlFilter(s)}
              >
                {s === 'ALL' ? 'Todos' : s === 'PENDING' ? 'Pendientes' : s === 'APPROVED' ? 'Aprobados' : 'Rechazados'}
              </Button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border border-[rgba(124,58,237,0.2)]">
            <Table>
              <TableHeader>
                <TableRow className="border-[rgba(124,58,237,0.2)] hover:bg-transparent">
                  <TableHead className="text-gray-400">Usuario</TableHead>
                  <TableHead className="text-gray-400">Intento</TableHead>
                  <TableHead className="text-gray-400">Estado</TableHead>
                  <TableHead className="text-gray-400">Fecha</TableHead>
                  <TableHead className="text-gray-400">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      No hay solicitudes de whitelist
                    </TableCell>
                  </TableRow>
                )}
                {apps.map((app) => (
                  <TableRow key={app.id} className="border-[rgba(124,58,237,0.15)] hover:bg-[rgba(124,58,237,0.05)]">
                    <TableCell className="font-medium text-white">{app.user.username}</TableCell>
                    <TableCell className="text-gray-400">#{app.attemptNumber}</TableCell>
                    <TableCell>
                      <Badge className={`${statusColor[app.status]} border text-xs`}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">{fmtDate(app.createdAt)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedApp(app); setRejectReason('') }}>
                        <Eye className="size-4 mr-1" /> Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Application detail dialog */}
          <Dialog open={!!selectedApp} onOpenChange={(o) => { if (!o) setSelectedApp(null) }}>
            <DialogContent className="bg-bg-card neon-border max-h-[85vh] overflow-y-auto sm:max-w-2xl">
              {selectedApp && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-white neon-text-glow">
                      Solicitud de {selectedApp.user.username}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Intento #{selectedApp.attemptNumber} &middot; Discord: {selectedApp.user.discordId}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    {[
                      { q: '¿Qué es el Power Gaming?', a: selectedApp.answer1 },
                      { q: '¿Qué es el Meta Gaming?', a: selectedApp.answer2 },
                      { q: 'Diferencia entre OOC e IC', a: selectedApp.answer3 },
                      { q: '¿Qué son NVL y VDM?', a: selectedApp.answer4 },
                      { q: 'Escenario de decisión difícil', a: selectedApp.answer5 },
                    ].map((item, i) => (
                      <div key={i} className="rounded-lg border border-[rgba(124,58,237,0.2)] p-3">
                        <p className="text-sm font-semibold text-[#a78bfa]">{item.q}</p>
                        <p className="mt-1 text-sm text-gray-300">{item.a}</p>
                      </div>
                    ))}
                  </div>

                  {selectedApp.status === 'PENDING' && (
                    <div className="space-y-3 pt-2">
                      <Textarea
                        placeholder="Razón de rechazo (obligatorio si rechazas)..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white placeholder:text-gray-600 min-h-[80px]"
                      />
                      <DialogFooter className="gap-2">
                        <Button
                          variant="destructive"
                          disabled={actionLoading || !rejectReason.trim()}
                          onClick={() => handleReview(selectedApp.id, 'REJECTED')}
                        >
                          <XCircle className="size-4 mr-1" /> Rechazar
                        </Button>
                        <Button
                          disabled={actionLoading}
                          onClick={() => handleReview(selectedApp.id, 'APPROVED')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle2 className="size-4 mr-1" /> Aprobar
                        </Button>
                      </DialogFooter>
                    </div>
                  )}

                  {selectedApp.status !== 'PENDING' && (
                    <div className="flex items-center gap-2 pt-2">
                      <Badge className={`${statusColor[selectedApp.status]} border`}>
                        {selectedApp.status}
                      </Badge>
                      {selectedApp.rejectReason && (
                        <span className="text-sm text-red-400">Razón: {selectedApp.rejectReason}</span>
                      )}
                    </div>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 2 – Tareas Diarias                                       */}
        {/* ============================================================ */}
        <TabsContent value="tasks">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="w-44 bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white"
            />
            <Button size="sm" className="neon-glow" onClick={() => setShowTaskForm(true)}>
              <Plus className="size-4 mr-1" /> Nueva Tarea
            </Button>
          </div>

          {showTaskForm && (
            <div className="mb-4 rounded-lg neon-border p-4 space-y-3 bg-[#0f172a]">
              <Input
                placeholder="Título de la tarea"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white"
              />
              <div className="flex flex-wrap gap-3">
                <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as Task['priority'] })}>
                  <SelectTrigger className="w-36 bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f172a] border-[rgba(124,58,237,0.3)]">
                    {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
                      <SelectItem key={p} value={p} className="text-white focus:bg-[rgba(124,58,237,0.2)]">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Notas (opcional)"
                  value={newTask.notes}
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  className="flex-1 bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white min-w-[180px]"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="neon-glow" onClick={addTask}>Crear</Button>
                <Button size="sm" variant="outline" onClick={() => setShowTaskForm(false)}>Cancelar</Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-[rgba(124,58,237,0.2)]">
            <Table>
              <TableHeader>
                <TableRow className="border-[rgba(124,58,237,0.2)] hover:bg-transparent">
                  <TableHead className="text-gray-400">Tarea</TableHead>
                  <TableHead className="text-gray-400">Responsable</TableHead>
                  <TableHead className="text-gray-400">Prioridad</TableHead>
                  <TableHead className="text-gray-400">Estado</TableHead>
                  <TableHead className="text-gray-400">Notas</TableHead>
                  <TableHead className="text-gray-400">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      No hay tareas para esta fecha
                    </TableCell>
                  </TableRow>
                )}
                {tasks.map((task) => (
                  <TableRow key={task.id} className="border-[rgba(124,58,237,0.15)] hover:bg-[rgba(124,58,237,0.05)]">
                    <TableCell className="font-medium text-white">{task.title}</TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {task.assignee?.username || '—'}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.priority}
                        onValueChange={(v) => updateTask(task.id, { priority: v as Task['priority'] })}
                      >
                        <SelectTrigger className="h-7 w-24 text-xs bg-transparent border-0 p-0">
                          <Badge className={`${priorityColor[task.priority]} border text-[10px]`}>
                            {task.priority}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent className="bg-[#0f172a] border-[rgba(124,58,237,0.3)]">
                          {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
                            <SelectItem key={p} value={p} className="text-white focus:bg-[rgba(124,58,237,0.2)]">{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.status}
                        onValueChange={(v) => updateTask(task.id, { status: v as Task['status'] })}
                      >
                        <SelectTrigger className="h-7 w-28 text-xs bg-transparent border-0 p-0">
                          <Badge className={`${taskStatusColor[task.status]} border text-[10px]`}>
                            {task.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent className="bg-[#0f172a] border-[rgba(124,58,237,0.3)]">
                          {['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'].map((s) => (
                            <SelectItem key={s} value={s} className="text-white focus:bg-[rgba(124,58,237,0.2)]">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-gray-500 text-xs max-w-[140px] truncate">
                      {task.notes || '—'}
                    </TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => deleteTask(task.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 3 – Actividad del Staff                                  */}
        {/* ============================================================ */}
        <TabsContent value="audit">
          <div className="mb-4 flex items-center gap-3">
            <Input
              type="date"
              value={auditDate}
              onChange={(e) => setAuditDate(e.target.value)}
              className="w-44 bg-[#0f172a] border-[rgba(124,58,237,0.3)] text-white"
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-[rgba(124,58,237,0.2)]">
            <Table>
              <TableHeader>
                <TableRow className="border-[rgba(124,58,237,0.2)] hover:bg-transparent">
                  <TableHead className="text-gray-400">Staff</TableHead>
                  <TableHead className="text-gray-400">Acción</TableHead>
                  <TableHead className="text-gray-400">Entidad</TableHead>
                  <TableHead className="text-gray-400">Fecha/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      No hay registros de actividad para esta fecha
                    </TableCell>
                  </TableRow>
                )}
                {auditLogs.map((log) => (
                  <TableRow key={log.id} className="border-[rgba(124,58,237,0.15)] hover:bg-[rgba(124,58,237,0.05)]">
                    <TableCell className="font-medium text-white">{log.actor.username}</TableCell>
                    <TableCell className="text-cyan-400 text-sm">{log.action}</TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {log.entityType ? `${log.entityType}${log.entityId ? ` #${log.entityId.slice(0, 8)}` : ''}` : '—'}
                    </TableCell>
                    <TableCell className="text-gray-500 text-xs">{fmtDate(log.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 4 – Notificaciones                                       */}
        {/* ============================================================ */}
        <TabsContent value="notifications">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo leído'}
            </span>
            {unreadCount > 0 && (
              <Button size="sm" variant="outline" onClick={() => markRead()}>
                <BellOff className="size-4 mr-1" /> Marcar todo leído
              </Button>
            )}
          </div>

          <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
            {notifications.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <Bell className="mx-auto size-8 mb-2 opacity-40" />
                No hay notificaciones
              </div>
            )}
            {notifications.map((n) => {
              const isUnread = !n.readAt
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                    isUnread
                      ? 'border-[rgba(124,58,237,0.4)] bg-[rgba(124,58,237,0.08)]'
                      : 'border-[rgba(124,58,237,0.15)] bg-transparent'
                  }`}
                >
                  <div className={`mt-0.5 size-2 shrink-0 rounded-full ${isUnread ? 'bg-[#7c3aed]' : 'bg-gray-600'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isUnread ? 'text-white' : 'text-gray-400'}`}>
                        {n.type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-gray-600">{fmtDate(n.createdAt)}</span>
                    </div>
                    {n.payload && (
                      <p className="mt-0.5 text-xs text-gray-500 truncate">{n.payload}</p>
                    )}
                  </div>
                  {isUnread && (
                    <Button size="sm" variant="ghost" className="text-xs text-[#7c3aed] shrink-0" onClick={() => markRead(n.id)}>
                      <CheckCircle2 className="size-3.5 mr-1" /> Leído
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
