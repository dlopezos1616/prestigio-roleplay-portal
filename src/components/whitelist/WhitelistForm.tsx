"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, Send, ShieldCheck, ShieldX, Clock, LogIn } from "lucide-react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useSession } from "@/hooks/useSession"

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const whitelistFormSchema = z.object({
  answer1: z.string().min(30, "La respuesta debe tener al menos 30 caracteres"),
  answer2: z.string().min(30, "La respuesta debe tener al menos 30 caracteres"),
  answer3: z.string().min(30, "La respuesta debe tener al menos 30 caracteres"),
  answer4: z.string().min(30, "La respuesta debe tener al menos 30 caracteres"),
  answer5: z.string().min(50, "La respuesta debe tener al menos 50 caracteres"),
})

type WhitelistFormValues = z.infer<typeof whitelistFormSchema>

// ─── Questions ────────────────────────────────────────────────────────────────

const questions = [
  {
    key: "answer1" as const,
    label: "1. ¿Qué es el Power Gaming? Da un ejemplo concreto.",
    min: 30,
  },
  {
    key: "answer2" as const,
    label: "2. ¿Qué es el Meta Gaming? ¿Cómo afecta al rol?",
    min: 30,
  },
  {
    key: "answer3" as const,
    label: "3. Explica la diferencia entre OOC y IC en un servidor RP.",
    min: 30,
  },
  {
    key: "answer4" as const,
    label: "4. ¿Qué es el NVL (No Valorar la Vida) y el VDM? ¿Cuándo aplica?",
    min: 30,
  },
  {
    key: "answer5" as const,
    label: "5. Describe una situación de rol en la que debas tomar una decisión difícil. ¿Cómo actuarías?",
    min: 50,
  },
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface WhitelistApplication {
  id: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  attemptNumber: number
  rejectReason?: string | null
  createdAt: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WhitelistForm() {
  const user = useSession((s) => s.user)
  const sessionLoading = useSession((s) => s.loading)
  const [submitting, setSubmitting] = useState(false)
  const [existingApps, setExistingApps] = useState<WhitelistApplication[]>([])
  const [loadingApps, setLoadingApps] = useState(true)

  const form = useForm<WhitelistFormValues>({
    resolver: zodResolver(whitelistFormSchema),
    defaultValues: {
      answer1: "",
      answer2: "",
      answer3: "",
      answer4: "",
      answer5: "",
    },
  })

  // Fetch existing applications for this user
  useEffect(() => {
    if (!user?.dbId) {
      setLoadingApps(false)
      return
    }

    setLoadingApps(true)
    fetch("/api/whitelist")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const myApps = data.filter(
            (app: WhitelistApplication & { user?: { discordId?: string } }) =>
              app.user?.discordId === user.discordId
          )
          setExistingApps(myApps)
        }
      })
      .catch(() => {
        toast.error("Error al cargar tus solicitudes")
      })
      .finally(() => setLoadingApps(false))
  }, [user?.dbId, user?.discordId])

  // ─── Derived state ───────────────────────────────────────────────────────

  const approvedApp = existingApps.find((app) => app.status === "APPROVED")
  const rejectedApps = existingApps.filter((app) => app.status === "REJECTED")
  const pendingApp = existingApps.find((app) => app.status === "PENDING")
  const attemptsUsed = existingApps.length
  const attemptsRemaining = Math.max(0, 2 - rejectedApps.length)
  const canApply =
    !approvedApp && !pendingApp && rejectedApps.length < 2

  // ─── Submit handler ──────────────────────────────────────────────────────

  async function onSubmit(values: WhitelistFormValues) {
    if (!user?.dbId) {
      toast.error("Debes iniciar sesión para enviar la solicitud")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.dbId,
          ...values,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (typeof data.error === "string") {
          toast.error(data.error)
        } else {
          toast.error("Error al enviar la solicitud")
        }
        return
      }

      toast.success("¡Solicitud enviada correctamente! Revisaremos tus respuestas.")
      form.reset()
      // Refresh existing apps
      setExistingApps((prev) => [
        { ...data, user: undefined },
        ...prev,
      ])
    } catch {
      toast.error("Error de conexión al enviar la solicitud")
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Loading state ───────────────────────────────────────────────────────

  if (sessionLoading || loadingApps) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-neon-primary" />
        <span className="ml-3 text-muted-foreground">Cargando...</span>
      </div>
    )
  }

  // ─── Not logged in ───────────────────────────────────────────────────────

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-[#0f172a] neon-border p-8 text-center">
          <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-neon-primary/10">
            <LogIn className="size-8 text-neon-primary" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-foreground">
            Inicia sesión para continuar
          </h3>
          <p className="mb-6 text-muted-foreground">
            Necesitas vincular tu cuenta de Discord para enviar una solicitud de
            whitelist.
          </p>
          <Button
            size="lg"
            onClick={() => signIn('discord', { callbackUrl: window.location.origin })}
            className="bg-[#5865F2] text-white hover:bg-[#4752C4] neon-glow transition-all duration-300"
          >
            <svg className="mr-2 size-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Iniciar sesión con Discord
          </Button>
        </div>
      </div>
    )
  }

  // ─── Already approved ────────────────────────────────────────────────────

  if (approvedApp) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-[#0f172a] neon-border-cyan p-8 text-center">
          <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-green-500/10">
            <ShieldCheck className="size-8 text-green-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-green-400">
            ¡Estás en la Whitelist!
          </h3>
          <p className="text-muted-foreground">
            Tu solicitud ha sido aprobada. Ya puedes disfrutar del servidor.
          </p>
        </div>
      </div>
    )
  }

  // ─── Pending application ─────────────────────────────────────────────────

  if (pendingApp) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-[#0f172a] neon-border-amber p-8 text-center">
          <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-amber-500/10">
            <Clock className="size-8 text-amber-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-amber-400">
            Solicitud pendiente
          </h3>
          <p className="text-muted-foreground">
            Tu solicitud #{pendingApp.attemptNumber} está siendo revisada por el
            equipo de staff. Recibirás una notificación cuando se resuelva.
          </p>
          <div className="mt-4">
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-400"
            >
              Intento {pendingApp.attemptNumber} de 2
            </Badge>
          </div>
        </div>
      </div>
    )
  }

  // ─── No attempts remaining ───────────────────────────────────────────────

  if (rejectedApps.length >= 2) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-[#0f172a] border border-red-500/40 p-8 text-center shadow-[0_0_10px_rgba(239,68,68,0.15),inset_0_0_10px_rgba(239,68,68,0.05)]">
          <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-red-500/10">
            <ShieldX className="size-8 text-red-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-red-400">
            Intentos agotados
          </h3>
          <p className="text-muted-foreground">
            Has agotado tus 2 intentos de whitelist. No puedes enviar más
            solicitudes.
          </p>
          {rejectedApps.map((app, i) => (
            <div key={app.id} className="mt-4 rounded-lg bg-red-500/5 p-3 text-left">
              <p className="text-sm font-medium text-red-400">
                Intento {app.attemptNumber}
              </p>
              {app.rejectReason && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Motivo: {app.rejectReason}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ─── Form ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-3xl">
      {/* Attempt status */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="border-neon-primary/40 text-neon-primary"
          >
            Intento {attemptsUsed + 1} de 2
          </Badge>
          {attemptsUsed > 0 && (
            <span className="text-sm text-muted-foreground">
              {attemptsRemaining} intento{attemptsRemaining !== 1 ? "s" : ""} restante{attemptsRemaining !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {rejectedApps.length > 0 && (
          <Badge variant="destructive" className="text-xs">
            {rejectedApps.length} rechazada{rejectedApps.length > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Rejection feedback from previous attempt */}
      {rejectedApps.length > 0 && rejectedApps[rejectedApps.length - 1].rejectReason && (
        <div className="mb-6 rounded-lg bg-red-500/5 border border-red-500/20 p-4">
          <p className="text-sm font-medium text-red-400">
            Motivo del rechazo anterior:
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {rejectedApps[rejectedApps.length - 1].rejectReason}
          </p>
        </div>
      )}

      {/* The form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {questions.map((q) => (
            <FormField
              key={q.key}
              control={form.control}
              name={q.key}
              render={({ field }) => (
                <FormItem className="rounded-xl bg-[#0f172a] neon-border p-6 transition-all duration-300 focus-within:neon-glow">
                  <FormLabel className="text-base font-semibold text-foreground">
                    {q.label}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Escribe tu respuesta aquí (mínimo ${q.min} caracteres)...`}
                      className="mt-3 min-h-[120px] resize-y border-neon-primary/20 bg-[#030712]/50 placeholder:text-muted-foreground/50 focus-visible:border-neon-primary focus-visible:ring-neon-primary/30"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormDescription className="text-xs text-muted-foreground/60">
                      Mínimo {q.min} caracteres
                    </FormDescription>
                    <span
                      className={`text-xs ${
                        (field.value?.length || 0) >= q.min
                          ? "text-green-400"
                          : "text-muted-foreground/40"
                      }`}
                    >
                      {field.value?.length || 0}/{q.min}
                    </span>
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          ))}

          {/* Submit button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={submitting || !canApply}
              size="lg"
              className="relative min-w-[200px] overflow-hidden bg-neon-primary text-white hover:bg-neon-primary/90 neon-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 size-4" />
                  Enviar Solicitud
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
