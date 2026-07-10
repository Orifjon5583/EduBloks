import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';
export default function Library() {
  const qc=useQueryClient();
  const {data:items=[]}=useQuery({queryKey:['library'],queryFn:()=>api.get('/library').then(r=>r.data)});
  const copy=useMutation({mutationFn:(id:string)=>api.post(`/library/${id}/copy`),onSuccess:()=>{qc.invalidateQueries({queryKey:['library']});toast.success('Nusxa olindi');}});
  return <div><h1 className="text-2xl font-bold mb-6 dark:text-white">Kutubxona</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{items.map((i:any)=><div key={i.id} className="card"><span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">{i.type}</span><h3 className="font-medium dark:text-white mt-2">{i.title}</h3><p className="text-xs text-gray-500">Muallif: {i.author?.firstName} {i.author?.lastName}</p><button onClick={()=>copy.mutate(i.id)} className="mt-3 text-sm text-primary-600">📋 Nusxa olish</button></div>)}</div>
    {items.length===0&&<p className="card text-center text-gray-500 py-8">Kutubxona bo'sh</p>}
  </div>;
}
