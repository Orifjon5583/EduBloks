import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';

export default function TeacherCoding() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', starterCode: '', topicId: '', xpReward: '20' });
  const qc = useQueryClient();

  const { data: challenges = [] } = useQuery({ queryKey: ['coding'], queryFn: () => api.get('/coding').then(r => r.data) });

  const add = useMutation({
    mutationFn: (d: any) => api.post('/coding', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['coding'] }); toast.success('Yaratildi'); setShow(false); }
  });
  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/coding/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['coding'] }); toast.success("O'chirildi"); }
  });

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Kodlash Topshiriqlari</h1>
        <button onClick={() => setShow(true)} className="btn-primary">+ Yangi</button>
      </div>

      {show && (
        <form onSubmit={e => { e.preventDefault(); add.mutate({ ...form, xpReward: parseInt(form.xpReward) }); }} className="card mb-4 space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Sarlavha" className="input-field" required />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Tavsif" className="input-field h-24" required />
          <textarea value={form.starterCode} onChange={e => setForm({ ...form, starterCode: e.target.value })} placeholder="Boshlang'ich kod (ixtiyoriy)" className="input-field h-32 font-mono" />
          <input value={form.xpReward} onChange={e => setForm({ ...form, xpReward: e.target.value })} placeholder="XP" type="number" className="input-field w-32" />
          <div className="flex gap-2">
            <button className="btn-primary">Yaratish</button>
            <button type="button" onClick={() => setShow(false)} className="btn-secondary">Bekor</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {challenges.map((c: any) => (
          <div key={c.id} className="card flex justify-between items-center">
            <div>
              <h3 className="font-medium dark:text-white">{c.title}</h3>
              <p className="text-sm text-gray-500">{c.topic?.course?.name} / {c.topic?.name} • {c.xpReward} XP</p>
            </div>
            <button onClick={() => del.mutate(c.id)} className="text-red-500 text-sm">O'chirish</button>
          </div>
        ))}
        {challenges.length === 0 && <p className="card text-center text-gray-500 py-8">Hali topshiriq yo'q</p>}
      </div>
    </div>
  );
}
