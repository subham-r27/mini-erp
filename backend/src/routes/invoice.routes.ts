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
  getInvoices,
  getInvoice,
  postInvoice,
  putInvoice,
  confirmInvoice,
  payInvoice,
  cancel,
} from "../controllers/invoice.controller.js";


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
| GET /api/invoices
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getInvoices,
);


/*
|--------------------------------------------------------------------------
| GET /api/invoices/:id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  getInvoice,
);


/*
|--------------------------------------------------------------------------
| POST /api/invoices
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireRoles(
    "ADMIN",
    "SALES",
  ),
  postInvoice,
);


/*
|--------------------------------------------------------------------------
| PUT /api/invoices/:id
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  requireRoles(
    "ADMIN",
    "SALES",
  ),
  putInvoice,
);


/*
|--------------------------------------------------------------------------
| ISSUE
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/confirm",
  requireRoles(
    "ADMIN",
    "SALES",
  ),
  confirmInvoice,
);


/*
|--------------------------------------------------------------------------
| PAY
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/pay",
  requireRoles(
    "ADMIN",
    "SALES",
  ),
  payInvoice,
);


/*
|--------------------------------------------------------------------------
| CANCEL
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