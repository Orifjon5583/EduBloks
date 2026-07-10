import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const r = Router();
r.use(authenticate);

r.get('/', async (req: AuthRequest, res) => {
  res.json(await prisma.notification.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' }, take: 50 }));
});
r.get('/unread-count', async (req: AuthRequest, res) => {
  res.json({ count: await prisma.notification.count({ where: { userId: req.user!.id, read: false } }) });
});
r.put('/read-all', async (req: AuthRequest, res) => {
  await prisma.notification.updateMany({ where: { userId: req.user!.id, read: false }, data: { read: true } });
  res.json({ message: 'Barchasi o\'qildi' });
});

export default r;
