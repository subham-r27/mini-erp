import { prisma } from "../config/database.js";

import type {
  UserRole,
  UserStatus,
} from "../generated/prisma/client";

export async function listUsers(options: {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}) {
  const {
    page,
    limit,
    search,
    role,
    status,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    ...(role ? { role } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
