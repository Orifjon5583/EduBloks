import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const r = Router();
r.use(authenticate);

r.get('/', async (req: AuthRequest, res) => {
  const where: any = req.user!.role === 'TEACHER' ? { teacherId: req.user!.id } : {};
  res.json(await prisma.codingChallenge.findMany({ where, include: { topic: { include: { course: true } } }, orderBy: { createdAt: 'desc' } }));
});
r.get('/:id', async (req, res) => {
  res.json(await prisma.codingChallenge.findUnique({ where: { id: req.params.id } }));
});
r.post('/', authorize('TEACHER'), async (req: AuthRequest, res) => {
  res.status(201).json(await prisma.codingChallenge.create({ data: { title: req.body.title, description: req.body.description, starterCode: req.body.starterCode, testCases: req.body.testCases, topicId: req.body.topicId, teacherId: req.user!.id, xpReward: req.body.xpReward || 20 } }));
});
r.delete('/:id', authorize('TEACHER'), async (req, res) => {
  await prisma.codingChallenge.delete({ where: { id: req.params.id } }); res.json({ message: 'O\'chirildi' });
});
r.post('/:id/submit', authorize('STUDENT'), async (req: AuthRequest, res) => {
  const ch = await prisma.codingChallenge.findUnique({ where: { id: req.params.id } });
  if (!ch) { res.status(404).json({ message: 'Topilmadi' }); return; }
  await prisma.submission.create({ data: { studentId: req.user!.id, type: 'CODING', fileUrl: req.body.code } });
  await prisma.xP.create({ data: { studentId: req.user!.id, amount: ch.xpReward, reason: `Coding: ${ch.title}` } });
  res.json({ message: 'Topshirildi', xp: ch.xpReward });
});

export default r;
