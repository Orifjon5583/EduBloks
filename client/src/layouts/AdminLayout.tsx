import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';

const links = [
  {to:'/admin',label:'Dashboard',end:true},{to:'/admin/branches',label:'Filiallar'},{to:'/admin/teachers',label:"O'qituvchilar"},
  {to:'/admin/groups',label:'Guruhlar'},{to:'/admin/students',label:'Talabalar'},{to:'/admin/rankings',label:'Reytinglar'},
  {to:'/admin/xp-approval',label:'XP Tasdiqlash'},{to:'/admin/logs',label:'Loglar'},{to:'/admin/chat',label:'Chat'}
];

export default function AdminLayout() {
  const {user,logout}=useAuthStore(); const {isDark,toggle}=useThemeStore(); const nav=useNavigate();
  return <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700"><h2 className="font-bold text-lg text-gray-900 dark:text-white">EduBlocks</h2><p className="text-xs text-gray-500">Super Admin</p></div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">{links.map(l=><NavLink key={l.to} to={l.to} end={l.end} className={({isActive})=>`sidebar-link ${isActive?'sidebar-link-active':''}`}>{l.label}</NavLink>)}</nav>
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <div className="flex justify-between items-center px-3"><span className="text-sm text-gray-600 dark:text-gray-400">{user?.firstName}</span><button onClick={toggle}>{isDark?'☀️':'🌙'}</button></div>
        <button onClick={()=>{logout();nav('/login');}} className="sidebar-link text-red-600 w-full">Chiqish</button>
      </div>
    </aside>
    <main className="flex-1 overflow-y-auto p-6"><Outlet/></main>
  </div>;
}
