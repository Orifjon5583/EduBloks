import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';

export default function StudentQuiz() {
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);

  const { data: quizzes = [] } = useQuery({ queryKey: ['quizzes'], queryFn: () => api.get('/quizzes').then(r => r.data) });

  const startQuiz = async (id: string) => {
    const { data } = await api.get(`/quizzes/${id}`);
    setActiveQuiz(data);
    setAnswers(new Array(data.questions.length).fill(-1));
    setResult(null);
  };

  const submit = useMutation({
    mutationFn: () => api.post(`/quizzes/${activeQuiz.id}/attempt`, { answers }),
    onSuccess: (res) => { setResult(res.data); toast.success(`Natija: ${res.data.score}/${res.data.total} • +${res.data.xp} XP`); }
  });

  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-12">
          <h2 className="text-3xl font-bold text-primary-600 mb-2">{result.score}/{result.total}</h2>
          <p className="text-xl text-gray-500 mb-2">To'g'ri javoblar</p>
          <p className="text-lg text-green-600 font-bold mb-6">+{result.xp} XP</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setActiveQuiz(null); setResult(null); }} className="btn-primary">Quizlarga qaytish</button>
          </div>
        </div>
      </div>
    );
  }

  if (activeQuiz) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">{activeQuiz.title}</h1>
          <span className="text-sm text-gray-500">{activeQuiz.questions.length} savol</span>
        </div>

        <div className="space-y-6">
          {activeQuiz.questions.map((q: any, qi: number) => (
            <div key={q.id} className="card">
              <p className="font-medium dark:text-white mb-3">{qi + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt: string, oi: number) => (
                  <label key={oi} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers[qi] === oi ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                    <input type="radio" name={`q-${qi}`} checked={answers[qi] === oi} onChange={() => { const a = [...answers]; a[qi] = oi; setAnswers(a); }} className="w-4 h-4" />
                    <span className="dark:text-white">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={() => setActiveQuiz(null)} className="btn-secondary">Bekor qilish</button>
          <button onClick={() => submit.mutate()} className="btn-primary" disabled={answers.includes(-1)}>
            Topshirish ({answers.filter(a => a !== -1).length}/{activeQuiz.questions.length})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">❓ Quizlar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((q: any) => (
          <div key={q.id} onClick={() => startQuiz(q.id)} className="card hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="font-semibold dark:text-white">{q.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{q._count?.questions || 0} savol</p>
            <p className="text-xs text-gray-400 mt-1">{q.topic?.course?.name} / {q.topic?.name}</p>
            <button className="btn-primary mt-3 text-sm">Boshlash →</button>
          </div>
        ))}
        {quizzes.length === 0 && <p className="col-span-3 card text-center text-gray-500 py-8">Hali quiz yo'q</p>}
      </div>
    </div>
  );
}
