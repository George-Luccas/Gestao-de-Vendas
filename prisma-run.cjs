const { execSync } = require('child_process');
const fs = require('fs');

const envContent = 'DATABASE_URL="postgresql://2152435c24526282fa673ca8ceb0eef1b0fb83bccb47fadaecf901444d009d46:sk_Jmk1lofvpfiUNhxSRsExr@db.prisma.io:5432/postgres?sslmode=require"\n';
fs.writeFileSync('.env', envContent, { encoding: 'utf8' });

try {
  console.log('Running prisma db push...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: Buffer.from(envContent.split('"')[1]).toString() } });
  console.log('Running prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: Buffer.from(envContent.split('"')[1]).toString() } });
  console.log('Success!');
} catch (error) {
  console.error('Failed to run prisma commands:', error.message);
}
