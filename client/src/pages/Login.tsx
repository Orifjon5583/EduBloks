import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';

export default function Login() {
  const [login,setLogin]=useState(''); const [password,setPassword]=useState(''); const [loading,setLoading]=useState(false);
  const nav=useNavigate(); const {setAuth}=useAuthStore(); const {isDark,toggle}=useThemeStore();
  const submit = async (e:any) => { e.preventDefault(); setLoading(true);
    try { const {data}=await api.post('/auth/login',{login,password}); setAuth(data.user,data.accessToken,data.refreshToken);
      nav(data.user.role==='SUPER_ADMIN'?'/admin':data.user.role==='TEACHER'?'/teacher':'/student');
      toast.success(`Xush kelibsiz, ${data.user.firstName}!`);
    } catch(e:any) { toast.error(e.response?.data?.message||'Xatolik'); } finally { setLoading(false); } };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
    <button onClick={toggle} className="absolute top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow">{isDark?'☀️':'🌙'}</button>
    <div className="w-full max-w-md">
      <div className="text-center mb-8"><div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 text-white text-2xl font-bold">E</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">EduBlocks</h1><p className="text-gray-500 mt-1">Dasturlash ta'lim platformasi</p></div>
      <form onSubmit={submit} className="card space-y-5">
        <div><label className="block text-sm font-medium mb-1">Login</label><input value={login} onChange={e=>setLogin(e.target.value)} className="input-field" required/></div>
        <div><label className="block text-sm font-medium mb-1">Parol</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input-field" required/></div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading?'Kirish...':'Tizimga kirish'}</button>
      </form>
    </div>
  </div>;
}
