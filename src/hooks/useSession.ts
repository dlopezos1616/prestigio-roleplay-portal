"use client"

import { create } from 'zustand'

export interface SessionUser {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
  discordId?: string
  dbId?: string
}

const DEV_SESSION_KEY = "prestigio-dev-session"

function getDevSession(): SessionUser | null {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return null
  try {
    const devSession = localStorage.getItem(DEV_SESSION_KEY)
    if (devSession) {
      const parsed = JSON.parse(devSession)
      if (parsed && parsed.role) return parsed
    }
  } catch {
    // ignore
  }
  return null
}

interface SessionState {
  user: SessionUser | null
  loading: boolean
  initialized: boolean
  setUser: (user: SessionUser | null) => void
  initSession: () => void
  refetch: () => void
}

export const useSession = create<SessionState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => {
    if (user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(user))
      }
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DEV_SESSION_KEY)
      }
    }
    set({ user, loading: false })
  },

  initSession: () => {
    if (get().initialized) return
    set({ initialized: true })

    // Check dev session first (client-only)
    const devSession = getDevSession()
    if (devSession) {
      set({ user: devSession, loading: false })
      return
    }

    // Fetch from NextAuth session API
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        set({ user: data.user, loading: false })
      })
      .catch(() => {
        set({ loading: false })
      })
  },

  refetch: () => {
    set({ loading: true })
    const devSession = getDevSession()
    if (devSession) {
      set({ user: devSession, loading: false })
      return
    }

    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        set({ user: data.user, loading: false })
      })
      .catch(() => set({ loading: false }))
  },
}))

// Hook that auto-initializes session on first use
export function useSessionInit() {
  const initSession = useSession((s) => s.initSession)
  // This will be called in a useEffect by the consuming component
  return initSession
}
