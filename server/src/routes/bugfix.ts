import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const r = Router();
r.use(authenticate);

r.get('/', async (req: AuthRequest, res) => {
  const where: any = req.user!.role === 'TEACHER' ? { teacherId: req.user!.id } : {};
  res.json(await prisma.bugFixExercise.findMany({ where, include: { topic: { include: { course: true } } }, orderBy: { createdAt: 'desc' } }));
});
r.get('/:id', async (req: AuthRequest, res) => {
  const ex = await prisma.bugFixExercise.findUnique({ where: { id: req.params.id } });
  if (!ex) { res.status(404).json({ message: 'Topilmadi' }); return; }
  if (req.user!.role === 'STUDENT') { const { solution, ...rest } = ex; res.json(rest); return; }
  res.json(ex);
});
r.post('/', authorize('TEACHER'), async (req: AuthRequest, res) => {
  res.status(201).json(await prisma.bugFixExercise.create({ data: { title: req.body.title, description: req.body.description, buggyCode: req.body.buggyCode, solution: req.body.solution, hint: req.body.hint, topicId: req.body.topicId, teacherId: req.user!.id, xpReward: req.body.xpReward || 10 } }));
});
r.delete('/:id', authorize('TEACHER'), async (req, res) => {
  await prisma.bugFixExercise.delete({ where: { id: req.params.id } }); res.json({ message: 'O\'chirildi' });
});
r.post('/:id/submit', authorize('STUDENT'), async (req: AuthRequest, res) => {
  const ex = await prisma.bugFixExercise.findUnique({ where: { id: req.params.id } });
  if (!ex) { res.status(404).json({ message: 'Topilmadi' }); return; }
  const correct = req.body.code.trim() === ex.solution.trim();
  if (correct) await prisma.xP.create({ data: { studentId: req.user!.id, amount: ex.xpReward, reason: `BugFix: ${ex.title}` } });
  res.json({ correct, xp: correct ? ex.xpReward : 0 });
});

export default r;
