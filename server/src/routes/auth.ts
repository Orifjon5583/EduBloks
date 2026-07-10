import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const r = Router();

r.post('/login', async (req, res) => {
  const { login, password } = req.body;
  const user = await prisma.user.findUnique({ where: { login } });
  if (!user || !user.isActive) { res.status(401).json({ message: 'Login/parol xato' }); return; }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) { res.status(401).json({ message: 'Login/parol xato' }); return; }
  const payload = { id: user.id, role: user.role, login: user.login };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refresh', { expiresIn: '7d' });
  await prisma.systemLog.create({ data: { userId: user.id, action: 'LOGIN', details: `${user.firstName} kirdi` } });
  res.json({ accessToken, refreshToken, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, login: user.login, role: user.role } });
});

r.post('/refresh', (req, res) => {
  try {
    const d = jwt.verify(req.body.refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh') as any;
    const accessToken = jwt.sign({ id: d.id, role: d.role, login: d.login }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.json({ accessToken });
  } catch { res.status(401).json({ message: 'Refresh token yaroqsiz' }); }
});

export default r;
