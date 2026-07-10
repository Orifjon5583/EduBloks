import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';
import { authenticate, authorize } from '../middleware/auth';

const r = Router();
r.use(authenticate); r.use(authorize('SUPER_ADMIN'));

r.get('/', async (req, res) => {
  try { res.json(await prisma.user.findMany({ where: { role: 'TEACHER' }, select: { id: true, firstName: true, lastName: true, login: true, isActive: true, branchId: true, branch: { select: { name: true } }, teacherGroups: { select: { id: true, name: true } }, createdAt: true }, orderBy: { createdAt: 'desc' } })); }
  catch(e: any) { res.status(500).json({ message: e.message }); }
});
r.post('/', async (req, res) => {
  try { const { firstName, lastName, login, password, branchId } = req.body;
    const t = await prisma.user.create({ data: { firstName, lastName, login, password: await bcrypt.hash(password, 10), role: 'TEACHER', branchId: branchId || null } });
    res.status(201).json(t); }
  catch(e: any) { res.status(500).json({ message: e.message }); }
});
r.put('/:id', async (req, res) => {
  try { const { firstName, lastName, login, branchId, isActive } = req.body;
    res.json(await prisma.user.update({ where: { id: req.params.id }, data: { firstName, lastName, login, branchId, isActive } })); }
  catch(e: any) { res.status(500).json({ message: e.message }); }
});
r.delete('/:id', async (req, res) => {
  try { await prisma.user.delete({ where: { id: req.params.id } }); res.json({ message: 'O\'chirildi' }); }
  catch(e: any) { res.status(500).json({ message: e.message }); }
});
r.patch('/:id/disable', async (req, res) => {
  try { res.json(await prisma.user.update({ where: { id: req.params.id }, data: { isActive: false } })); }
  catch(e: any) { res.status(500).json({ message: e.message }); }
});

export default r;
