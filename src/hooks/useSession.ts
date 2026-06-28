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

function fetchSession(): Promise<SessionUser | null> {
  return fetch("/api/auth/session", { cache: "no-store", credentials: "include" })
    .then((res) => res.json())
    .then((data) => data.user ?? null)
    .catch(() => null)
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
    fetchSession().then((user) => set({ user, loading: false }))

    // Set up listeners so the session re-fetches when the user comes back
    // from Discord OAuth (window regains focus) or navigates back to the app.
    if (typeof window !== "undefined") {
      let lastFocus = Date.now()
      const onFocus = () => {
        // Avoid spamming: refetch at most once every 2 seconds
        if (Date.now() - lastFocus < 2000) return
        lastFocus = Date.now()
        const current = get().user
        // Only refetch if we don't have a user yet (likely just came back from OAuth)
        // or to keep session fresh on focus.
        if (!current) {
          fetchSession().then((user) => {
            if (user) set({ user, loading: false })
          })
        }
      }
      const onStorage = (e: StorageEvent) => {
        if (e.key === null && !get().user) {
          // localStorage was cleared, refetch
          fetchSession().then((user) => set({ user, loading: false }))
        }
      }
      window.addEventListener("focus", onFocus)
      window.addEventListener("pageshow", onFocus)
      window.addEventListener("storage", onStorage)
      // Cleanup is handled by the browser on unload (single-page app)
    }
  },

  refetch: () => {
    set({ loading: true })
    const devSession = getDevSession()
    if (devSession) {
      set({ user: devSession, loading: false })
      return
    }

    fetchSession().then((user) => set({ user, loading: false }))
  },
}))

// Hook that auto-initializes session on first use
export function useSessionInit() {
  const initSession = useSession((s) => s.initSession)
  // This will be called in a useEffect by the consuming component
  return initSession
}
