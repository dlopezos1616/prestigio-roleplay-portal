import { create } from 'zustand'

export type PageId = 
  | 'home' 
  | 'normativa' 
  | 'galeria' 
  | 'facciones' 
  | 'mapa' 
  | 'info' 
  | 'donaciones' 
  | 'whitelist' 
  | 'staff' 
  | 'admin'
  | 'profile'
  | 'login'

/** Map PageId to URL hash fragment */
export const pageToHash: Record<PageId, string> = {
  home: '',
  normativa: 'normativa',
  galeria: 'galeria',
  facciones: 'facciones',
  mapa: 'mapa',
  info: 'info',
  donaciones: 'donaciones',
  whitelist: 'whitelist',
  staff: 'staff',
  admin: 'admin',
  profile: 'profile',
  login: 'login',
}

/** Map URL hash fragment to PageId */
export const hashToPage: Record<string, PageId> = {
  '': 'home',
  home: 'home',
  normativa: 'normativa',
  galeria: 'galeria',
  facciones: 'facciones',
  mapa: 'mapa',
  info: 'info',
  donaciones: 'donaciones',
  whitelist: 'whitelist',
  staff: 'staff',
  admin: 'admin',
  profile: 'profile',
  login: 'login',
}

/** Read the initial page from the current URL hash (SSR-safe) */
function getInitialPage(): PageId {
  if (typeof window === 'undefined') return 'home'
  const hash = window.location.hash.replace('#', '')
  return hashToPage[hash] || 'home'
}

interface NavigationState {
  currentPage: PageId
  navigate: (page: PageId) => void
  previousPage: PageId | null
}

export const useNavigation = create<NavigationState>((set) => {
  // Read initial page from URL hash
  const initialPage = getInitialPage()

  return {
    currentPage: initialPage,
    previousPage: null,
    navigate: (page) => {
      // Update URL hash without causing a full page reload
      if (typeof window !== 'undefined') {
        const hash = pageToHash[page]
        // Only update if hash actually changed to avoid redundant history entries
        const currentHash = window.location.hash.replace('#', '')
        if (currentHash !== hash) {
          window.location.hash = hash
        }
      }
      set((state) => ({ 
        previousPage: state.currentPage, 
        currentPage: page 
      }))
    },
  }
})

// Listen for browser back/forward (hashchange) events — only on client
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '')
    const page = hashToPage[hash] || 'home'
    const { currentPage, navigate } = useNavigation.getState()
    // Only update if the page actually changed to avoid loops
    if (page !== currentPage) {
      // Update state directly without pushing a new hash (to avoid loop)
      useNavigation.setState((state) => ({
        previousPage: state.currentPage,
        currentPage: page,
      }))
    }
  })
}
