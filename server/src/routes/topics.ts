import { Router } from 'express';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth';

const r = Router();
r.use(authenticate);

r.get('/', async (req, res) => {
  try {
    const topics = await prisma.topic.findMany({
      include: { course: { select: { id: true, name: true } } },
      orderBy: [{ course: { order: 'asc' } }, { order: 'asc' }]
    });
    res.json(topics);
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

export default r;
