import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';

export default function StudentFigma() {
  const [submitId, setSubmitId] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const qc = useQueryClient();

  const { data: challenges = [] } = useQuery({ queryKey: ['figma'], queryFn: () => api.get('/figma').then(r => r.data) });

  const submit = useMutation({
    mutationFn: (data: any) => api.post(`/figma/${submitId}/submit`, data),
    onSuccess: () => { toast.success('Topshirildi! ✅'); setSubmitId(null); setGithubUrl(''); setDemoUrl(''); qc.invalidateQueries({ queryKey: ['figma'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Xatolik')
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">🎨 Figma Loyihalar</h1>
      <div className="space-y-4">
        {challenges.map((c: any) => {
          const expired = new Date(c.deadline) < new Date();
          const timeLeft = Math.max(0, Math.floor((new Date(c.deadline).getTime() - Date.now()) / 3600000));
          return (
            <div key={c.id} className={`card ${expired ? 'opacity-60' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium dark:text-white text-lg">{c.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{c.description?.slice(0, 200)}</p>
                  {c.figmaLink && <a href={c.figmaLink} target="_blank" rel="noreferrer" className="text-sm text-primary-600 hover:underline mt-2 inline-block">🔗 Figma dizayn</a>}
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm font-bold text-primary-600">{c.score} ball</span>
                    {expired ? (
                      <span className="text-sm text-red-600">⏰ Muddati tugagan</span>
                    ) : (
                      <span className="text-sm text-orange-600">⏰ {timeLeft} soat qoldi</span>
                    )}
                  </div>
                </div>
              </div>

              {!expired && submitId === c.id && (
                <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-3">
                  <input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="GitHub URL" className="input-field" />
                  <input value={demoUrl} onChange={e => setDemoUrl(e.target.value)} placeholder="Live Demo URL" className="input-field" />
                  <div className="flex gap-2">
                    <button onClick={() => submit.mutate({ githubUrl, demoUrl })} className="btn-primary">Yuborish</button>
                    <button onClick={() => setSubmitId(null)} className="btn-secondary">Bekor</button>
                  </div>
                </div>
              )}

              {!expired && submitId !== c.id && (
                <button onClick={() => setSubmitId(c.id)} className="btn-primary mt-4">Topshirish</button>
              )}
            </div>
          );
        })}
        {challenges.length === 0 && <p className="card text-center text-gray-500 py-8">Hali Figma topshiriq yo'q</p>}
      </div>
    </div>
  );
}
