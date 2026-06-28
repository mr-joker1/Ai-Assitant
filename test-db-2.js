const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  
  const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL
  });

  try {
    console.log("Connecting and running query...");
    const users = await prisma.user.findMany({ take: 1 });
    console.log("Success! Users found:", users);
  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
