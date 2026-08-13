import "dotenv/config";

import bcrypt from "bcryptjs";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  UserRole,
  UserStatus,
} from "../../src/generated/prisma/client";

import { env } from "../../src/config/env.js";


/*
|--------------------------------------------------------------------------
| Prisma Client
|--------------------------------------------------------------------------
*/

const adapter = new PrismaPg({
  connectionString:
    env.DATABASE_URL,
});

const prisma =
  new PrismaClient({
    adapter,
  });


/*
|--------------------------------------------------------------------------
| Seed Users
|--------------------------------------------------------------------------
*/

const users = [
  {
    name: "System Administrator",
    email: "admin@minierp.local",
    password: "Admin@123",
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
  },

  {
    name: "Sales User",
    email: "sales@minierp.local",
    password: "Sales@123",
    role: UserRole.SALES,
    status: UserStatus.ACTIVE,
  },

  {
    name: "Warehouse User",
    email: "warehouse@minierp.local",
    password: "Warehouse@123",
    role: UserRole.WAREHOUSE,
    status: UserStatus.ACTIVE,
  },

  {
    name: "Accounts User",
    email: "accounts@minierp.local",
    password: "Accounts@123",
    role: UserRole.ACCOUNTS,
    status: UserStatus.ACTIVE,
  },
];


/*
|--------------------------------------------------------------------------
| Seed Function
|--------------------------------------------------------------------------
*/

async function main() {
  console.log(
    "🌱 Starting database seed...",
  );

  for (const user of users) {
    const passwordHash =
      await bcrypt.hash(
        user.password,
        12,
      );

    const createdUser =
      await prisma.user.upsert({
        where: {
          email: user.email,
        },

        update: {
          name: user.name,
          passwordHash,
          role: user.role,
          status: user.status,
        },

        create: {
          name: user.name,
          email: user.email,
          passwordHash,
          role: user.role,
          status: user.status,
        },
      });

    console.log(
      `✅ ${createdUser.role} → ${createdUser.email}`,
    );
  }

  console.log(
    "\n🎉 Database seed completed successfully.",
  );
}


/*
|--------------------------------------------------------------------------
| Execute
|--------------------------------------------------------------------------
*/

main()
  .catch((error) => {
    console.error(
      "❌ Database seed failed:",
      error,
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });