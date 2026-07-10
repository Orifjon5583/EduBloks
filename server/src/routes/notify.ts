import { prisma } from '../index';

export async function sendNotification(userId: string, message: string, type: string) {
  await prisma.notification.create({ data: { userId, message, type } });
}
