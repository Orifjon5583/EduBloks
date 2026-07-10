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

  const htmlTopics = [
    'Web-dasturlash nima? VS Code va Brauzer bilan tanishuv',
    'HTML Strukturasi: Sarlavhalar (h1-h6) va Paragraflar',
    'Ro\'yxatlar (ul, ol) va Rasmlar (img) bilan ishlash',
    'Linklar (a) va Navigatsiya (Menyu) yaratish',
    'HTML Semantik Teglar (Header, Nav, Main, Footer)',
    'HTML Formlar: Inputlar, Tugmalar va Tanlovlar'
  ];
  const cssTopics = [
    'CSS asoslari: Selektorlar, ranglar, shrift va Google Fonts',
    'CSS: Box Model, margin, padding, border',
    'CSS Flexbox Zamonaviy layout usuli',
    'CSS Grid: 2D tarmoqli layoutlar bilan ishlash',
    'CSS: Position va Responsive dizayn, media queries'
  ];
  const jsTopics = [
    'JavaScript asoslari: O\'zgaruvchilar va Ma\'lumot turlari',
    'Operatorlar va Shart operatorlari (if/else)',
    'Sikllar: for, while, do-while',
    'Funksiyalar va Arrow functions',
    'Massivlar va Massiv metodlari',
    'Obyektlar va DOM bilan ishlash',
    'Hodisalar (Events) va Event Listeners',
    'Asinxron JavaScript: Callbacks, Promises, Async/Await'
  ];

  const html = await prisma.course.findUnique({ where: { name: 'HTML' } });
  const css = await prisma.course.findUnique({ where: { name: 'CSS' } });
  const js = await prisma.course.findUnique({ where: { name: 'JavaScript' } });

  // Delete old topics and recreate
  await prisma.topic.deleteMany({});

  for (let i = 0; i < htmlTopics.length; i++) {
    await prisma.topic.create({ data: { id: `html-${i+1}`, name: htmlTopics[i], order: i+1, courseId: html!.id } });
  }
  for (let i = 0; i < cssTopics.length; i++) {
    await prisma.topic.create({ data: { id: `css-${i+1}`, name: cssTopics[i], order: i+1, courseId: css!.id } });
  }
  for (let i = 0; i < jsTopics.length; i++) {
    await prisma.topic.create({ data: { id: `js-${i+1}`, name: jsTopics[i], order: i+1, courseId: js!.id } });
  }
  console.log('✅ Mavzular yaratildi (HTML + CSS + JS)');
  console.log('🎉 Seed tayyor!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
