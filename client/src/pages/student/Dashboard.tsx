import { useQuery } from '@tanstack/react-query';
import { Zap, Trophy, TrendingUp, Flame, Clock, BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import api from '../../api';

export default function SDashboard() {
  const { data } = useQuery({ queryKey: ['s-dash'], queryFn: () => api.get('/dashboard/student').then(r => r.data) });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Mening Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card flex items-center gap-3">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2.5 rounded-xl">
            <Zap className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold dark:text-white">{data?.xp || 0}</p>
            <p className="text-xs text-gray-500">XP</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-xl">
            <Trophy className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-lg font-bold dark:text-white">{data?.rank || 'Beginner'}</p>
            <p className="text-xs text-gray-500">Daraja</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold dark:text-white">Lvl {data?.level || 1}</p>
            <p className="text-xs text-gray-500">Level</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl">
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold dark:text-white">{data?.streak || 0}</p>
            <p className="text-xs text-gray-500">Kun streak</p>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="card mb-6">
        <h2 className="font-semibold dark:text-white mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> Davom eting
        </h2>
        <NavLink to="/student/lessons" className="text-primary-600 hover:underline text-sm">
          Darslarni ko'rish →
        </NavLink>
      </div>

      {/* Deadlines */}
      {data?.deadlines?.length > 0 && (
        <div className="card">
          <h2 className="font-semibold dark:text-white mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-500" /> Yaqin muddatlar
          </h2>
          <div className="space-y-2">
            {data.deadlines.map((d: any) => (
              <div key={d.id} className="flex justify-between items-center py-2 border-b dark:border-gray-700 last:border-0">
                <span className="dark:text-white">{d.title}</span>
                <span className="text-sm text-red-600 font-medium">{new Date(d.deadline).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
