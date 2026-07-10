import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';
export default function XPApproval() {
  const qc=useQueryClient();
  const {data:reqs=[]}=useQuery({queryKey:['xp-reqs'],queryFn:()=>api.get('/xp/requests').then(r=>r.data)});
  const approve=useMutation({mutationFn:(id:string)=>api.put(`/xp/requests/${id}/approve`),onSuccess:()=>{qc.invalidateQueries({queryKey:['xp-reqs']});toast.success('Tasdiqlandi');}});
  const reject=useMutation({mutationFn:(id:string)=>api.put(`/xp/requests/${id}/reject`),onSuccess:()=>{qc.invalidateQueries({queryKey:['xp-reqs']});toast.success('Rad etildi');}});
  return <div><h1 className="text-2xl font-bold mb-6 dark:text-white">XP Tasdiqlash</h1>
    {reqs.length===0?<p className="card text-center text-gray-500 py-8">So'rov yo'q</p>:
    <div className="space-y-3">{reqs.map((r:any)=><div key={r.id} className="card flex justify-between items-center"><div><p className="font-medium dark:text-white">{r.student.firstName} {r.student.lastName} — <span className="text-primary-600">{r.amount} XP</span></p><p className="text-sm text-gray-500">Sabab: {r.reason} • O'qituvchi: {r.teacher.firstName}</p></div><div className="flex gap-2"><button onClick={()=>approve.mutate(r.id)} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg">✓</button><button onClick={()=>reject.mutate(r.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg">✗</button></div></div>)}</div>}
  </div>;
}
