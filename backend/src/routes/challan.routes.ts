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
    getChallans,
    getChallan,
    postChallan,
    putChallan,
    confirm,
    cancel,
  } from "../controllers/challan.controller.js";
  
  
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
  | List
  |--------------------------------------------------------------------------
  */
  
  router.get(
    "/",
    getChallans,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Details
  |--------------------------------------------------------------------------
  */
  
  router.get(
    "/:id",
    getChallan,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Create Draft
  |--------------------------------------------------------------------------
  |
  | Sales + Admin
  |
  */
  
  router.post(
    "/",
    requireRoles(
      "ADMIN",
      "SALES",
    ),
    postChallan,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Update Draft
  |--------------------------------------------------------------------------
  */
  
  router.put(
    "/:id",
    requireRoles(
      "ADMIN",
      "SALES",
    ),
    putChallan,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Confirm
  |--------------------------------------------------------------------------
  */
  
  router.post(
    "/:id/confirm",
    requireRoles(
      "ADMIN",
      "SALES",
    ),
    confirm,
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | Cancel
  |--------------------------------------------------------------------------
  */
  
  router.post(
    "/:id/cancel",
    requireRoles(
      "ADMIN",
      "SALES",
    ),
    cancel,
  );
  
  
  export default router;