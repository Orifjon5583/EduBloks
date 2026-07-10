import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';

export default function Reviews() {
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data: challenges = [] } = useQuery({
    queryKey: ['figma-reviews'],
    queryFn: () => api.get('/figma').then(r => r.data)
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.post(`/figma/submissions/${id}/review`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['figma-reviews'] }); toast.success('Baholandi'); setReviewingId(null); setScore(''); setFeedback(''); }
  });

  const pendingSubs = challenges.flatMap((c: any) =>
    (c.submissions || []).filter((s: any) => !s.reviewed).map((s: any) => ({ ...s, challengeTitle: c.title }))
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Tekshirishlar</h1>

      {pendingSubs.length === 0 ? (
        <p className="card text-center text-gray-500 py-8">Tekshirilmagan topshiriq yo'q ✅</p>
      ) : (
        <div className="space-y-4">
          {pendingSubs.map((sub: any) => (
            <div key={sub.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium dark:text-white">{sub.challengeTitle}</h3>
                  <p className="text-sm text-gray-500">{sub.student?.firstName} {sub.student?.lastName}</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Kutilmoqda</span>
              </div>

              <div className="flex gap-4 text-sm mb-3">
                {sub.githubUrl && <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">🔗 GitHub</a>}
                {sub.demoUrl && <a href={sub.demoUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">🌐 Demo</a>}
                {sub.fileUrl && <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">📁 ZIP</a>}
              </div>

              {reviewingId === sub.id ? (
                <div className="space-y-2 border-t dark:border-gray-700 pt-3">
                  <input value={score} onChange={e => setScore(e.target.value)} type="number" placeholder="Ball (0-100)" className="input-field w-40" />
                  <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Izoh..." className="input-field h-20" />
                  <div className="flex gap-2">
                    <button onClick={() => reviewMutation.mutate({ id: sub.id, data: { score: parseInt(score), feedback } })} className="btn-primary">Baholash</button>
                    <button onClick={() => setReviewingId(null)} className="btn-secondary">Bekor</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setReviewingId(sub.id)} className="text-sm text-primary-600 hover:underline">Baholash →</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
