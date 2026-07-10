import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const r = Router();
r.use(authenticate);

r.get('/', async (req: AuthRequest, res) => {
  const where: any = req.user!.role === 'TEACHER' ? { teacherId: req.user!.id } : {};
  res.json(await prisma.figmaChallenge.findMany({ where, include: { topic: { include: { course: true } }, _count: { select: { submissions: true } } }, orderBy: { openTime: 'desc' } }));
});
r.get('/:id', async (req, res) => {
  res.json(await prisma.figmaChallenge.findUnique({ where: { id: req.params.id }, include: { submissions: { include: { student: { select: { id: true, firstName: true, lastName: true } } } } } }));
});
r.post('/', authorize('TEACHER'), async (req: AuthRequest, res) => {
  try {
    const { title, description, figmaLink, score, openTime, deadline, topicId } = req.body;
    // Figma schedule: only Mon/Wed/Fri
    const open = new Date(openTime);
    const day = open.getDay(); // 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
    if (![1, 3, 5].includes(day)) {
      res.status(400).json({ message: 'Figma topshiriqlar faqat Dushanba, Chorshanba, Juma kunlari ochiladi' });
      return;
    }
    res.status(201).json(await prisma.figmaChallenge.create({ data: { title, description, figmaLink, score: score || 100, openTime: open, deadline: new Date(deadline), topicId, teacherId: req.user!.id } }));
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});
r.delete('/:id', authorize('TEACHER'), async (req, res) => {
  await prisma.figmaChallenge.delete({ where: { id: req.params.id } }); res.json({ message: 'O\'chirildi' });
});
r.post('/:id/submit', authorize('STUDENT'), async (req: AuthRequest, res) => {
  const ch = await prisma.figmaChallenge.findUnique({ where: { id: req.params.id } });
  if (!ch) { res.status(404).json({ message: 'Topilmadi' }); return; }
  if (new Date() > ch.deadline) { res.status(400).json({ message: 'Muddat tugagan' }); return; }
  res.status(201).json(await prisma.submission.create({ data: { studentId: req.user!.id, challengeId: ch.id, type: 'FIGMA', githubUrl: req.body.githubUrl, demoUrl: req.body.demoUrl } }));
});
r.post('/submissions/:id/review', authorize('TEACHER'), async (req, res) => {
  const sub = await prisma.submission.update({ where: { id: req.params.id }, data: { score: req.body.score, feedback: req.body.feedback, reviewed: true } });
  if (req.body.score > 0) await prisma.xP.create({ data: { studentId: sub.studentId, amount: req.body.score, reason: 'Figma review' } });
  res.json(sub);
});

export default r;
