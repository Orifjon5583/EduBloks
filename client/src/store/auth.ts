import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export interface User { id: string; firstName: string; lastName: string; login: string; role: 'SUPER_ADMIN'|'TEACHER'|'STUDENT'; }
interface AuthState { user: User|null; accessToken: string|null; refreshToken: string|null; setAuth: (u:User,a:string,r:string)=>void; setAccessToken: (t:string)=>void; logout: ()=>void; }
export const useAuthStore = create<AuthState>()(persist((set) => ({
  user: null, accessToken: null, refreshToken: null,
  setAuth: (user,accessToken,refreshToken) => set({user,accessToken,refreshToken}),
  setAccessToken: (accessToken) => set({accessToken}),
  logout: () => set({user:null,accessToken:null,refreshToken:null})
}), { name: 'edublocks-auth' }));
