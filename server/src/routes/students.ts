import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';
import { authenticate, authorize } from '../middleware/auth';

const r = Router();
r.use(authenticate); r.use(authorize('SUPER_ADMIN'));

async function genCreds(firstName: string) {
  const base = firstName.toLowerCase().replace(/[^a-z]/g, '');
  let n = 123, login = `${base}${n}`;
  while (await prisma.user.findUnique({ where: { login } })) { n++; login = `${base}${n}`; }
  return { login, password: login };
}

r.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const search = (req.query.search as string) || '';
  const where: any = { role: 'STUDENT' };
  if (search) where.OR = [{ firstName: { contains: search, mode: 'insensitive' } }, { lastName: { contains: search, mode: 'insensitive' } }, { login: { contains: search, mode: 'insensitive' } }];
  const [students, total] = await Promise.all([
    prisma.user.findMany({ where, select: { id: true, firstName: true, lastName: true, login: true, isActive: true, createdAt: true, studentGroups: { include: { group: { select: { id: true, name: true } } } } }, skip: (page-1)*20, take: 20, orderBy: { createdAt: 'desc' } }),
    prisma.user.count({ where })
  ]);
  res.json({ students, total, page, totalPages: Math.ceil(total/20) });
});

r.post('/', async (req, res) => {
  const { firstName, lastName, groupId } = req.body;
  const { login, password } = await genCreds(firstName);
  const s = await prisma.user.create({ data: { firstName, lastName, login, password: await bcrypt.hash(password, 10), role: 'STUDENT' } });
  if (groupId) await prisma.studentGroup.create({ data: { studentId: s.id, groupId } });
  res.status(201).json({ ...s, generatedLogin: login, generatedPassword: password });
});

r.delete('/:id', async (req, res) => {
  await prisma.studentGroup.deleteMany({ where: { studentId: req.params.id } });
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: 'O\'chirildi' });
});

r.post('/:id/reset-credentials', async (req, res) => {
  const u = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!u) { res.status(404).json({ message: 'Topilmadi' }); return; }
  const { login, password } = await genCreds(u.firstName);
  await prisma.user.update({ where: { id: req.params.id }, data: { login, password: await bcrypt.hash(password, 10) } });
  res.json({ login, password });
});

r.post('/:id/assign-group', async (req, res) => {
  await prisma.studentGroup.create({ data: { studentId: req.params.id, groupId: req.body.groupId } });
  res.json({ message: 'Biriktirildi' });
});

r.post('/:id/move-group', async (req, res) => {
  await prisma.studentGroup.deleteMany({ where: { studentId: req.params.id, groupId: req.body.fromGroupId } });
  await prisma.studentGroup.create({ data: { studentId: req.params.id, groupId: req.body.toGroupId } });
  res.json({ message: 'Ko\'chirildi' });
});

export default r;
