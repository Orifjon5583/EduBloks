import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../api';

const WORDS = ['browser','website','developer','algorithm','responsive','framework','database','server','function','variable','component','interface','protocol','frontend','backend','terminal','compiler','debugger','repository','deployment'];

export default function Typing() {
  const [mode,setMode]=useState(30);
  const [words,setWords]=useState<string[]>([]);
  const [idx,setIdx]=useState(0);
  const [input,setInput]=useState('');
  const [started,setStarted]=useState(false);
  const [done,setDone]=useState(false);
  const [time,setTime]=useState(30);
  const [correct,setCorrect]=useState(0);
  const [total,setTotal]=useState(0);
  const ref=useRef<HTMLInputElement>(null);
  const save=useMutation({mutationFn:(d:any)=>api.post('/typing/result',d)});

  const start = () => {
    const w = [...WORDS].sort(()=>Math.random()-0.5).concat([...WORDS].sort(()=>Math.random()-0.5));
    setWords(w); setIdx(0); setInput(''); setStarted(true); setDone(false);
    setCorrect(0); setTotal(0); setTime(mode);
    setTimeout(()=>ref.current?.focus(),100);
  };

  useEffect(()=>{
    if(!started||done) return;
    if(time<=0){ setDone(true); const wpm=Math.round((correct/mode)*60); save.mutate({wpm,accuracy:total?Math.round((correct/total)*100):0,mode:`${mode}s`,duration:mode}); return; }
    const t=setTimeout(()=>setTime(v=>v-1),1000); return ()=>clearTimeout(t);
  },[started,done,time]);

  const handle = (e:any) => {
    const v=e.target.value;
    if(v.endsWith(' ')){ const w=v.trim(); setTotal(t=>t+1); if(w===words[idx]) setCorrect(c=>c+1); setIdx(i=>i+1); setInput(''); }
    else setInput(v);
  };

  const wpm=done?Math.round((correct/mode)*60):0;
  const acc=done&&total?Math.round((correct/total)*100):0;

  if(!started&&!done) return (
    <div><h1 className="text-2xl font-bold mb-6 dark:text-white">Typing Practice</h1>
    <div className="card text-center py-12"><h2 className="text-xl font-semibold dark:text-white mb-6">Rejim</h2>
    <div className="flex justify-center gap-3 mb-8">{[15,30,60,120].map(m=><button key={m} onClick={()=>setMode(m)} className={`px-4 py-2 rounded-lg ${mode===m?'bg-primary-600 text-white':'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>{m}s</button>)}</div>
    <button onClick={start} className="btn-primary text-lg px-8 py-3">Boshlash</button></div></div>
  );

  if(started&&!done) return (
    <div><h1 className="text-2xl font-bold mb-6 dark:text-white">Typing Practice</h1>
    <div className="card"><div className="flex justify-between mb-4"><span className="text-2xl font-bold text-primary-600">{time}s</span><span className="text-gray-500">{correct}/{total}</span></div>
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-4 font-mono text-lg">{words.slice(idx,idx+20).map((w,i)=><span key={i} className={`mr-2 ${i===0?'text-primary-600 font-bold underline':'text-gray-500'}`}>{w}</span>)}</div>
    <input ref={ref} value={input} onChange={handle} className="input-field text-xl font-mono" autoFocus/></div></div>
  );

  return (
    <div><h1 className="text-2xl font-bold mb-6 dark:text-white">Typing Practice</h1>
    <div className="card text-center py-12"><h2 className="text-4xl font-bold text-primary-600 mb-2">{wpm} WPM</h2>
    <p className="text-xl text-gray-500 mb-6">Aniqlik: {acc}%</p>
    <button onClick={start} className="btn-primary">Qayta boshlash</button></div></div>
  );
}