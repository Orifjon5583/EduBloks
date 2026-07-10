import { useQuery } from '@tanstack/react-query';
import api from '../../api';
export default function TDashboard() {
  const {data}=useQuery({queryKey:['t-dash'],queryFn:()=>api.get('/dashboard/teacher').then(r=>r.data)});
  return <div><h1 className="text-2xl font-bold mb-6 dark:text-white">O'qituvchi Dashboard</h1>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="card"><p className="text-2xl font-bold dark:text-white">{data?.groups?.length||0}</p><p className="text-sm text-gray-500">Guruhlar</p></div>
      <div className="card"><p className="text-2xl font-bold dark:text-white">{data?.pendingReviews||0}</p><p className="text-sm text-gray-500">Tekshirilmagan</p></div>
      <div className="card"><p className="text-2xl font-bold dark:text-white">{data?.activeQuizzes||0}</p><p className="text-sm text-gray-500">Faol quiz</p></div>
      <div className="card"><p className="text-2xl font-bold dark:text-white">{data?.activeFigmaChallenges||0}</p><p className="text-sm text-gray-500">Faol Figma</p></div>
    </div>
  </div>;
}
