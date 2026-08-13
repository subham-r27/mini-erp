import {
    Router,
  } from "express";
  
  import {
    getCurrentUser,
    loginUser,
  } from "../services/auth.service.js";
  
  import {
    requireAuth,
  } from "../middleware/auth.middleware.js";
  
  
  const router =
    Router();
  
  
  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */
  
  router.post(
    "/login",
    async (
      req,
      res,
      next,
    ) => {
      try {
        const {
          email,
          password,
        } = req.body;
  
        if (
          typeof email !==
            "string" ||
          typeof password !==
            "string" ||
          !email.trim() ||
          !password
        ) {
          res.status(400).json({
            success: false,
            message:
              "Email and password are required",
            error: {
              code:
                "VALIDATION_ERROR",
            },
          });
  
          return;
        }
  
        try {
          const result =
            await loginUser(
              email.trim(),
              password,
            );
  
          res.status(200).json({
            success: true,
            message:
              "Login successful",
            data: result,
          });
        } catch (error) {
          if (
            error instanceof
              Error &&
            error.message ===
              "INVALID_CREDENTIALS"
          ) {
            res.status(401).json({
              success: false,
              message:
                "Invalid email or password",
              error: {
                code:
                  "INVALID_CREDENTIALS",
              },
            });
  
            return;
          }
  
          if (
            error instanceof
              Error &&
            error.message ===
              "USER_INACTIVE"
          ) {
            res.status(403).json({
              success: false,
              message:
                "Your account is inactive",
              error: {
                code:
                  "USER_INACTIVE",
              },
            });
  
            return;
          }
  
          throw error;
        }
      } catch (error) {
        next(error);
      }
    },
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | CURRENT USER
  |--------------------------------------------------------------------------
  */
  
  router.get(
    "/me",
    requireAuth,
    async (
      req,
      res,
      next,
    ) => {
      try {
        const authenticatedRequest =
          req as typeof req & {
            user?: {
              id: string;
            };
          };
  
        if (
          !authenticatedRequest.user
        ) {
          res.status(401).json({
            success: false,
            message:
              "Authentication required",
          });
  
          return;
        }
  
        const user =
          await getCurrentUser(
            authenticatedRequest
              .user.id,
          );
  
        res.status(200).json({
          success: true,
          data: user,
        });
      } catch (error) {
        if (
          error instanceof
            Error &&
          error.message ===
            "USER_NOT_FOUND"
        ) {
          res.status(404).json({
            success: false,
            message:
              "User not found",
            error: {
              code:
                "USER_NOT_FOUND",
            },
          });
  
          return;
        }
  
        next(error);
      }
    },
  );
  
  
  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  |
  | JWT authentication is currently stateless.
  | The frontend removes its token after receiving
  | this successful response.
  |
  */
  
  router.post(
    "/logout",
    requireAuth,
    (_req, res) => {
      res.status(200).json({
        success: true,
        message:
          "Logout successful",
      });
    },
  );
  
  
  export default router;