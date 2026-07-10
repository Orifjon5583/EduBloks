import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const r = Router();
r.use(authenticate); r.use(authorize('SUPER_ADMIN'));

r.get('/', async (req, res) => {
  try { res.json(await prisma.branch.findMany({ include: { _count: { select: { users: true, groups: true } } }, orderBy: { createdAt: 'desc' } })); }
  catch(e: any) { res.status(500).json({ message: e.message }); }
});
r.post('/', async (req: AuthRequest, res) => {
  try { const b = await prisma.branch.create({ data: { name: req.body.name, address: req.body.address } }); res.status(201).json(b); }
  catch(e: any) { res.status(500).json({ message: e.message }); }
});
r.put('/:id', async (req, res) => {
  try { res.json(await prisma.branch.update({ where: { id: req.params.id }, data: { name: req.body.name, address: req.body.address } })); }
  catch(e: any) { res.status(500).json({ message: e.message }); }
});
r.delete('/:id', async (req, res) => {
  try { await prisma.branch.delete({ where: { id: req.params.id } }); res.json({ message: 'O\'chirildi' }); }
  catch(e: any) { res.status(500).json({ message: e.message }); }
});

export default r;
