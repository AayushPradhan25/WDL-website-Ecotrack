import 'dotenv/config';
import { PrismaService } from './src/prisma.service';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaService();
  await prisma.onModuleInit();

  // Use environment variables for passwords or generate secure defaults
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const userPassword = process.env.SEED_USER_PASSWORD || 'user123';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
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
  console.log('Admin user created:', admin.email);

  // Also create a test user
  const userHashedPassword = await bcrypt.hash(userPassword, 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@ecosmart.com' },
    update: {},
    create: {
      email: 'user@ecosmart.com',
      name: 'EcoSmart Citizen',
      password: userHashedPassword,
      role: 'USER',
    },
  });
  console.log('Test user created:', user.email);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
