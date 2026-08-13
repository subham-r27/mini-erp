import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import {
    verifyAccessToken,
  } from "../utils/jwt.js";
  
  import type {
    UserRole,
  } from "../generated/prisma/client";
  
  
  export interface AuthenticatedRequest
    extends Request {
    user?: {
      id: string;
      role: UserRole;
    };
  }
  
  
  export function requireAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    const authorization =
      req.headers.authorization;
  
    if (
      !authorization ||
      !authorization.startsWith(
        "Bearer ",
      )
    ) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required",
        error: {
          code:
            "AUTHENTICATION_REQUIRED",
        },
      });
  
      return;
    }
  
    const token =
      authorization.substring(
        7,
      );
  
    try {
      const payload =
        verifyAccessToken(
          token,
        );
  
      req.user = {
        id:
          payload.userId,
  
        role:
          payload.role,
      };
  
      next();
    } catch {
      res.status(401).json({
        success: false,
        message:
          "Invalid or expired authentication token",
        error: {
          code:
            "INVALID_TOKEN",
        },
      });
    }
  }