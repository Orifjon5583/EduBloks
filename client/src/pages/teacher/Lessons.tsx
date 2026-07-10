import { useQuery } from '@tanstack/react-query';
import api from '../../api';
export default function Lessons() {
  const {data:lessons=[]}=useQuery({queryKey:['lessons'],queryFn:()=>api.get('/lessons').then(r=>r.data)});
  return <div><h1 className="text-2xl font-bold mb-6 dark:text-white">Darslar</h1>
    <div className="space-y-3">{lessons.map((l:any)=><div key={l.id} className="card"><h3 className="font-medium dark:text-white">{l.title}</h3><p className="text-sm text-gray-500">{l.topic?.course?.name} / {l.topic?.name}</p></div>)}</div>
    {lessons.length===0&&<p className="card text-center text-gray-500 py-8">Hali dars yo'q</p>}
  </div>;
}
