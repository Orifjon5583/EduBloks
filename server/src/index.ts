import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import branchRoutes from './routes/branches';
import teacherRoutes from './routes/teachers';
import groupRoutes from './routes/groups';
import studentRoutes from './routes/students';
import lessonRoutes from './routes/lessons';
import quizRoutes from './routes/quizzes';
import typingRoutes from './routes/typing';
import bugfixRoutes from './routes/bugfix';
import codingRoutes from './routes/coding';
import figmaRoutes from './routes/figma';
import libraryRoutes from './routes/library';
import xpRoutes from './routes/xp';
import rankingRoutes from './routes/rankings';
import notificationRoutes from './routes/notifications';
import logRoutes from './routes/logs';
import chatRoutes from './routes/chat';
import dashboardRoutes from './routes/dashboard';
import achievementRoutes from './routes/achievements';
import topicRoutes from './routes/topics';
import { setupSocket } from './socket';

dotenv.config();
const app = express();
const httpServer = createServer(app);
export const prisma = new PrismaClient();
export const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET','POST'] }
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/branches', branchRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/lessons', lessonRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/typing', typingRoutes);
app.use('/api/v1/bugfix', bugfixRoutes);
app.use('/api/v1/coding', codingRoutes);
app.use('/api/v1/figma', figmaRoutes);
app.use('/api/v1/library', libraryRoutes);
app.use('/api/v1/xp', xpRoutes);
app.use('/api/v1/rankings', rankingRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/logs', logRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/achievements', achievementRoutes);
app.use('/api/v1/topics', topicRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message || 'Server xatosi' });
});

setupSocket(io);
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 EduBlocks server: http://localhost:${PORT}`));
