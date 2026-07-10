import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface ThemeState { isDark: boolean; toggle: ()=>void; }
export const useThemeStore = create<ThemeState>()(persist((set,get) => ({
  isDark: false,
  toggle: () => { const v = !get().isDark; set({isDark:v}); v ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark'); }
}), { name: 'edublocks-theme', onRehydrateStorage: () => (s) => { if(s?.isDark) document.documentElement.classList.add('dark'); } }));
