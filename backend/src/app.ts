import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import { env } from "./config/env.js";
import healthRouter from "./routes/health.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import customerRouter from "./routes/customer.routes.js";
import productRouter from "./routes/product.routes.js";


const app = express();


/* =========================================================
   SECURITY
========================================================= */

app.use(
  helmet(),
);


/* =========================================================
   CORS
========================================================= */

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);


/* =========================================================
   BODY PARSER
========================================================= */

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
  }),
);


/* =========================================================
   REQUEST LOGGING
========================================================= */

if (env.NODE_ENV !== "test") {
  app.use(
    morgan("dev"),
  );
}


/* =========================================================
   ROOT
========================================================= */

app.get(
  "/",
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Mini ERP CRM API is running",
      version: "1.0.0",
    });
  },
);


/* =========================================================
   BASIC HEALTH CHECK
========================================================= */

app.get(
  "/health",
  (_req, res) => {
    res.status(200).json({
      success: true,
      status: "healthy",
      service: "mini-erp-crm-api",
    });
  },
);


/* =========================================================
   DATABASE HEALTH CHECK
========================================================= */

app.use(
  "/health",
  healthRouter,
);

/* =========================================================
   ROUTES
========================================================= */

app.get(
  "/",
  (_req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Mini ERP CRM API is running",
      version:
        "1.0.0",
    });
  },
);


app.get(
  "/health",
  (_req, res) => {
    res.status(200).json({
      success: true,
      status: "healthy",
      service:
        "mini-erp-crm-api",
    });
  },
);


app.use(
  "/health",
  healthRouter,
);


app.use(
  "/api/auth",
  authRouter,
);

app.use(
  "/api/admin",
  adminRouter,
);

app.use(
  "/api/customers",
  customerRouter,
);

app.use(
  "/api/products",
  productRouter,
);


/* =========================================================
   CENTRALIZED ERROR HANDLER
========================================================= */

app.use(
  errorHandler,
);


export default app;