import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

config({
  path: '.env.local',
});

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  // Skip migrations for dummy/placeholder database URLs
  if (process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('user:password')) {
    console.log('⚠️  Skipping migrations (dummy DATABASE_URL detected)');
    console.log('💡 Set a real DATABASE_URL to run migrations');
    process.exit(0);
  }

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  console.log('⏳ Running migrations...');

  const start = Date.now();
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  const end = Date.now();

  console.log('✅ Migrations completed in', end - start, 'ms');

  await client.end();
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
