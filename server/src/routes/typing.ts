import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const r = Router();
r.use(authenticate);

r.get('/', async (req: AuthRequest, res) => {
  const where: any = req.user!.role === 'TEACHER' ? { teacherId: req.user!.id } : {};
  res.json(await prisma.typingWordList.findMany({ where, include: { topic: { include: { course: true } } }, orderBy: { createdAt: 'desc' } }));
});
r.post('/', authorize('TEACHER'), async (req: AuthRequest, res) => {
  res.status(201).json(await prisma.typingWordList.create({ data: { topicId: req.body.topicId, teacherId: req.user!.id, words: req.body.words } }));
});
r.delete('/:id', authorize('TEACHER'), async (req, res) => {
  await prisma.typingWordList.delete({ where: { id: req.params.id } }); res.json({ message: 'O\'chirildi' });
});
r.post('/result', authorize('STUDENT'), async (req: AuthRequest, res) => {
  const result = await prisma.typingResult.create({ data: { studentId: req.user!.id, wpm: req.body.wpm, accuracy: req.body.accuracy, mode: req.body.mode, duration: req.body.duration } });
  const xp = Math.min(Math.round(req.body.wpm / 5), 15);
  if (xp > 0) await prisma.xP.create({ data: { studentId: req.user!.id, amount: xp, reason: `Typing: ${req.body.wpm} WPM` } });
  res.json(result);
});
r.get('/results', authorize('STUDENT'), async (req: AuthRequest, res) => {
  res.json(await prisma.typingResult.findMany({ where: { studentId: req.user!.id }, orderBy: { createdAt: 'desc' }, take: 50 }));
});

export default r;
