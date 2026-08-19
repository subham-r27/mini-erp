import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  UserRole,
  UserStatus,
} from "../generated/prisma/client";

import { listUsers } from "../services/user.service.js";

function parsePositiveInt(
  value: unknown,
  fallback: number,
): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = parsePositiveInt(req.query.page, 1);

    const limit = Math.min(
      parsePositiveInt(req.query.limit, 20),
      100,
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : undefined;

    const role =
      typeof req.query.role === "string" &&
      (Object.values(UserRole) as string[]).includes(
        req.query.role,
      )
        ? (req.query.role as UserRole)
        : undefined;

    const status =
      typeof req.query.status === "string" &&
      (Object.values(UserStatus) as string[]).includes(
        req.query.status,
      )
        ? (req.query.status as UserStatus)
        : undefined;

    const result = await listUsers({
      page,
      limit,
      search,
      role,
      status,
    });

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}
