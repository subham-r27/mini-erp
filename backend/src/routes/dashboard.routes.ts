import {
    Router,
  } from "express";
  
  import {
    requireAuth,
  } from "../middleware/auth.middleware.js";
  
  import {
    dashboardSummary,
    recentChallans,
    recentInvoices,
    lowStock,
    salesSeries,
  } from "../controllers/dashboard.controller.js";
  
  
  const router =
    Router();
  
  
  router.use(
    requireAuth,
  );
  
  
  router.get(
    "/summary",
    dashboardSummary,
  );
  
  
  router.get(
    "/recent-challans",
    recentChallans,
  );
  
  
  router.get(
    "/recent-invoices",
    recentInvoices,
  );
  
  
  router.get(
    "/low-stock",
    lowStock,
  );

  router.get(
    "/sales-series",
    salesSeries,
  );
  
  
  export default router;