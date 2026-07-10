import { useQuery } from '@tanstack/react-query';
import api from '../../api';

export default function StudentLessons() {
  const { data: lessons = [] } = useQuery({
    queryKey: ['student-lessons'],
    queryFn: () => api.get('/lessons').then(r => r.data)
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Darslar</h1>
      <div className="space-y-3">
        {lessons.map((l: any) => (
          <div key={l.id} className="card hover:shadow-md cursor-pointer">
            <h3 className="font-medium dark:text-white">{l.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
