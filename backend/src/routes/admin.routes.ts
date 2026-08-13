import {
    Router,
  } from "express";
  
  import {
    requireAuth,
  } from "../middleware/auth.middleware.js";
  
  import {
    requireRoles,
  } from "../middleware/role.middleware.js";
  
  import {
    UserRole,
  } from "../generated/prisma/client";
  
  
  const router =
    Router();
  
  
  router.get(
    "/test",
    requireAuth,
    requireRoles(
      UserRole.ADMIN,
    ),
    (_req, res) => {
      res.status(200).json({
        success: true,
        message:
          "Admin authorization successful",
      });
    },
  );
  
  
  export default router;