import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';

export default function StudentCoding() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const { data: challenges = [] } = useQuery({ queryKey: ['coding'], queryFn: () => api.get('/coding').then(r => r.data) });
  const selected = challenges.find((c: any) => c.id === selectedId);

  const submit = useMutation({
    mutationFn: (data: any) => api.post(`/coding/${selectedId}/submit`, data),
    onSuccess: (res) => { toast.success(`Topshirildi! +${res.data.xp} XP 🎉`); setSelectedId(null); }
  });

  if (selectedId && selected) {
    return (
      <div>
        <button onClick={() => setSelectedId(null)} className="text-primary-600 mb-4 hover:underline">← Orqaga</button>
        <div className="card mb-4">
          <h2 className="text-xl font-bold dark:text-white mb-2">{selected.title}</h2>
          <p className="text-gray-500 mb-4">{selected.description}</p>
          {selected.starterCode && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{selected.starterCode}</pre>
            </div>
          )}
        </div>
        <div className="card">
          <h3 className="font-medium dark:text-white mb-2">Yechimingiz:</h3>
          <textarea value={code} onChange={e => setCode(e.target.value)} className="input-field h-48 font-mono" placeholder="Kod yozing..." />
          <button onClick={() => submit.mutate({ code })} className="btn-primary mt-3" disabled={!code.trim()}>Topshirish</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">💻 Kodlash</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((c: any) => (
          <div key={c.id} onClick={() => { setSelectedId(c.id); setCode(c.starterCode || ''); }} className="card hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="font-medium dark:text-white">{c.title}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{c.description}</p>
            <p className="text-sm text-green-600 mt-2 font-medium">+{c.xpReward} XP</p>
          </div>
        ))}
        {challenges.length === 0 && <p className="col-span-2 card text-center text-gray-500 py-8">Hali topshiriq yo'q</p>}
      </div>
    </div>
  );
}
