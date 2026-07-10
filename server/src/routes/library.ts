import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const r = Router();
r.use(authenticate); r.use(authorize('TEACHER', 'SUPER_ADMIN'));

r.get('/', async (req, res) => {
  res.json(await prisma.libraryItem.findMany({ include: { author: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } }));
});
r.post('/', async (req: AuthRequest, res) => {
  res.status(201).json(await prisma.libraryItem.create({ data: { type: req.body.type, title: req.body.title, content: req.body.content, authorId: req.user!.id } }));
});
r.post('/:id/copy', async (req: AuthRequest, res) => {
  const orig = await prisma.libraryItem.findUnique({ where: { id: req.params.id } });
  if (!orig) { res.status(404).json({ message: 'Topilmadi' }); return; }
  res.status(201).json(await prisma.libraryItem.create({ data: { type: orig.type, title: `${orig.title} (Nusxa)`, content: orig.content, authorId: req.user!.id } }));
});
r.delete('/:id', async (req: AuthRequest, res) => {
  await prisma.libraryItem.delete({ where: { id: req.params.id } }); res.json({ message: 'O\'chirildi' });
});

export default r;
