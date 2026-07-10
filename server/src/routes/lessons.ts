import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const r = Router();
r.use(authenticate);

r.get('/', async (req: AuthRequest, res) => {
  const where: any = req.user!.role === 'TEACHER' ? { teacherId: req.user!.id } : req.user!.role === 'STUDENT' ? { isPublished: true } : {};
  res.json(await prisma.lesson.findMany({ where, include: { topic: { include: { course: true } } }, orderBy: { order: 'asc' } }));
});
r.get('/:id', async (req, res) => {
  res.json(await prisma.lesson.findUnique({ where: { id: req.params.id }, include: { topic: { include: { course: true } } } }));
});
r.post('/', authorize('TEACHER'), async (req: AuthRequest, res) => {
  res.status(201).json(await prisma.lesson.create({ data: { title: req.body.title, content: req.body.content, topicId: req.body.topicId, teacherId: req.user!.id, isPublished: true, order: req.body.order || 0 } }));
});
r.put('/:id', authorize('TEACHER'), async (req, res) => {
  res.json(await prisma.lesson.update({ where: { id: req.params.id }, data: { title: req.body.title, content: req.body.content } }));
});
r.delete('/:id', authorize('TEACHER'), async (req, res) => {
  await prisma.lesson.delete({ where: { id: req.params.id } }); res.json({ message: 'O\'chirildi' });
});
r.post('/:id/complete', authorize('STUDENT'), async (req: AuthRequest, res) => {
  await prisma.lessonCompletion.upsert({ where: { studentId_lessonId: { studentId: req.user!.id, lessonId: req.params.id } }, create: { studentId: req.user!.id, lessonId: req.params.id }, update: {} });
  res.json({ message: 'Yakunlandi' });
});

export default r;
