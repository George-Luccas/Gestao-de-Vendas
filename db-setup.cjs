const pg = require('pg');
const pool = new pg.Pool({
  connectionString: "postgresql://2152435c24526282fa673ca8ceb0eef1b0fb83bccb47fadaecf901444d009d46:sk_Jmk1lofvpfiUNhxSRsExr@db.prisma.io:5432/postgres?sslmode=require",
});

async function setup() {
  try {
    console.log('Creating tables...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        "salespersonId" INTEGER,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "Sale" (
        id TEXT PRIMARY KEY,
        "clientName" TEXT NOT NULL,
        value DOUBLE PRECISION NOT NULL,
        stage TEXT NOT NULL,
        "salespersonId" INTEGER NOT NULL,
        description TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "ownerId" TEXT NOT NULL REFERENCES "User"(id)
      );
    `);
    console.log('Tables created successfully!');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    await pool.end();
  }
}

setup();
