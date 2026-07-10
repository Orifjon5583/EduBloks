import { useQuery } from '@tanstack/react-query';
import { Award, Lock, Trophy } from 'lucide-react';
import api from '../../api';

export default function StudentAchievements() {
  const { data: all = [] } = useQuery({ queryKey: ['achievements'], queryFn: () => api.get('/achievements').then(r => r.data) });
  const { data: my = [] } = useQuery({ queryKey: ['my-achievements'], queryFn: () => api.get('/achievements/my').then(r => r.data) });

  const earnedIds = new Set(my.map((m: any) => m.achievementId));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
        <Trophy className="w-7 h-7 text-yellow-500" /> Yutuqlar & Badges
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {all.map((a: any) => {
          const earned = earnedIds.has(a.id);
          return (
            <div key={a.id} className={`card flex items-start gap-4 ${earned ? '' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${earned ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                {earned ? <Award className="w-6 h-6 text-yellow-600" /> : <Lock className="w-6 h-6 text-gray-400" />}
              </div>
              <div>
                <h3 className="font-medium dark:text-white">{a.name}</h3>
                <p className="text-sm text-gray-500">{a.description}</p>
                {earned && (
                  <p className="text-xs text-green-600 mt-1">✅ Erishilgan</p>
                )}
                {!earned && a.xpThreshold && (
                  <p className="text-xs text-gray-400 mt-1">{a.xpThreshold} XP kerak</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {all.length === 0 && <p className="card text-center text-gray-500 py-8">Yutuqlar hali sozlanmagan</p>}
    </div>
  );
}
