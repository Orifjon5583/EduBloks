import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const r = Router();
r.use(authenticate);

const RANKS = [{r:'Beginner',m:0},{r:'Student',m:100},{r:'Junior',m:500},{r:'Middle',m:1500},{r:'Senior',m:3500},{r:'Master',m:7000},{r:'Legend',m:15000}];
function getRank(xp: number) { let rank = 'Beginner'; for (const t of RANKS) if (xp >= t.m) rank = t.r; return rank; }

r.get('/', async (req, res) => {
  const students = await prisma.user.findMany({ where: { role: 'STUDENT' }, select: { id: true, firstName: true, lastName: true, studentGroups: { include: { group: { select: { id: true, name: true } } } }, xpRecords: { select: { amount: true } } } });
  const ranked = students.map(s => {
    const totalXP = s.xpRecords.reduce((sum, x) => sum + x.amount, 0);
    return { id: s.id, firstName: s.firstName, lastName: s.lastName, groups: s.studentGroups.map(sg => sg.group), totalXP, rank: getRank(totalXP), level: Math.floor(totalXP/100)+1 };
  }).sort((a,b) => b.totalXP - a.totalXP);
  res.json(ranked);
});

r.get('/me', async (req: AuthRequest, res) => {
  const xp = await prisma.xP.aggregate({ where: { studentId: req.user!.id }, _sum: { amount: true } });
  const total = xp._sum.amount || 0;
  const streak = await prisma.streak.findUnique({ where: { userId: req.user!.id } });
  res.json({ totalXP: total, rank: getRank(total), level: Math.floor(total/100)+1, streak: streak?.currentDays || 0 });
});

export default r;
