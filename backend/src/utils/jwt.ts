import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

import type {
  UserRole,
} from "../generated/prisma/client";

import type {
  SignOptions,
} from "jsonwebtoken";


export interface AuthTokenPayload {
  userId: string;
  role: UserRole;
}


/*
|--------------------------------------------------------------------------
| Generate JWT
|--------------------------------------------------------------------------
*/

export function generateAccessToken(
  payload: AuthTokenPayload,
): string {
  const options: SignOptions = {
    expiresIn:
      env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      userId:
        payload.userId,

      role:
        payload.role,
    },

    env.JWT_SECRET,

    options,
  );
}


/*
|--------------------------------------------------------------------------
| Verify JWT
|--------------------------------------------------------------------------
*/

export function verifyAccessToken(
  token: string,
): AuthTokenPayload {
  return jwt.verify(
    token,
    env.JWT_SECRET,
  ) as AuthTokenPayload;
}