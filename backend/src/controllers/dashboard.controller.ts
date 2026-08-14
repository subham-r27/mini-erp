import type {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  import {
    getDashboardSummary,
    getRecentChallans,
    getRecentInvoices,
    getLowStockProducts,
  } from "../services/dashboard.service.js";
  
  
  function getLimit(
    value: unknown,
    fallback = 5,
  ) {
    const parsed =
      Number(value);
  
    if (
      !Number.isInteger(parsed) ||
      parsed <= 0
    ) {
      return fallback;
    }
  
    return Math.min(
      parsed,
      50,
    );
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /api/dashboard/summary
  |--------------------------------------------------------------------------
  */
  
  export async function dashboardSummary(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data =
        await getDashboardSummary();
  
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /api/dashboard/recent-challans
  |--------------------------------------------------------------------------
  */
  
  export async function recentChallans(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const limit =
        getLimit(
          req.query.limit,
        );
  
      const data =
        await getRecentChallans(
          limit,
        );
  
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /api/dashboard/recent-invoices
  |--------------------------------------------------------------------------
  */
  
  export async function recentInvoices(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const limit =
        getLimit(
          req.query.limit,
        );
  
      const data =
        await getRecentInvoices(
          limit,
        );
  
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /api/dashboard/low-stock
  |--------------------------------------------------------------------------
  */
  
  export async function lowStock(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const rawLimit =
        Number(req.query.limit);
  
      const limit =
        Number.isInteger(rawLimit) &&
        rawLimit > 0
          ? Math.min(rawLimit, 50)
          : 10;
  
      const data =
        await getLowStockProducts(
          limit,
        );
  
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }