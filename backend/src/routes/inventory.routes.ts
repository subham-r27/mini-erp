import {
    Router,
  } from "express";
  
  import {
    UserRole,
  } from "../generated/prisma/client";
  
  import {
    requireAuth,
  } from "../middleware/auth.middleware.js";
  
  import {
    requireRoles,
  } from "../middleware/role.middleware.js";
  
  import {
    getInventory,
    getMovements,
    getProductMovementHistory,
    postMovement,
  } from "../controllers/inventory.controller.js";
  
  
  const router =
    Router();
  
  
  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  */
  
  router.use(
    requireAuth,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Inventory Overview
  |--------------------------------------------------------------------------
  |
  | ADMIN
  | SALES
  | WAREHOUSE
  |
  */
  
  router.get(
    "/",
    getInventory,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Movement History
  |--------------------------------------------------------------------------
  */
  
  router.get(
    "/movements",
    getMovements,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Product Movement History
  |--------------------------------------------------------------------------
  */
  
  router.get(
    "/products/:id/movements",
    getProductMovementHistory,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Stock Movement Creation
  |--------------------------------------------------------------------------
  |
  | ADMIN
  | WAREHOUSE
  |
  */
  
  router.post(
    "/movements",
    requireRoles(
      UserRole.ADMIN,
      UserRole.WAREHOUSE,
    ),
    postMovement,
  );
  
  
  export default router;