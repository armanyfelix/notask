import { Tables } from "../types/database.types.ts";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SessionState = {
  session: Session | null;
  setSession: (session: Session | null) => void;
};
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
    }),
    {
      name: "session",
    },
  ),
);

export type AccountState = {
  account: Tables<"accounts"> | null;
  setAccount: (account: Tables<"accounts"> | null) => void;
};
export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      account: null,
      setAccount: (account) => set(() => ({ account })),
    }),
    {
      name: "account",
    },
  ),
);

export type SpacesState = {
  spaces: Tables<"spaces">[];
  setSpaces: (spaces: Tables<"spaces">[]) => void;
};
export const useSpacesStore = create<SpacesState>()(
  persist(
    (set) => ({
      spaces: [],
      setSpaces: (spaces: Tables<"spaces">[]) => set(() => ({ spaces })),
    }),
    {
      name: "spaces",
    },
  ),
);

export type ThemeState = {
  theme: string;
  setTheme: (theme: string) => void;
};
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme",
    },
  ),
);

export type TabsState = {
  tabs: any;
  setTabs: (tabs: any) => void;
  selectedTab: any;
  setSelectedTab: (tab: any) => void;
};
export const useTabsStore = create<TabsState>()(
  persist(
    (set) => ({
      tabs: [],
      setTabs: (tabs) => set({ tabs }),
      selectedTab: {},
      setSelectedTab: (selectedTab) => set({ selectedTab }),
    }),
    {
      name: "tabs",
    },
  ),
);

export type SidebarsState = {
  rightSidebarOpen: boolean;
  setRightSidebarOpen: (rightSidebarOpen: boolean) => void;
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (leftSidebarOpen: boolean) => void;
};
export const useSidebarsStore = create<SidebarsState>()(
  persist(
    (set) => ({
      rightSidebarOpen: false,
      setRightSidebarOpen: (rightSidebarOpen) => set({ rightSidebarOpen }),
      leftSidebarOpen: false,
      setLeftSidebarOpen: (leftSidebarOpen) => set({ leftSidebarOpen }),
    }),
    {
      name: "sidebar",
    },
  ),
);

export type UIState = {
  openFavoritesSidebar: boolean;
  setOpenFavoritesSidebar: (open: boolean) => void;
  openSpacesSidebar: boolean;
  setOpenSpacesSidebar: (open: boolean) => void;
};
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      openFavoritesSidebar: true,
      setOpenFavoritesSidebar: (open) => set({ openFavoritesSidebar: open }),
      openSpacesSidebar: true,
      setOpenSpacesSidebar: (open) => set({ openSpacesSidebar: open }),
    }),
    {
      name: "ui",
      // storage: createJSONStorage(() => sessionStorage),  // Solo si necesito guardar en el session storage, no localstorage
    },
  ),
);
