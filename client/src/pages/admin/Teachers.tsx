import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';
export default function Teachers() {
  const [show,setShow]=useState(false); const [form,setForm]=useState({firstName:'',lastName:'',login:'',password:'',branchId:''});
  const qc=useQueryClient();
  const {data:teachers=[]}=useQuery({queryKey:['teachers'],queryFn:()=>api.get('/teachers').then(r=>r.data)});
  const {data:branches=[]}=useQuery({queryKey:['branches'],queryFn:()=>api.get('/branches').then(r=>r.data)});
  const add=useMutation({mutationFn:(d:any)=>api.post('/teachers',d),onSuccess:()=>{qc.invalidateQueries({queryKey:['teachers']});toast.success('Yaratildi');setShow(false);}});
  const del=useMutation({mutationFn:(id:string)=>api.delete(`/teachers/${id}`),onSuccess:()=>{qc.invalidateQueries({queryKey:['teachers']});toast.success("O'chirildi");}});
  return <div><div className="flex justify-between mb-6"><h1 className="text-2xl font-bold dark:text-white">O'qituvchilar</h1><button onClick={()=>setShow(true)} className="btn-primary">+ Yangi</button></div>
    {show&&<form onSubmit={e=>{e.preventDefault();add.mutate(form);}} className="card mb-4 grid grid-cols-2 gap-3"><input value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} placeholder="Ism" className="input-field" required/><input value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} placeholder="Familiya" className="input-field" required/><input value={form.login} onChange={e=>setForm({...form,login:e.target.value})} placeholder="Login" className="input-field" required/><input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Parol" className="input-field" required/><select value={form.branchId} onChange={e=>setForm({...form,branchId:e.target.value})} className="input-field"><option value="">Filial</option>{branches.map((b:any)=><option key={b.id} value={b.id}>{b.name}</option>)}</select><div className="flex gap-2 col-span-2"><button className="btn-primary">Saqlash</button><button type="button" onClick={()=>setShow(false)} className="btn-secondary">Bekor</button></div></form>}
    <div className="card"><table className="w-full"><thead><tr className="border-b dark:border-gray-700"><th className="text-left p-3">Ism</th><th className="text-left p-3">Login</th><th className="text-left p-3">Filial</th><th className="p-3">Holat</th><th className="p-3">Amal</th></tr></thead><tbody>
      {teachers.map((t:any)=><tr key={t.id} className="border-b dark:border-gray-700"><td className="p-3 dark:text-white">{t.firstName} {t.lastName}</td><td className="p-3 text-gray-500">{t.login}</td><td className="p-3 text-gray-500">{t.branch?.name||'-'}</td><td className="p-3 text-center"><span className={`px-2 py-1 rounded-full text-xs ${t.isActive?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{t.isActive?'Faol':'Blok'}</span></td><td className="p-3 text-center"><button onClick={()=>del.mutate(t.id)} className="text-red-600 text-sm">O'chirish</button></td></tr>)}
    </tbody></table></div>
  </div>;
}
