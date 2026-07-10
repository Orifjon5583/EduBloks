import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminDashboard from './pages/admin/Dashboard';
import Branches from './pages/admin/Branches';
import Teachers from './pages/admin/Teachers';
import Groups from './pages/admin/Groups';
import Students from './pages/admin/Students';
import XPApproval from './pages/admin/XPApproval';
import Logs from './pages/admin/Logs';
import Rankings from './pages/admin/Rankings';
import TDashboard from './pages/teacher/Dashboard';
import TLessons from './pages/teacher/Lessons';
import TQuizzes from './pages/teacher/Quizzes';
import TTyping from './pages/teacher/Typing';
import TBugFix from './pages/teacher/BugFix';
import TCoding from './pages/teacher/Coding';
import TFigma from './pages/teacher/Figma';
import TLibrary from './pages/teacher/Library';
import TReviews from './pages/teacher/Reviews';
import SDashboard from './pages/student/Dashboard';
import SLessons from './pages/student/Lessons';
import STyping from './pages/student/Typing';
import SBugFix from './pages/student/BugFix';
import SCoding from './pages/student/Coding';
import SFigma from './pages/student/Figma';
import SProgress from './pages/student/Progress';
import SRankings from './pages/student/Rankings';
import Chat from './pages/Chat';

function Guard({children,roles}:{children:any,roles:string[]}) {
  const {user}=useAuthStore();
  if(!user) return <Navigate to="/login"/>;
  if(!roles.includes(user.role)) return <Navigate to="/login"/>;
  return children;
}
function home(role:string) {
  return role==='SUPER_ADMIN'?'/admin':role==='TEACHER'?'/teacher':'/student';
}

export default function App() {
  const {user}=useAuthStore();
  return <Routes>
    <Route path="/login" element={!user?<Login/>:<Navigate to={home(user.role)}/>}/>

    <Route path="/admin" element={<Guard roles={['SUPER_ADMIN']}><AdminLayout/></Guard>}>
      <Route index element={<AdminDashboard/>}/>
      <Route path="branches" element={<Branches/>}/>
      <Route path="teachers" element={<Teachers/>}/>
      <Route path="groups" element={<Groups/>}/>
      <Route path="students" element={<Students/>}/>
      <Route path="xp-approval" element={<XPApproval/>}/>
      <Route path="logs" element={<Logs/>}/>
      <Route path="rankings" element={<Rankings/>}/>
      <Route path="chat" element={<Chat/>}/>
    </Route>

    <Route path="/teacher" element={<Guard roles={['TEACHER']}><TeacherLayout/></Guard>}>
      <Route index element={<TDashboard/>}/>
      <Route path="lessons" element={<TLessons/>}/>
      <Route path="quizzes" element={<TQuizzes/>}/>
      <Route path="typing" element={<TTyping/>}/>
      <Route path="bugfix" element={<TBugFix/>}/>
      <Route path="coding" element={<TCoding/>}/>
      <Route path="figma" element={<TFigma/>}/>
      <Route path="library" element={<TLibrary/>}/>
      <Route path="reviews" element={<TReviews/>}/>
      <Route path="chat" element={<Chat/>}/>
    </Route>

    <Route path="/student" element={<Guard roles={['STUDENT']}><StudentLayout/></Guard>}>
      <Route index element={<SDashboard/>}/>
      <Route path="lessons" element={<SLessons/>}/>
      <Route path="typing" element={<STyping/>}/>
      <Route path="bugfix" element={<SBugFix/>}/>
      <Route path="coding" element={<SCoding/>}/>
      <Route path="figma" element={<SFigma/>}/>
      <Route path="progress" element={<SProgress/>}/>
      <Route path="rankings" element={<SRankings/>}/>
      <Route path="chat" element={<Chat/>}/>
    </Route>

    <Route path="*" element={<Navigate to={user?home(user.role):'/login'}/>}/>
  </Routes>;
}
