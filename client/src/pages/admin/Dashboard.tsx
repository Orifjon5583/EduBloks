import { useQuery } from '@tanstack/react-query';
import api from '../../api';
export default function AdminDashboard() {
  const {data,isLoading}=useQuery({queryKey:['admin-dash'],queryFn:()=>api.get('/dashboard/admin').then(r=>r.data)});
  if(isLoading) return <p>Yuklanmoqda...</p>;
  const stats = [{l:'Filiallar',v:data?.totalBranches},{l:"O'qituvchilar",v:data?.totalTeachers},{l:'Guruhlar',v:data?.totalGroups},{l:'Talabalar',v:data?.totalStudents},{l:'Faol',v:data?.activeUsers},{l:'Jami XP',v:data?.totalXP},{l:'Quizlar',v:data?.totalQuizzes},{l:'Figma',v:data?.activeFigmaTasks}];
  return <div><h1 className="text-2xl font-bold mb-6 dark:text-white">Dashboard</h1>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{stats.map(s=><div key={s.l} className="card"><p className="text-2xl font-bold dark:text-white">{s.v||0}</p><p className="text-sm text-gray-500">{s.l}</p></div>)}</div>
    {data?.pendingXPRequests>0&&<div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-800 dark:text-yellow-200">⚡ {data.pendingXPRequests} XP so'rov kutmoqda</div>}
  </div>;
}
