import { useQuery } from '@tanstack/react-query';
import api from '../../api';
export default function SDashboard() {
  const {data}=useQuery({queryKey:['s-dash'],queryFn:()=>api.get('/dashboard/student').then(r=>r.data)});
  return <div><h1 className="text-2xl font-bold mb-6 dark:text-white">Mening Dashboard</h1>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="card"><p className="text-2xl font-bold text-yellow-600">{data?.xp||0}</p><p className="text-sm text-gray-500">XP</p></div>
      <div className="card"><p className="text-2xl font-bold text-purple-600">{data?.rank||'Beginner'}</p><p className="text-sm text-gray-500">Daraja</p></div>
      <div className="card"><p className="text-2xl font-bold text-blue-600">Lvl {data?.level||1}</p><p className="text-sm text-gray-500">Level</p></div>
      <div className="card"><p className="text-2xl font-bold text-orange-600">{data?.streak||0} kun</p><p className="text-sm text-gray-500">Streak</p></div>
    </div>
    {data?.deadlines?.length>0&&<div className="card"><h2 className="font-semibold dark:text-white mb-3">Yaqin muddatlar</h2>{data.deadlines.map((d:any)=><div key={d.id} className="flex justify-between py-2 border-b dark:border-gray-700 last:border-0"><span className="dark:text-white">{d.title}</span><span className="text-sm text-red-600">{new Date(d.deadline).toLocaleString()}</span></div>)}</div>}
  </div>;
}
