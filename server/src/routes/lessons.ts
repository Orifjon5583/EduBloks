import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const r = Router();
r.use(authenticate);

r.get('/', async (req: AuthRequest, res) => {
  try {
    const where: any = req.user!.role === 'TEACHER' ? { teacherId: req.user!.id } : req.user!.role === 'STUDENT' ? { isPublished: true } : {};
    const lessons = await prisma.lesson.findMany({ where, include: { topic: { include: { course: true } } }, orderBy: [{ topic: { order: 'asc' } }, { order: 'asc' }] });

    // Progress locking for students - show only accessible lessons
    if (req.user!.role === 'STUDENT') {
      const completions = await prisma.lessonCompletion.findMany({ where: { studentId: req.user!.id }, select: { lessonId: true } });
      const completedIds = new Set(completions.map(c => c.lessonId));

      // Group lessons by topic
      const topicMap = new Map<string, any[]>();
      lessons.forEach(l => {
        if (!topicMap.has(l.topicId)) topicMap.set(l.topicId, []);
        topicMap.get(l.topicId)!.push(l);
      });

      // Find which topics are fully completed
      const accessible: any[] = [];
      let canAccess = true;
      const topics = [...topicMap.entries()].sort((a, b) => (a[1][0]?.topic?.order || 0) - (b[1][0]?.topic?.order || 0));

      for (const [topicId, topicLessons] of topics) {
        if (canAccess) {
          accessible.push(...topicLessons);
          const allCompleted = topicLessons.every(l => completedIds.has(l.id));
          if (!allCompleted) canAccess = false; // lock subsequent topics
        }
      }
      res.json(accessible);
      return;
    }

    res.json(lessons);
  } catch (e: any) { res.status(500).json({ message: e.message }); }
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
