import { create } from "zustand"
import type { Theme } from "@/types"

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: (localStorage.getItem("smartpos-theme") as Theme) || "system",
  setTheme: (theme) => {
    localStorage.setItem("smartpos-theme", theme)
    set({ theme })
  },
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark"
      localStorage.setItem("smartpos-theme", next)
      return { theme: next }
    }),
}))
