import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';

export default function StudentBugFix() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const { data: exercises = [] } = useQuery({ queryKey: ['bugfix'], queryFn: () => api.get('/bugfix').then(r => r.data) });

  const selected = exercises.find((e: any) => e.id === selectedId);

  const submit = useMutation({
    mutationFn: (data: any) => api.post(`/bugfix/${selectedId}/submit`, data),
    onSuccess: (res) => {
      if (res.data.correct) { toast.success(`To'g'ri! +${res.data.xp} XP 🎉`); setSelectedId(null); }
      else toast.error('Noto\'g\'ri. Qayta urinib ko\'ring!');
    }
  });

  if (selectedId && selected) {
    return (
      <div>
        <button onClick={() => setSelectedId(null)} className="text-primary-600 mb-4 hover:underline">← Orqaga</button>
        <div className="card mb-4">
          <h2 className="text-xl font-bold dark:text-white mb-2">{selected.title}</h2>
          {selected.description && <p className="text-gray-500 mb-4">{selected.description}</p>}
          {selected.hint && <p className="text-sm text-yellow-600 mb-4">💡 {selected.hint}</p>}
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
            <pre>{selected.buggyCode}</pre>
          </div>
        </div>
        <div className="card">
          <h3 className="font-medium dark:text-white mb-2">Tuzatilgan kodni yozing:</h3>
          <textarea value={code} onChange={e => setCode(e.target.value)} className="input-field h-40 font-mono" placeholder="To'g'ri kodni yozing..." />
          <button onClick={() => submit.mutate({ code })} className="btn-primary mt-3" disabled={!code.trim()}>Tekshirish</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">🐛 Bug Fix</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercises.map((ex: any) => (
          <div key={ex.id} onClick={() => { setSelectedId(ex.id); setCode(''); }} className="card hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="font-medium dark:text-white">{ex.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{ex.topic?.course?.name} / {ex.topic?.name}</p>
            <p className="text-sm text-green-600 mt-2 font-medium">+{ex.xpReward} XP</p>
          </div>
        ))}
        {exercises.length === 0 && <p className="col-span-2 card text-center text-gray-500 py-8">Hali mashq yo'q</p>}
      </div>
    </div>
  );
}
