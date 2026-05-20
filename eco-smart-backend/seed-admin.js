const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecosmart.com' },
    update: {},
    create: {
      email: 'admin@ecosmart.com',
      name: 'EcoSmart Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email, '/ admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
