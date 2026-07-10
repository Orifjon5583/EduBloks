import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const r = Router();
r.use(authenticate);

r.post('/request', authorize('TEACHER'), async (req: AuthRequest, res) => {
  res.status(201).json(await prisma.xPRequest.create({ data: { teacherId: req.user!.id, studentId: req.body.studentId, amount: req.body.amount, reason: req.body.reason } }));
});
r.get('/requests', authorize('SUPER_ADMIN'), async (req, res) => {
  res.json(await prisma.xPRequest.findMany({ where: { status: 'PENDING' }, include: { teacher: { select: { id: true, firstName: true, lastName: true } }, student: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } }));
});
r.put('/requests/:id/approve', authorize('SUPER_ADMIN'), async (req, res) => {
  const rq = await prisma.xPRequest.update({ where: { id: req.params.id }, data: { status: 'APPROVED' } });
  await prisma.xP.create({ data: { studentId: rq.studentId, amount: rq.amount, reason: `Manual: ${rq.reason}` } });
  res.json(rq);
});
r.put('/requests/:id/reject', authorize('SUPER_ADMIN'), async (req, res) => {
  res.json(await prisma.xPRequest.update({ where: { id: req.params.id }, data: { status: 'REJECTED' } }));
});

export default r;
