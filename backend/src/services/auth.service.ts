import bcrypt from "bcryptjs";

import {
  prisma,
} from "../config/database.js";

import {
  generateAccessToken,
} from "../utils/jwt.js";


export async function loginUser(
  email: string,
  password: string,
) {
  const user =
    await prisma.user.findUnique({
      where: {
        email:
          email.toLowerCase(),
      },
    });

  if (!user) {
    throw new Error(
      "INVALID_CREDENTIALS",
    );
  }

  if (
    user.status !==
    "ACTIVE"
  ) {
    throw new Error(
      "USER_INACTIVE",
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.passwordHash,
    );

  if (
    !passwordMatches
  ) {
    throw new Error(
      "INVALID_CREDENTIALS",
    );
  }

  const token =
    generateAccessToken({
      userId:
        user.id,

      role:
        user.role,
    });

  return {
    token,

    user: {
      id:
        user.id,

      name:
        user.name,

      email:
        user.email,

      role:
        user.role,

      status:
        user.status,
    },
  };
}


export async function getCurrentUser(
  userId: string,
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

  if (!user) {
    throw new Error(
      "USER_NOT_FOUND",
    );
  }

  return user;
}