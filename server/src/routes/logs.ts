import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, authorize } from '../middleware/auth';

const r = Router();
r.use(authenticate); r.use(authorize('SUPER_ADMIN'));

r.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const [logs, total] = await Promise.all([
    prisma.systemLog.findMany({ include: { user: { select: { id: true, firstName: true, lastName: true, role: true } } }, orderBy: { createdAt: 'desc' }, skip: (page-1)*50, take: 50 }),
    prisma.systemLog.count()
  ]);
  res.json({ logs, total, page, totalPages: Math.ceil(total/50) });
});

export default r;
