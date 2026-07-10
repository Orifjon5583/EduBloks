import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from './index';

const online = new Map<string, string>();

export function setupSocket(io: Server) {
  io.use((socket, next) => {
    try {
      const t = socket.handshake.auth.token;
      const u = jwt.verify(t, process.env.JWT_SECRET || 'secret') as any;
      (socket as any).userId = u.id;
      next();
    } catch { next(new Error('Auth failed')); }
  });

  io.on('connection', (socket) => {
    const uid = (socket as any).userId;
    online.set(uid, socket.id);
    socket.on('message:send', async (data: any) => {
      const msg = await prisma.chatMessage.create({
        data: { senderId: uid, receiverId: data.receiverId, content: data.content },
        include: { sender: { select: { id: true, firstName: true, lastName: true } } }
      });
      const rid = online.get(data.receiverId);
      if (rid) io.to(rid).emit('message:receive', msg);
      socket.emit('message:sent', msg);
    });
    socket.on('disconnect', () => online.delete(uid));
  });
}

export const getOnlineCount = () => online.size;
