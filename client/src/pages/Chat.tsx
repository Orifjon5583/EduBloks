import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { useAuthStore } from '../store/auth';
export default function Chat() {
  const {user}=useAuthStore(); const [sel,setSel]=useState<string|null>(null); const [msg,setMsg]=useState(''); const qc=useQueryClient();
  const {data:convos=[]}=useQuery({queryKey:['convos'],queryFn:()=>api.get('/chat/conversations').then(r=>r.data)});
  const {data:msgs=[]}=useQuery({queryKey:['msgs',sel],queryFn:()=>sel?api.get(`/chat/messages/${sel}`).then(r=>r.data):[],enabled:!!sel});
  const send=useMutation({mutationFn:(d:any)=>api.post('/chat/send',d),onSuccess:()=>{qc.invalidateQueries({queryKey:['msgs',sel]});setMsg('');}});
  return <div className="h-[calc(100vh-6rem)]"><h1 className="text-2xl font-bold mb-4 dark:text-white">💬 Chat</h1>
    <div className="flex h-[calc(100%-3rem)] gap-4">
      <div className="w-64 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-y-auto">{convos.map((c:any)=><button key={c.partner.id} onClick={()=>setSel(c.partner.id)} className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${sel===c.partner.id?'bg-primary-50 dark:bg-primary-900/20':''}`}><p className="font-medium dark:text-white">{c.partner.firstName} {c.partner.lastName}</p><p className="text-xs text-gray-500 truncate">{c.lastMessage?.content}</p></button>)}{convos.length===0&&<p className="text-center text-gray-500 py-8 text-sm">Suhbat yo'q</p>}</div>
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">{msgs.map((m:any)=><div key={m.id} className={`flex ${m.senderId===user?.id?'justify-end':'justify-start'}`}><div className={`max-w-[70%] px-4 py-2 rounded-2xl ${m.senderId===user?.id?'bg-primary-600 text-white':'bg-gray-100 dark:bg-gray-700 dark:text-white'}`}><p>{m.content}</p></div></div>)}</div>
        {sel&&<form onSubmit={e=>{e.preventDefault();if(msg.trim()) send.mutate({receiverId:sel,content:msg});}} className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2"><input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Xabar..." className="input-field flex-1"/><button className="btn-primary">➤</button></form>}
      </div>
    </div>
  </div>;
}
