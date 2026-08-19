import { Router } from "express";

import { getUsers } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/role.middleware.js";
import { UserRole } from "../generated/prisma/client";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireRoles(UserRole.ADMIN),
  getUsers,
);

export default router;
