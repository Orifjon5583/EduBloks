import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';

export default function TeacherBugFix() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', buggyCode: '', solution: '', hint: '', topicId: '', xpReward: '10' });
  const qc = useQueryClient();

  const { data: exercises = [] } = useQuery({ queryKey: ['bugfix'], queryFn: () => api.get('/bugfix').then(r => r.data) });

  const add = useMutation({
    mutationFn: (d: any) => api.post('/bugfix', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bugfix'] }); toast.success('Yaratildi'); setShow(false); }
  });
  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/bugfix/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bugfix'] }); toast.success("O'chirildi"); }
  });

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Bug Fix Mashqlari</h1>
        <button onClick={() => setShow(true)} className="btn-primary">+ Yangi</button>
      </div>

      {show && (
        <form onSubmit={e => { e.preventDefault(); add.mutate({ ...form, xpReward: parseInt(form.xpReward) }); }} className="card mb-4 space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Sarlavha" className="input-field" required />
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Tavsif" className="input-field" />
          <textarea value={form.buggyCode} onChange={e => setForm({ ...form, buggyCode: e.target.value })} placeholder="Xatoli kod" className="input-field h-32 font-mono" required />
          <textarea value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} placeholder="To'g'ri javob" className="input-field h-32 font-mono" required />
          <input value={form.hint} onChange={e => setForm({ ...form, hint: e.target.value })} placeholder="Yordam (ixtiyoriy)" className="input-field" />
          <input value={form.xpReward} onChange={e => setForm({ ...form, xpReward: e.target.value })} placeholder="XP mukofot" type="number" className="input-field w-32" />
          <div className="flex gap-2">
            <button className="btn-primary">Yaratish</button>
            <button type="button" onClick={() => setShow(false)} className="btn-secondary">Bekor</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {exercises.map((ex: any) => (
          <div key={ex.id} className="card flex justify-between items-center">
            <div>
              <h3 className="font-medium dark:text-white">{ex.title}</h3>
              <p className="text-sm text-gray-500">{ex.topic?.course?.name} / {ex.topic?.name} • {ex.xpReward} XP</p>
            </div>
            <button onClick={() => del.mutate(ex.id)} className="text-red-500 text-sm">O'chirish</button>
          </div>
        ))}
        {exercises.length === 0 && <p className="card text-center text-gray-500 py-8">Hali mashq yo'q</p>}
      </div>
    </div>
  );
}
