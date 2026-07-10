import { useQuery } from '@tanstack/react-query';
import api from '../../api';
export default function Logs() {
  const {data}=useQuery({queryKey:['logs'],queryFn:()=>api.get('/logs').then(r=>r.data)});
  return <div><h1 className="text-2xl font-bold mb-6 dark:text-white">Tizim Loglari</h1>
    <div className="card"><table className="w-full"><thead><tr className="border-b dark:border-gray-700"><th className="text-left p-3">Vaqt</th><th className="text-left p-3">Foydalanuvchi</th><th className="text-left p-3">Amal</th><th className="text-left p-3">Tafsilot</th></tr></thead><tbody>
      {data?.logs?.map((l:any)=><tr key={l.id} className="border-b dark:border-gray-700"><td className="p-3 text-sm text-gray-500">{new Date(l.createdAt).toLocaleString()}</td><td className="p-3 dark:text-white">{l.user?`${l.user.firstName} ${l.user.lastName}`:'-'}</td><td className="p-3"><span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">{l.action}</span></td><td className="p-3 text-sm text-gray-500">{l.details||'-'}</td></tr>)}
    </tbody></table></div>
  </div>;
}
