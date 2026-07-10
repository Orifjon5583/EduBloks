import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getOnlineCount } from '../socket';

const r = Router();
r.use(authenticate);

r.get('/admin', async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'SUPER_ADMIN') { res.status(403).json({ message: 'Ruxsat yoq' }); return; }
    const [branches, teachers, groups, students, quizzes, xpReqs] = await Promise.all([
      prisma.branch.count(), prisma.user.count({ where: { role: 'TEACHER' } }), prisma.group.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }), prisma.quiz.count({ where: { isActive: true } }),
      prisma.xPRequest.count({ where: { status: 'PENDING' } })
    ]);
    const figma = await prisma.figmaChallenge.count({ where: { deadline: { gte: new Date() } } });
    const totalXP = await prisma.xP.aggregate({ _sum: { amount: true } });
    res.json({ totalBranches: branches, totalTeachers: teachers, totalGroups: groups, totalStudents: students, activeUsers: getOnlineCount(), totalXP: totalXP._sum.amount || 0, totalQuizzes: quizzes, activeFigmaTasks: figma, pendingXPRequests: xpReqs });
  } catch(e: any) { res.status(500).json({ message: e.message }); }
});

r.get('/teacher', async (req: AuthRequest, res) => {
  if (req.user!.role !== 'TEACHER') { res.status(403).json({ message: 'Ruxsat yoq' }); return; }
  const groups = await prisma.group.findMany({ where: { teacherId: req.user!.id }, include: { _count: { select: { students: true } } } });
  const pendingReviews = await prisma.submission.count({ where: { reviewed: false, figmaChallenge: { teacherId: req.user!.id } } });
  const activeQuizzes = await prisma.quiz.count({ where: { teacherId: req.user!.id, isActive: true } });
  const activeFigma = await prisma.figmaChallenge.count({ where: { teacherId: req.user!.id, deadline: { gte: new Date() } } });
  res.json({ groups, pendingReviews, activeQuizzes, activeFigmaChallenges: activeFigma });
});

r.get('/student', async (req: AuthRequest, res) => {
  if (req.user!.role !== 'STUDENT') { res.status(403).json({ message: 'Ruxsat yoq' }); return; }
  const xp = await prisma.xP.aggregate({ where: { studentId: req.user!.id }, _sum: { amount: true } });
  const total = xp._sum.amount || 0;
  const streak = await prisma.streak.findUnique({ where: { userId: req.user!.id } });
  const deadlines = await prisma.figmaChallenge.findMany({ where: { deadline: { gte: new Date() } }, orderBy: { deadline: 'asc' }, take: 5, select: { id: true, title: true, deadline: true } });
  const RANKS = [{r:'Beginner',m:0},{r:'Student',m:100},{r:'Junior',m:500},{r:'Middle',m:1500},{r:'Senior',m:3500},{r:'Master',m:7000},{r:'Legend',m:15000}];
  let rank = 'Beginner'; for (const t of RANKS) if (total >= t.m) rank = t.r;
  res.json({ xp: total, rank, level: Math.floor(total/100)+1, streak: streak?.currentDays || 0, deadlines });
});

export default r;
