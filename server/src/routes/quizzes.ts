import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { updateStreak } from './streak';

const r = Router();
r.use(authenticate);

r.get('/', async (req: AuthRequest, res) => {
  const where: any = req.user!.role === 'TEACHER' ? { teacherId: req.user!.id } : {};
  res.json(await prisma.quiz.findMany({ where, include: { topic: { include: { course: true } }, _count: { select: { questions: true, attempts: true } } }, orderBy: { createdAt: 'desc' } }));
});
r.get('/:id', async (req, res) => {
  res.json(await prisma.quiz.findUnique({ where: { id: req.params.id }, include: { questions: { orderBy: { order: 'asc' } }, topic: true } }));
});
r.post('/', authorize('TEACHER'), async (req: AuthRequest, res) => {
  const { title, topicId, openTime, closeTime, questions } = req.body;
  const q = await prisma.quiz.create({ data: { title, topicId, teacherId: req.user!.id, openTime: openTime ? new Date(openTime) : null, closeTime: closeTime ? new Date(closeTime) : null, questions: { create: (questions || []).map((x: any, i: number) => ({ question: x.question, options: x.options, correctAnswer: x.correctAnswer, order: i })) } }, include: { questions: true } });
  res.status(201).json(q);
});
r.delete('/:id', authorize('TEACHER'), async (req, res) => {
  await prisma.quiz.delete({ where: { id: req.params.id } }); res.json({ message: 'O\'chirildi' });
});
r.post('/:id/attempt', authorize('STUDENT'), async (req: AuthRequest, res) => {
  const quiz = await prisma.quiz.findUnique({ where: { id: req.params.id }, include: { questions: { orderBy: { order: 'asc' } } } });
  if (!quiz) { res.status(404).json({ message: 'Topilmadi' }); return; }
  let score = 0;
  quiz.questions.forEach((q, i) => { if (req.body.answers[i] === q.correctAnswer) score++; });
  const attempt = await prisma.quizAttempt.create({ data: { studentId: req.user!.id, quizId: quiz.id, score, totalQuestions: quiz.questions.length, answers: req.body.answers } });
  const xp = Math.round((score / quiz.questions.length) * 20);
  if (xp > 0) await prisma.xP.create({ data: { studentId: req.user!.id, amount: xp, reason: `Quiz: ${quiz.title}` } });
  await updateStreak(req.user!.id);
  res.json({ attempt, score, total: quiz.questions.length, xp });
});

export default r;
