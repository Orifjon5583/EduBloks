import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check } from 'lucide-react';
import api from '../api';

export default function Notifications() {
  const qc = useQueryClient();
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then(r => r.data)
  });

  const markAll = useMutation({
    mutationFn: () => api.put('/notifications/read-all'),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notifications'] }); qc.invalidateQueries({ queryKey: ['unread-count'] }); }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <Bell className="w-6 h-6" /> Bildirishnomalar
        </h1>
        {notifications.some((n: any) => !n.read) && (
          <button onClick={() => markAll.mutate()} className="btn-secondary flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" /> Barchasini o'qilgan deb belgilash
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((n: any) => (
          <div key={n.id} className={`card flex items-start gap-3 ${!n.read ? 'border-l-4 border-l-primary-500' : 'opacity-70'}`}>
            <div className={`w-2 h-2 rounded-full mt-2 ${!n.read ? 'bg-primary-500' : 'bg-gray-300'}`} />
            <div className="flex-1">
              <p className="dark:text-white">{n.message}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">{n.type}</span>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="card text-center text-gray-500 py-8">Bildirishnoma yo'q</p>
        )}
      </div>
    </div>
  );
}
