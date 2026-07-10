import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const pw = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({ where: { login: 'admin' }, update: {}, create: { firstName: 'Super', lastName: 'Admin', login: 'admin', password: pw, role: 'SUPER_ADMIN' } });
  console.log('✅ Super Admin: login=admin, parol=admin123');

  const courses = ['HTML', 'CSS', 'JavaScript'];
  for (let i = 0; i < courses.length; i++) {
    await prisma.course.upsert({ where: { name: courses[i] }, update: {}, create: { name: courses[i], order: i+1 } });
  }
  console.log('✅ Kurslar yaratildi');

  const htmlTopics = ['HTML Asoslari','Teglar','Formalar','Jadvallar','Semantik HTML'];
  const html = await prisma.course.findUnique({ where: { name: 'HTML' } });
  for (let i = 0; i < htmlTopics.length; i++) {
    await prisma.topic.upsert({ where: { id: `html-${i+1}` }, update: {}, create: { id: `html-${i+1}`, name: htmlTopics[i], order: i+1, courseId: html!.id } });
  }
  console.log('✅ Mavzular yaratildi');
  console.log('🎉 Seed tayyor!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
