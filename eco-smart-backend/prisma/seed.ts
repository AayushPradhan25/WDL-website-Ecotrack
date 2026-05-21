import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load environment variables explicitly for backup fallback variables
dotenv.config();

async function main() {
  console.log('⏳ Initializing Prisma Client with Native PG Driver Adapter...');
  
  // ⚡️ Target Configuration (Uses your exact working database connection properties)
  const dbUser = 'ecosmart_db_user';
  const dbPassword = encodeURIComponent('QiQmoLF1dnTeD06Ya3cud1M0szKss8qT'); // Verified password with Capital 'T'
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

    // ==========================================
    // 1. SEED MASTER ADMINISTRATIVE ACCOUNT
    // ==========================================
    const adminEmail = 'aayush.pradhan25@ecosmart.com';
    const adminPassword = 'Aayush@232106';
    console.log(`⏳ Processing Admin profile execution: ${adminEmail}`);

    const adminHashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: adminHashedPassword,
        role: 'ADMIN',
      },
      create: {
        email: adminEmail,
        password: adminHashedPassword,
        name: 'System Admin',
        role: 'ADMIN',
      },
    });
    console.log('🎉 SUCCESS! Admin account configured.');

    // ==========================================
    // 2. SEED DEFAULT CITIZEN ACCOUNT
    // ==========================================
    const citizenEmail = 'citizen.test@ecosmart.com';
    const citizenPassword = 'CitizenPassword123!';
    console.log(`⏳ Processing Citizen profile execution: ${citizenEmail}`);

    const citizenHashedPassword = await bcrypt.hash(citizenPassword, 10);

    const citizen = await prisma.user.upsert({
      where: { email: citizenEmail },
      update: {
        password: citizenHashedPassword,
        role: 'CITIZEN', // Matches your backend app's expected uppercase role check
      },
      create: {
        email: citizenEmail,
        password: citizenHashedPassword,
        name: 'John Citizen',
        role: 'CITIZEN',
      },
    });
    console.log('🎉 SUCCESS! Citizen account configured.');
    
    console.log('\n=========================================================');
    console.log('🚀 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`👉 ADMIN LOGIN:   ${admin.email} / ${adminPassword}`);
    console.log(`👉 CITIZEN LOGIN: ${citizen.email} / ${citizenPassword}`);
    console.log('=========================================================\n');

  } catch (error) {
    console.error('❌ Seeding process encountered an operational error:', error);
    process.exit(1);
  } finally {
    // Gracefully shut down active application thread pools
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load environment variables explicitly for admin fields
dotenv.config();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'aayush.pradhan25@ecosmart.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Aayush@232106';

  console.log('⏳ Initializing Prisma Client with Native PG Driver Adapter...');
  
  // ⚡️ FIXED PASSWORD WITH CAPITAL 'T'
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
    connectionTimeoutMillis: 15000, // Extends timeout windows for distant Render servers
  });
  
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('⏳ Initializing database session workspace authorization...');
    await pool.query('SET search_path TO public;');

    console.log(`⏳ Checking database for admin user: ${adminEmail}`);

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        email: adminEmail,
        password: hashedPassword,
        name: 'System Admin',
        role: 'ADMIN',
      },
    });

    console.log(`\n🎉 SUCCESS! Admin account is configured. Email: ${admin.email}\n`);
  } catch (error) {
    console.error('❌ Seeding process encountered an error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
