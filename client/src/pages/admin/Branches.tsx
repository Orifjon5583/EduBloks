import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';
export default function Branches() {
  const [show,setShow]=useState(false); const [name,setName]=useState(''); const [address,setAddress]=useState('');
  const qc=useQueryClient();
  const {data:branches=[]}=useQuery({queryKey:['branches'],queryFn:()=>api.get('/branches').then(r=>r.data)});
  const add=useMutation({mutationFn:(d:any)=>api.post('/branches',d),onSuccess:()=>{qc.invalidateQueries({queryKey:['branches']});toast.success('Yaratildi');setShow(false);setName('');setAddress('');}});
  const del=useMutation({mutationFn:(id:string)=>api.delete(`/branches/${id}`),onSuccess:()=>{qc.invalidateQueries({queryKey:['branches']});toast.success("O'chirildi");}});
  return <div><div className="flex justify-between mb-6"><h1 className="text-2xl font-bold dark:text-white">Filiallar</h1><button onClick={()=>setShow(true)} className="btn-primary">+ Yangi</button></div>
    {show&&<form onSubmit={e=>{e.preventDefault();add.mutate({name,address});}} className="card mb-4 space-y-3"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Nomi" className="input-field" required/><input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Manzil" className="input-field"/><div className="flex gap-2"><button className="btn-primary">Saqlash</button><button type="button" onClick={()=>setShow(false)} className="btn-secondary">Bekor</button></div></form>}
    <div className="card"><table className="w-full"><thead><tr className="border-b dark:border-gray-700"><th className="text-left p-3">Nomi</th><th className="text-left p-3">Manzil</th><th className="p-3">Amal</th></tr></thead><tbody>
      {branches.map((b:any)=><tr key={b.id} className="border-b dark:border-gray-700"><td className="p-3 dark:text-white">{b.name}</td><td className="p-3 text-gray-500">{b.address||'-'}</td><td className="p-3 text-center"><button onClick={()=>del.mutate(b.id)} className="text-red-600 text-sm">O'chirish</button></td></tr>)}
    </tbody></table>{branches.length===0&&<p className="text-center py-6 text-gray-500">Hali filial yo'q</p>}</div>
  </div>;
}
