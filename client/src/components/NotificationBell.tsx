import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import api from '../api';

export default function NotificationBell() {
  const { data } = useQuery({
    queryKey: ['unread-count'],
    queryFn: () => api.get('/notifications/unread-count').then(r => r.data),
    refetchInterval: 30000
  });

  return (
    <div className="relative">
      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      {data?.count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {data.count > 9 ? '9+' : data.count}
        </span>
      )}
    </div>
  );
}
