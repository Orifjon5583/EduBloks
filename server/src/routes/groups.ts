import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, authorize } from '../middleware/auth';

const r = Router();
r.use(authenticate); r.use(authorize('SUPER_ADMIN'));

r.get('/', async (req, res) => {
  try {
    res.json(await prisma.group.findMany({
      include: { teacher: { select: { id: true, firstName: true, lastName: true } }, branch: { select: { id: true, name: true } }, _count: { select: { students: true } } },
      orderBy: { createdAt: 'desc' }
    }));
  } catch(e: any) { res.status(500).json({ message: e.message }); }
});
r.post('/', async (req, res) => {
  try {
    const data: any = { name: req.body.name };
    if (req.body.teacherId) data.teacherId = req.body.teacherId;
    if (req.body.branchId) data.branchId = req.body.branchId;
    res.status(201).json(await prisma.group.create({ data }));
  } catch(e: any) { res.status(500).json({ message: e.message }); }
});
r.put('/:id', async (req, res) => {
  try {
    res.json(await prisma.group.update({ where: { id: req.params.id }, data: { name: req.body.name, teacherId: req.body.teacherId || null, branchId: req.body.branchId || null } }));
  } catch(e: any) { res.status(500).json({ message: e.message }); }
});
r.delete('/:id', async (req, res) => {
  try {
    await prisma.group.delete({ where: { id: req.params.id } }); res.json({ message: 'O\'chirildi' });
  } catch(e: any) { res.status(500).json({ message: e.message }); }
});

export default r;
