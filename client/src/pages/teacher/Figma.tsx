import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';

export default function TeacherFigma() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', figmaLink: '', score: '100', openTime: '', deadline: '', topicId: '' });
  const qc = useQueryClient();

  const { data: challenges = [] } = useQuery({ queryKey: ['figma'], queryFn: () => api.get('/figma').then(r => r.data) });

  const add = useMutation({
    mutationFn: (d: any) => api.post('/figma', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['figma'] }); toast.success('Yaratildi'); setShow(false); }
  });
  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/figma/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['figma'] }); toast.success("O'chirildi"); }
  });

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Figma Topshiriqlari</h1>
        <button onClick={() => setShow(true)} className="btn-primary">+ Yangi</button>
      </div>

      {show && (
        <form onSubmit={e => { e.preventDefault(); add.mutate({ ...form, score: parseInt(form.score) }); }} className="card mb-4 space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Sarlavha" className="input-field" required />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Tavsif" className="input-field h-24" required />
          <input value={form.figmaLink} onChange={e => setForm({ ...form, figmaLink: e.target.value })} placeholder="Figma link" className="input-field" />
          <div className="grid grid-cols-3 gap-3">
            <input value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} placeholder="Ball" type="number" className="input-field" />
            <input value={form.openTime} onChange={e => setForm({ ...form, openTime: e.target.value })} type="datetime-local" className="input-field" required />
            <input value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} type="datetime-local" className="input-field" required />
          </div>
          <div className="flex gap-2">
            <button className="btn-primary">Yaratish</button>
            <button type="button" onClick={() => setShow(false)} className="btn-secondary">Bekor</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {challenges.map((c: any) => (
          <div key={c.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium dark:text-white">{c.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Deadline: {new Date(c.deadline).toLocaleString()}</p>
                <p className="text-sm text-primary-600 font-bold">{c.score} ball • {c._count?.submissions || 0} topshiriq</p>
              </div>
              <button onClick={() => del.mutate(c.id)} className="text-red-500 text-sm">O'chirish</button>
            </div>
          </div>
        ))}
        {challenges.length === 0 && <p className="card text-center text-gray-500 py-8">Hali topshiriq yo'q</p>}
      </div>
    </div>
  );
}
