import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';

export default function TeacherLessons() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', topicId: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data: lessons = [] } = useQuery({ queryKey: ['lessons'], queryFn: () => api.get('/lessons').then(r => r.data) });
  const { data: topics = [] } = useQuery({ queryKey: ['all-topics'], queryFn: () => api.get('/lessons').then(r => {
    const seen = new Map();
    r.data.forEach((l: any) => { if (l.topic && !seen.has(l.topic.id)) seen.set(l.topic.id, l.topic); });
    return Array.from(seen.values());
  })});

  const save = useMutation({
    mutationFn: (d: any) => editId ? api.put(`/lessons/${editId}`, d) : api.post('/lessons', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['lessons'] }); toast.success('Saqlandi'); setShow(false); setEditId(null); setForm({ title: '', content: '', topicId: '' }); }
  });
  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/lessons/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['lessons'] }); toast.success("O'chirildi"); }
  });

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Darslar</h1>
        <button onClick={() => { setShow(true); setEditId(null); setForm({ title: '', content: '', topicId: '' }); }} className="btn-primary">+ Yangi dars</button>
      </div>

      {show && (
        <form onSubmit={e => { e.preventDefault(); save.mutate(form); }} className="card mb-6 space-y-4">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Dars nomi" className="input-field" required />
          <select value={form.topicId} onChange={e => setForm({ ...form, topicId: e.target.value })} className="input-field" required>
            <option value="">Mavzu tanlang</option>
            {topics.map((t: any) => <option key={t.id} value={t.id}>{t.course?.name} / {t.name}</option>)}
          </select>
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Dars matni (HTML/Markdown qo'llab-quvvatlanadi)" className="input-field h-48" required />
          <div className="flex gap-2">
            <button className="btn-primary">{editId ? 'Yangilash' : 'Yaratish'}</button>
            <button type="button" onClick={() => setShow(false)} className="btn-secondary">Bekor</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {lessons.map((l: any) => (
          <div key={l.id} className="card flex justify-between items-center">
            <div>
              <h3 className="font-medium dark:text-white">{l.title}</h3>
              <p className="text-sm text-gray-500">{l.topic?.course?.name} / {l.topic?.name}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditId(l.id); setForm({ title: l.title, content: l.content, topicId: l.topicId }); setShow(true); }} className="text-primary-600 text-sm">✏️</button>
              <button onClick={() => del.mutate(l.id)} className="text-red-500 text-sm">🗑</button>
            </div>
          </div>
        ))}
        {lessons.length === 0 && <p className="card text-center text-gray-500 py-8">Hali dars yo'q</p>}
      </div>
    </div>
  );
}
