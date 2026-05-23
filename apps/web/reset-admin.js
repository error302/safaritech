const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('password123', 10);
  let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@safaritech.com',
        passwordHash: hash,
        role: 'ADMIN'
      }
    });
    console.log('Created admin: admin@safaritech.com / password123');
  } else {
    await prisma.user.update({
      where: { id: admin.id },
      data: { passwordHash: hash }
    });
    console.log(`Updated admin: ${admin.email} / password123`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
