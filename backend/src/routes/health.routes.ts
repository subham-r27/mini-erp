import { Router } from "express";

import { prisma } from "../config/database.js";

const router = Router();

router.get(
  "/database",
  async (_req, res, next) => {
    try {
      await prisma.$queryRaw`
        SELECT 1
      `;

      res.status(200).json({
        success: true,
        status: "healthy",
        database: "connected",
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;