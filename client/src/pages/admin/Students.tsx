import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';
export default function Students() {
  const [show,setShow]=useState(false); const [form,setForm]=useState({firstName:'',lastName:'',groupId:''});
  const [search,setSearch]=useState(''); const [page,setPage]=useState(1); const qc=useQueryClient();
  const {data}=useQuery({queryKey:['students',page,search],queryFn:()=>api.get(`/students?page=${page}&search=${search}`).then(r=>r.data)});
  const {data:groups=[]}=useQuery({queryKey:['groups'],queryFn:()=>api.get('/groups').then(r=>r.data)});
  const add=useMutation({mutationFn:(d:any)=>api.post('/students',d),onSuccess:(r)=>{qc.invalidateQueries({queryKey:['students']});toast.success(`Yaratildi! Login: ${r.data.generatedLogin} Parol: ${r.data.generatedPassword}`,{duration:10000});setShow(false);}});
  const del=useMutation({mutationFn:(id:string)=>api.delete(`/students/${id}`),onSuccess:()=>{qc.invalidateQueries({queryKey:['students']});toast.success("O'chirildi");}});
  const reset=useMutation({mutationFn:(id:string)=>api.post(`/students/${id}/reset-credentials`),onSuccess:(r)=>{toast.success(`Yangi: ${r.data.login} / ${r.data.password}`,{duration:10000});}});
  return <div><div className="flex justify-between mb-4"><h1 className="text-2xl font-bold dark:text-white">Talabalar</h1><button onClick={()=>setShow(true)} className="btn-primary">+ Yangi</button></div>
    <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Qidirish..." className="input-field max-w-sm mb-4"/>
    {show&&<form onSubmit={e=>{e.preventDefault();add.mutate(form);}} className="card mb-4 grid grid-cols-3 gap-3"><input value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} placeholder="Ism" className="input-field" required/><input value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} placeholder="Familiya" className="input-field" required/><select value={form.groupId} onChange={e=>setForm({...form,groupId:e.target.value})} className="input-field"><option value="">Guruh</option>{groups.map((g:any)=><option key={g.id} value={g.id}>{g.name}</option>)}</select><p className="text-sm text-gray-500 col-span-3">Login/parol avtomatik yaratiladi</p><div className="flex gap-2 col-span-3"><button className="btn-primary">Yaratish</button><button type="button" onClick={()=>setShow(false)} className="btn-secondary">Bekor</button></div></form>}
    <div className="card"><table className="w-full"><thead><tr className="border-b dark:border-gray-700"><th className="text-left p-3">Ism</th><th className="text-left p-3">Login</th><th className="text-left p-3">Guruh</th><th className="p-3">Amallar</th></tr></thead><tbody>
      {data?.students?.map((s:any)=><tr key={s.id} className="border-b dark:border-gray-700"><td className="p-3 dark:text-white">{s.firstName} {s.lastName}</td><td className="p-3 font-mono text-gray-500">{s.login}</td><td className="p-3 text-gray-500">{s.studentGroups?.map((g:any)=>g.group.name).join(', ')||'-'}</td><td className="p-3 text-center space-x-2"><button onClick={()=>reset.mutate(s.id)} className="text-yellow-600 text-sm">🔑</button><button onClick={()=>del.mutate(s.id)} className="text-red-600 text-sm">🗑</button></td></tr>)}
    </tbody></table>{data?.totalPages>1&&<div className="flex justify-center gap-1 mt-4">{Array.from({length:data.totalPages},(_,i)=><button key={i} onClick={()=>setPage(i+1)} className={`px-3 py-1 rounded ${page===i+1?'bg-primary-600 text-white':'bg-gray-200 dark:bg-gray-700'}`}>{i+1}</button>)}</div>}</div>
  </div>;
}
