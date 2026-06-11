import { create } from 'zustand'

export type PageId = 
  | 'home' 
  | 'normativa' 
  | 'galeria' 
  | 'facciones' 
  | 'info' 
  | 'donaciones' 
  | 'whitelist' 
  | 'staff' 
  | 'admin'
  | 'login'

interface NavigationState {
  currentPage: PageId
  navigate: (page: PageId) => void
  previousPage: PageId | null
}

export const useNavigation = create<NavigationState>((set) => ({
  currentPage: 'home',
  previousPage: null,
  navigate: (page) => set((state) => ({ 
    previousPage: state.currentPage, 
    currentPage: page 
  })),
}))
