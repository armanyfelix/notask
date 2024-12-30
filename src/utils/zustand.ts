<<<<<<< HEAD
import { Database } from '../types/database.types.ts'
=======
import { Tables } from '../types/database.types.ts'
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
import { Session } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SessionState = {
  session: Session | null
  setSession: (session: Session | null) => void
}
<<<<<<< HEAD

=======
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
    }),
    {
      name: 'session',
<<<<<<< HEAD
      // storage: createJSONStorage(() => sessionStorage),
=======
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
    },
  ),
)

export type AccountState = {
<<<<<<< HEAD
  account: Database['public']['Tables']['accounts']['Row'] | null
  setAccount: (
    account: Database['public']['Tables']['accounts']['Row'] | null,
  ) => void
}

=======
  account: Tables<'accounts'> | null
  setAccount: (account: Tables<'accounts'> | null) => void
}
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      account: null,
      setAccount: (account) => set(() => ({ account })),
    }),
    {
      name: 'account',
<<<<<<< HEAD
      // storage: createJSONStorage(() => sessionStorage),
=======
    },
  ),
)

export type SpacesState = {
  spaces: Tables<'spaces'>[]
  setSpaces: (spaces: Tables<'spaces'>[]) => void
}
export const useSpacesStore = create<SpacesState>()(
  persist(
    (set) => ({
      spaces: [],
      setSpaces: (spaces: Tables<'spaces'>[]) => set(() => ({ spaces })),
    }),
    {
      name: 'spaces',
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
    },
  ),
)

export type ThemeState = {
  theme: string
  setTheme: (theme: string) => void
}
<<<<<<< HEAD

=======
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme',
<<<<<<< HEAD
      // storage: createJSONStorage(() => sessionStorage),
=======
    },
  ),
)

export type SidebarState = {
  WideSidebar: boolean
  setWideSidebar: (WideSidebar: boolean) => void
}
export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      WideSidebar: false,
      setWideSidebar: (WideSidebar) => set({ WideSidebar }),
    }),
    {
      name: 'sidebar',
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
    },
  ),
)

export type UIState = {
  openFavoritesSidebar: boolean
  setOpenFavoritesSidebar: (open: boolean) => void
  openSpacesSidebar: boolean
  setOpenSpacesSidebar: (open: boolean) => void
<<<<<<< HEAD
  openExplorer: boolean
  setOpenExplorer: (open: boolean) => void
}

=======
}
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      openFavoritesSidebar: true,
      setOpenFavoritesSidebar: (open) => set({ openFavoritesSidebar: open }),
      openSpacesSidebar: true,
      setOpenSpacesSidebar: (open) => set({ openSpacesSidebar: open }),
<<<<<<< HEAD
      openExplorer: true,
      setOpenExplorer: (open) => set({ openExplorer: open }),
=======
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
    }),
    {
      name: 'ui',
      // storage: createJSONStorage(() => sessionStorage),  // Solo si necesito guardar en el session storage, no localstorage
    },
  ),
)
