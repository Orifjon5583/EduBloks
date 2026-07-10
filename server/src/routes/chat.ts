import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const r = Router();
r.use(authenticate);

r.get('/conversations', async (req: AuthRequest, res) => {
  const uid = req.user!.id;
  const msgs = await prisma.chatMessage.findMany({ where: { OR: [{ senderId: uid }, { receiverId: uid }] }, include: { sender: { select: { id: true, firstName: true, lastName: true, role: true } }, receiver: { select: { id: true, firstName: true, lastName: true, role: true } } }, orderBy: { createdAt: 'desc' } });
  const map = new Map<string, any>();
  msgs.forEach(m => { const pid = m.senderId === uid ? m.receiverId : m.senderId; if (!map.has(pid)) map.set(pid, { partner: m.senderId === uid ? m.receiver : m.sender, lastMessage: m }); });
  res.json(Array.from(map.values()));
});
r.get('/messages/:userId', async (req: AuthRequest, res) => {
  const uid = req.user!.id, pid = req.params.userId;
  res.json(await prisma.chatMessage.findMany({ where: { OR: [{ senderId: uid, receiverId: pid }, { senderId: pid, receiverId: uid }] }, include: { sender: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'asc' } }));
});
r.post('/send', async (req: AuthRequest, res) => {
  res.status(201).json(await prisma.chatMessage.create({ data: { senderId: req.user!.id, receiverId: req.body.receiverId, content: req.body.content }, include: { sender: { select: { id: true, firstName: true, lastName: true } } } }));
});

export default r;
