import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('⏳ Initializing Prisma Client with Native PG Driver Adapter...');
  
  const dbUser = 'ecosmart_db_user';
  const dbPassword = encodeURIComponent('QiQmoLF1dnTeD06Ya3cud1M0szKss8qT'); 
  const dbHost = 'dpg-d8742gf7f7vs73d6n000-a.oregon-postgres.render.com';
  const dbName = 'ecosmart_db';

  const directConnectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}/${dbName}?sslmode=require`;

  const pool = new Pool({ 
    connectionString: directConnectionString,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 15000,
  });
  
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('⏳ Initializing database session workspace authorization...');
    await pool.query('SET search_path TO public;');

    // 1. SEED ADMIN
    const adminEmail = 'aayush.pradhan25@ecosmart.com';
    const adminPassword = 'Aayush@232106';
    console.log(`⏳ Processing Admin profile: ${adminEmail}`);

    const adminHashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { password: adminHashedPassword, role: 'ADMIN' },
      create: { email: adminEmail, password: adminHashedPassword, name: 'System Admin', role: 'ADMIN' },
    });
    console.log(`🎉 SUCCESS! Admin account configured.`);

    // 2. SEED CITIZEN
    const citizenEmail = 'citizen.test@ecosmart.com';
    const citizenPassword = 'CitizenPassword123!';
    console.log(`⏳ Processing Citizen profile: ${citizenEmail}`);

    const citizenHashedPassword = await bcrypt.hash(citizenPassword, 10);

    await prisma.user.upsert({
      where: { email: citizenEmail },
      update: { password: citizenHashedPassword, role: 'CITIZEN' },
      create: { email: citizenEmail, password: citizenHashedPassword, name: 'John Citizen', role: 'CITIZEN' },
    });
    console.log(`🎉 SUCCESS! Citizen account configured.`);

  } catch (error) {
    console.error('❌ Seeding process encountered an error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
