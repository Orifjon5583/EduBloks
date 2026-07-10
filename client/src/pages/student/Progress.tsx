import { useQuery } from '@tanstack/react-query';
import api from '../../api';

export default function StudentProgress() {
  const { data } = useQuery({ queryKey: ['my-stats'], queryFn: () => api.get('/rankings/me').then(r => r.data) });

  const courses = [
    { name: 'HTML', progress: 0, color: 'bg-orange-500' },
    { name: 'CSS', progress: 0, color: 'bg-blue-500' },
    { name: 'JavaScript', progress: 0, color: 'bg-yellow-500' },
    { name: 'Typing', progress: 0, color: 'bg-green-500' },
    { name: 'Quiz', progress: 0, color: 'bg-purple-500' },
    { name: 'Projects', progress: 0, color: 'bg-pink-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">📊 Progress</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">{data?.totalXP || 0}</p>
          <p className="text-sm text-gray-500">Jami XP</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-purple-600">{data?.rank || 'Beginner'}</p>
          <p className="text-sm text-gray-500">Daraja</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-orange-600">{data?.streak || 0} kun</p>
          <p className="text-sm text-gray-500">Streak</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold dark:text-white mb-6">Kurs bo'yicha progress</h2>
        <div className="space-y-5">
          {courses.map(course => (
            <div key={course.name}>
              <div className="flex justify-between mb-2">
                <span className="font-medium dark:text-white">{course.name}</span>
                <span className="text-sm text-gray-500">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className={`${course.color} h-3 rounded-full transition-all duration-500`} style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="text-lg font-semibold dark:text-white mb-4">Daraja tizimi</h2>
        <div className="grid grid-cols-7 gap-2">
          {['Beginner', 'Student', 'Junior', 'Middle', 'Senior', 'Master', 'Legend'].map((rank, i) => (
            <div key={rank} className={`text-center p-2 rounded-lg text-xs ${data?.rank === rank ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold ring-2 ring-primary-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
              {rank}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
