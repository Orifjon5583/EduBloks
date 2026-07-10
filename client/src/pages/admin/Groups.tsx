import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api';
export default function Groups() {
  const [show,setShow]=useState(false); const [form,setForm]=useState({name:'',teacherId:'',branchId:''});
  const qc=useQueryClient();
  const {data:groups=[]}=useQuery({queryKey:['groups'],queryFn:()=>api.get('/groups').then(r=>r.data)});
  const {data:teachers=[]}=useQuery({queryKey:['teachers'],queryFn:()=>api.get('/teachers').then(r=>r.data)});
  const add=useMutation({mutationFn:(d:any)=>api.post('/groups',d),onSuccess:()=>{qc.invalidateQueries({queryKey:['groups']});toast.success('Yaratildi');setShow(false);}});
  const del=useMutation({mutationFn:(id:string)=>api.delete(`/groups/${id}`),onSuccess:()=>{qc.invalidateQueries({queryKey:['groups']});toast.success("O'chirildi");}});
  return <div><div className="flex justify-between mb-6"><h1 className="text-2xl font-bold dark:text-white">Guruhlar</h1><button onClick={()=>setShow(true)} className="btn-primary">+ Yangi</button></div>
    {show&&<form onSubmit={e=>{e.preventDefault();add.mutate(form);}} className="card mb-4 grid grid-cols-3 gap-3"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Guruh nomi" className="input-field" required/><select value={form.teacherId} onChange={e=>setForm({...form,teacherId:e.target.value})} className="input-field"><option value="">O'qituvchi</option>{teachers.map((t:any)=><option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}</select><div className="flex gap-2"><button className="btn-primary">Saqlash</button><button type="button" onClick={()=>setShow(false)} className="btn-secondary">Bekor</button></div></form>}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{groups.map((g:any)=><div key={g.id} className="card"><div className="flex justify-between"><h3 className="font-semibold dark:text-white">{g.name}</h3><button onClick={()=>del.mutate(g.id)} className="text-red-500 text-sm">✕</button></div><p className="text-sm text-gray-500 mt-1">O'qituvchi: {g.teacher?`${g.teacher.firstName} ${g.teacher.lastName}`:'-'}</p><p className="text-sm text-gray-500">👥 {g._count?.students||0} talaba</p></div>)}</div>
  </div>;
}
