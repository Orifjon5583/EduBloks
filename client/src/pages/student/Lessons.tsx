import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';

export default function StudentLessons() {
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const { data: lessons = [] } = useQuery({ queryKey: ['lessons'], queryFn: () => api.get('/lessons').then(r => r.data) });

  const complete = useMutation({
    mutationFn: (id: string) => api.post(`/lessons/${id}/complete`),
    onSuccess: () => toast.success('Dars yakunlandi! +5 XP')
  });

  if (activeLesson) {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setActiveLesson(null)} className="text-primary-600 mb-4 hover:underline">← Orqaga</button>
        <div className="card">
          <h1 className="text-2xl font-bold dark:text-white mb-2">{activeLesson.title}</h1>
          <p className="text-sm text-gray-500 mb-6">{activeLesson.topic?.course?.name} / {activeLesson.topic?.name}</p>
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: activeLesson.content.replace(/\n/g, '<br/>') }} />
          <button onClick={() => { complete.mutate(activeLesson.id); setActiveLesson(null); }} className="btn-primary mt-6">Yakunladim ✓</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">📖 Darslar</h1>
      <div className="space-y-3">
        {lessons.map((l: any) => (
          <div key={l.id} onClick={() => setActiveLesson(l)} className="card hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center">
            <div>
              <h3 className="font-medium dark:text-white">{l.title}</h3>
              <p className="text-sm text-gray-500">{l.topic?.course?.name} / {l.topic?.name}</p>
            </div>
            <span className="text-primary-600 text-sm font-medium">O'qish →</span>
          </div>
        ))}
        {lessons.length === 0 && <p className="card text-center text-gray-500 py-8">Darslar hali yuklanmagan</p>}
      </div>
    </div>
  );
}