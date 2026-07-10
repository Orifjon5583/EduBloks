import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';
import { LayoutDashboard, BookOpen, HelpCircle, Keyboard, Bug, Code, Figma, TrendingUp, Award, Trophy, Bell, MessageCircle, LogOut, Sun, Moon } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

const links = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/lessons', label: 'Darslar', icon: BookOpen },
  { to: '/student/quiz', label: 'Quiz', icon: HelpCircle },
  { to: '/student/typing', label: 'Typing', icon: Keyboard },
  { to: '/student/bugfix', label: 'Bug Fix', icon: Bug },
  { to: '/student/coding', label: 'Coding', icon: Code },
  { to: '/student/figma', label: 'Figma', icon: Figma },
  { to: '/student/progress', label: 'Progress', icon: TrendingUp },
  { to: '/student/achievements', label: 'Yutuqlar', icon: Award },
  { to: '/student/rankings', label: 'Reyting', icon: Trophy },
  { to: '/student/notifications', label: 'Bildirishnomalar', icon: Bell },
  { to: '/student/chat', label: 'Chat', icon: MessageCircle },
];

export default function StudentLayout() {
  const { user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const nav = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">EduBlocks</h2>
          <p className="text-xs text-gray-500">Talaba</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
              <l.icon className="w-5 h-5" />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <div className="flex justify-between items-center px-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">{user?.firstName}</span>
            <div className="flex items-center gap-2">
              <NavLink to="/student/notifications"><NotificationBell /></NavLink>
              <button onClick={toggle} className="p-1">
                {isDark ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-gray-600" />}
              </button>
            </div>
          </div>
          <button onClick={() => { logout(); nav('/login'); }} className="sidebar-link text-red-600 w-full">
            <LogOut className="w-5 h-5" /> <span>Chiqish</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
    </div>
  );
}
