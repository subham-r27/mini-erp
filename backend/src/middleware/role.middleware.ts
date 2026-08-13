import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import type {
    UserRole,
  } from "../generated/prisma/client";
  
  import type {
    AuthenticatedRequest,
  } from "./auth.middleware.js";
  
  
  export function requireRoles(
    ...allowedRoles: UserRole[]
  ) {
    return (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const authenticatedRequest =
        req as AuthenticatedRequest;
  
      if (
        !authenticatedRequest.user
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
  
      const userRole =
        authenticatedRequest
          .user.role;
  
      if (
        !allowedRoles.includes(
          userRole,
        )
      ) {
        res.status(403).json({
          success: false,
          message:
            "You do not have permission to perform this action",
          error: {
            code:
              "FORBIDDEN",
          },
        });
  
        return;
      }
  
      next();
    };
  }