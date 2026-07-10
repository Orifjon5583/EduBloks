import { useQuery } from '@tanstack/react-query';
import api from '../../api';
export default function Rankings() {
  const {data:rankings=[]}=useQuery({queryKey:['rankings'],queryFn:()=>api.get('/rankings').then(r=>r.data)});
  return <div><h1 className="text-2xl font-bold mb-6 dark:text-white">Reytinglar</h1>
    <div className="card"><table className="w-full"><thead><tr className="border-b dark:border-gray-700"><th className="text-left p-3">#</th><th className="text-left p-3">Ism</th><th className="text-left p-3">XP</th><th className="text-left p-3">Daraja</th><th className="text-left p-3">Level</th></tr></thead><tbody>
      {rankings.map((s:any,i:number)=><tr key={s.id} className="border-b dark:border-gray-700"><td className="p-3 font-bold">{i+1}</td><td className="p-3 dark:text-white">{s.firstName} {s.lastName}</td><td className="p-3 font-bold text-primary-600">{s.totalXP}</td><td className="p-3"><span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">{s.rank}</span></td><td className="p-3 text-gray-500">Lvl {s.level}</td></tr>)}
    </tbody></table></div>
  </div>;
}
