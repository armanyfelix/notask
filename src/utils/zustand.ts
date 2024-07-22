import { Database } from '../types/database.types.ts'
import { Session } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SessionState = {
  session: Session | null
  setSession: (session: Session | null) => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
    }),
    {
      name: 'session',
      // storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export type AccountState = {
  account: Database['public']['Tables']['accounts']['Row'] | null
  setAccount: (
    account: Database['public']['Tables']['accounts']['Row'] | null,
  ) => void
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      account: null,
      setAccount: (account) => set(() => ({ account })),
    }),
    {
      name: 'account',
      // storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export type ThemeState = {
  theme: string
  setTheme: (theme: string) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme',
      // storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export type UIState = {
  openFavoritesSidebar: boolean
  setOpenFavoritesSidebar: (open: boolean) => void
  openSpacesSidebar: boolean
  setOpenSpacesSidebar: (open: boolean) => void
  openExplorer: boolean
  setOpenExplorer: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      openFavoritesSidebar: true,
      setOpenFavoritesSidebar: (open) => set({ openFavoritesSidebar: open }),
      openSpacesSidebar: true,
      setOpenSpacesSidebar: (open) => set({ openSpacesSidebar: open }),
      openExplorer: true,
      setOpenExplorer: (open) => set({ openExplorer: open }),
    }),
    {
      name: 'ui',
      // storage: createJSONStorage(() => sessionStorage),  // Solo si necesito guardar en el session storage, no localstorage
    },
  ),
)
