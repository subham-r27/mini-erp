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
    deleteCustomer,
    getCustomer,
    getCustomers,
    getFollowUps,
    postCustomer,
    postFollowUp,
    putCustomer,
  } from "../controllers/customer.controller.js";
  
  
  const router =
    Router();
  
  
  /*
  |--------------------------------------------------------------------------
  | Customer Routes
  |--------------------------------------------------------------------------
  */
  
  router.use(
    requireAuth,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | List / Detail
  |--------------------------------------------------------------------------
  */
  
  router.get(
    "/",
    getCustomers,
  );
  
  router.get(
    "/:id",
    getCustomer,
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
      UserRole.SALES,
    ),
    postCustomer,
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
      UserRole.SALES,
    ),
    putCustomer,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Deactivate
  |--------------------------------------------------------------------------
  */
  
  router.delete(
    "/:id",
    requireRoles(
      UserRole.ADMIN,
      UserRole.SALES,
    ),
    deleteCustomer,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Follow-ups
  |--------------------------------------------------------------------------
  */
  
  router.get(
    "/:id/follow-ups",
    getFollowUps,
  );
  
  router.post(
    "/:id/follow-ups",
    requireRoles(
      UserRole.ADMIN,
      UserRole.SALES,
    ),
    postFollowUp,
  );
  
  
  export default router;