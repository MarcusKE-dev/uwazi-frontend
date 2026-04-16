import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(persist(
  (set) => ({
    darkMode: false,
    sidebarOpen: true,
    toggleDarkMode: () => set((state) => {
      const next = !state.darkMode;
      document.documentElement.classList.toggle('dark', next);
      return { darkMode: next };
    }),
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  }),
  { name: 'uwazi-ui' }
));