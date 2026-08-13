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
    getProduct,
    getProducts,
    patchProductStatus,
    postProduct,
    putProduct,
  } from "../controllers/product.controller.js";
  
  
  const router =
    Router();
  
  
  router.use(
    requireAuth,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Read
  |--------------------------------------------------------------------------
  */
  
  router.get(
    "/",
    getProducts,
  );
  
  router.get(
    "/:id",
    getProduct,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */
  
  router.post(
    "/",
    requireRoles(
      UserRole.ADMIN,
      UserRole.WAREHOUSE,
    ),
    postProduct,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */
  
  router.put(
    "/:id",
    requireRoles(
      UserRole.ADMIN,
      UserRole.WAREHOUSE,
    ),
    putProduct,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */
  
  router.patch(
    "/:id/status",
    requireRoles(
      UserRole.ADMIN,
      UserRole.WAREHOUSE,
    ),
    patchProductStatus,
  );
  
  
  export default router;