import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const r = Router();
r.use(authenticate);

r.get('/', async (req, res) => {
  try {
    const all = await prisma.achievement.findMany({ orderBy: { xpThreshold: 'asc' } });
    res.json(all);
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

r.get('/my', async (req: AuthRequest, res) => {
  try {
    const earned = await prisma.userAchievement.findMany({
      where: { userId: req.user!.id },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' }
    });
    res.json(earned);
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

export default r;
