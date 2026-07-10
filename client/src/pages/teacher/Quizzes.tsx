import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';

interface Question { question: string; options: string[]; correctAnswer: number; }

export default function TeacherQuizzes() {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [topicId, setTopicId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  const qc = useQueryClient();

  const { data: quizzes = [] } = useQuery({ queryKey: ['quizzes'], queryFn: () => api.get('/quizzes').then(r => r.data) });
  const { data: topics = [] } = useQuery({ queryKey: ['topics-list'], queryFn: () => api.get('/topics').then(r => r.data) });

  const add = useMutation({
    mutationFn: (d: any) => api.post('/quizzes', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['quizzes'] }); toast.success('Quiz yaratildi'); setShow(false); setTitle(''); setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]); }
  });
  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/quizzes/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['quizzes'] }); toast.success("O'chirildi"); }
  });

  const addQ = () => setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  const updateQ = (i: number, field: string, val: any) => {
    const q = [...questions]; (q[i] as any)[field] = val; setQuestions(q);
  };
  const updateOpt = (qi: number, oi: number, val: string) => {
    const q = [...questions]; q[qi].options[oi] = val; setQuestions(q);
  };
  const removeQ = (i: number) => setQuestions(questions.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Quizlar</h1>
        <button onClick={() => setShow(true)} className="btn-primary">+ Yangi quiz</button>
      </div>

      {show && (
        <div className="card mb-6 space-y-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Quiz nomi" className="input-field" required />
          <select value={topicId} onChange={e => setTopicId(e.target.value)} className="input-field">
            <option value="">Mavzu tanlang</option>
            {topics.map((t: any) => <option key={t.id} value={t.id}>{t.course?.name} / {t.name}</option>)}
          </select>

          <h3 className="font-semibold dark:text-white">Savollar:</h3>
          {questions.map((q, qi) => (
            <div key={qi} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium dark:text-white">Savol {qi + 1}</span>
                {questions.length > 1 && <button onClick={() => removeQ(qi)} className="text-red-500 text-sm">O'chirish</button>}
              </div>
              <input value={q.question} onChange={e => updateQ(qi, 'question', e.target.value)} placeholder="Savol matni" className="input-field" />
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi} onChange={() => updateQ(qi, 'correctAnswer', oi)} />
                  <input value={opt} onChange={e => updateOpt(qi, oi, e.target.value)} placeholder={`Variant ${oi + 1}`} className="input-field" />
                </div>
              ))}
            </div>
          ))}
          <button onClick={addQ} className="btn-secondary">+ Savol qo'shish</button>

          <div className="flex gap-2">
            <button onClick={() => add.mutate({ title, topicId, questions })} className="btn-primary" disabled={!title || questions.some(q => !q.question || q.options.some(o => !o))}>Saqlash</button>
            <button onClick={() => setShow(false)} className="btn-secondary">Bekor</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((q: any) => (
          <div key={q.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold dark:text-white">{q.title}</h3>
                <p className="text-sm text-gray-500">{q._count?.questions || 0} savol • {q._count?.attempts || 0} urinish</p>
                <p className="text-xs text-gray-400 mt-1">{q.topic?.course?.name} / {q.topic?.name}</p>
              </div>
              <button onClick={() => del.mutate(q.id)} className="text-red-500 text-sm">✕</button>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && <p className="col-span-3 card text-center text-gray-500 py-8">Hali quiz yo'q</p>}
      </div>
    </div>
  );
}
