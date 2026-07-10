import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';

export default function TeacherTyping() {
  const [show, setShow] = useState(false);
  const [words, setWords] = useState('');
  const [topicId, setTopicId] = useState('');
  const qc = useQueryClient();

  const { data: lists = [] } = useQuery({ queryKey: ['typing'], queryFn: () => api.get('/typing').then(r => r.data) });
  const { data: topics = [] } = useQuery({ queryKey: ['topics'], queryFn: () => api.get('/lessons').then(r => {
    const seen = new Map();
    r.data.forEach((l: any) => { if (l.topic && !seen.has(l.topic.id)) seen.set(l.topic.id, l.topic); });
    return Array.from(seen.values());
  })});

  const add = useMutation({
    mutationFn: (d: any) => api.post('/typing', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['typing'] }); toast.success('Saqlandi'); setShow(false); setWords(''); }
  });
  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/typing/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['typing'] }); toast.success("O'chirildi"); }
  });

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Typing So'z Ro'yxatlari</h1>
        <button onClick={() => setShow(true)} className="btn-primary">+ Yangi</button>
      </div>

      {show && (
        <form onSubmit={e => { e.preventDefault(); add.mutate({ topicId, words: words.split(',').map(w => w.trim()).filter(Boolean) }); }} className="card mb-4 space-y-3">
          <select value={topicId} onChange={e => setTopicId(e.target.value)} className="input-field" required>
            <option value="">Mavzu tanlang</option>
            {topics.map((t: any) => <option key={t.id} value={t.id}>{t.course?.name} / {t.name}</option>)}
          </select>
          <textarea value={words} onChange={e => setWords(e.target.value)} placeholder="So'zlarni vergul bilan yozing: browser, website, developer..." className="input-field h-32" required />
          <div className="flex gap-2">
            <button className="btn-primary">Saqlash</button>
            <button type="button" onClick={() => setShow(false)} className="btn-secondary">Bekor</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {lists.map((wl: any) => (
          <div key={wl.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-2">{wl.topic?.course?.name} / {wl.topic?.name}</p>
                <div className="flex flex-wrap gap-2">
                  {wl.words?.slice(0, 20).map((w: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm dark:text-white">{w}</span>
                  ))}
                  {wl.words?.length > 20 && <span className="text-sm text-gray-500">+{wl.words.length - 20} ta</span>}
                </div>
              </div>
              <button onClick={() => del.mutate(wl.id)} className="text-red-500 text-sm">O'chirish</button>
            </div>
          </div>
        ))}
        {lists.length === 0 && <p className="card text-center text-gray-500 py-8">Hali so'z ro'yxati yo'q</p>}
      </div>
    </div>
  );
}
