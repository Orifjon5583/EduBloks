import { prisma } from '../index';

export async function updateStreak(studentId: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  let streak = await prisma.streak.findUnique({ where: { userId: studentId } });

  if (!streak) {
    await prisma.streak.create({ data: { userId: studentId, currentDays: 1, longestDays: 1, lastActive: now } });
    return;
  }

  const lastActive = new Date(streak.lastActive);
  const lastDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

  if (lastDay.getTime() === today.getTime()) return; // already counted today

  if (lastDay.getTime() === yesterday.getTime()) {
    // consecutive day
    const newCurrent = streak.currentDays + 1;
    await prisma.streak.update({
      where: { userId: studentId },
      data: { currentDays: newCurrent, longestDays: Math.max(newCurrent, streak.longestDays), lastActive: now }
    });
  } else {
    // streak broken
    await prisma.streak.update({
      where: { userId: studentId },
      data: { currentDays: 1, lastActive: now }
    });
  }
}
