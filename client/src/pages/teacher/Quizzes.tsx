import { useQuery } from '@tanstack/react-query';
import api from '../../api';
export default function Quizzes() {
  const {data:quizzes=[]}=useQuery({queryKey:['quizzes'],queryFn:()=>api.get('/quizzes').then(r=>r.data)});
  return <div><h1 className="text-2xl font-bold mb-6 dark:text-white">Quizlar</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{quizzes.map((q:any)=><div key={q.id} className="card"><h3 className="font-semibold dark:text-white">{q.title}</h3><p className="text-sm text-gray-500">{q._count?.questions||0} savol</p></div>)}</div>
    {quizzes.length===0&&<p className="card text-center text-gray-500 py-8">Hali quiz yo'q</p>}
  </div>;
}
