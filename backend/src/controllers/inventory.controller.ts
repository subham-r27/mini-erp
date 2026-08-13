import type {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  import type {
    AuthenticatedRequest,
  } from "../middleware/auth.middleware.js";
  
  import {
    createStockMovement,
    getInventoryOverview,
    getProductMovements,
    getStockMovements,
  } from "../services/inventory.service.js";
  
  
  /*
  |--------------------------------------------------------------------------
  | Allowed Stock Movement Types
  |--------------------------------------------------------------------------
  */
  
  const MOVEMENT_TYPES = [
    "IN",
    "OUT",
  ] as const;
  
  type MovementType =
    (typeof MOVEMENT_TYPES)[number];
  
  
  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */
  
  /**
   * Get the authenticated user's ID from the JWT middleware.
   */
  function getUserId(
    req: Request,
  ): string | null {
    const authenticatedRequest =
      req as AuthenticatedRequest;
  
    return (
      authenticatedRequest.user?.id ??
      null
    );
  }
  
  
  /**
   * Safely extract a route parameter.
   */
  function getParamId(
    req: Request,
  ): string {
    const id =
      req.params.id;
  
    if (
      typeof id !== "string"
    ) {
      throw new Error(
        "INVALID_ROUTE_PARAMETER",
      );
    }
  
    return id;
  }
  
  
  /**
   * Parse a positive integer query parameter.
   */
  function parsePositiveInt(
    value: unknown,
    fallback: number,
  ): number {
    const parsed =
      Number(value);
  
    if (
      !Number.isInteger(
        parsed,
      ) ||
      parsed <= 0
    ) {
      return fallback;
    }
  
    return parsed;
  }
  
  
  /**
   * Validate movement type.
   */
  function isMovementType(
    value: unknown,
  ): value is MovementType {
    return (
      typeof value === "string" &&
      (
        MOVEMENT_TYPES as readonly string[]
      ).includes(value)
    );
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /api/inventory
  |--------------------------------------------------------------------------
  |
  | Inventory overview.
  |
  */
  
  export async function getInventory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const page =
        parsePositiveInt(
          req.query.page,
          1,
        );
  
      const limit =
        Math.min(
          parsePositiveInt(
            req.query.limit,
            20,
          ),
          100,
        );
  
      const search =
        typeof req.query.search ===
        "string"
          ? req.query.search.trim()
          : undefined;
  
      const location =
        typeof req.query.location ===
        "string"
          ? req.query.location.trim()
          : undefined;
  
      const lowStock =
        req.query.lowStock ===
        "true";
  
      const result =
        await getInventoryOverview({
          page,
          limit,
          search,
          location,
          lowStock,
        });
  
      res.status(200).json({
        success: true,
  
        data:
          result.products,
  
        pagination:
          result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /api/inventory/movements
  |--------------------------------------------------------------------------
  |
  | Get all stock movements with pagination
  | and optional filters.
  |
  */
  
  export async function getMovements(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const page =
        parsePositiveInt(
          req.query.page,
          1,
        );
  
      const limit =
        Math.min(
          parsePositiveInt(
            req.query.limit,
            20,
          ),
          100,
        );
  
      const productId =
        typeof req.query.productId ===
        "string"
          ? req.query.productId
          : undefined;
  
      const type =
        isMovementType(
          req.query.type,
        )
          ? req.query.type
          : undefined;
  
      const result =
        await getStockMovements({
          page,
          limit,
          productId,
          type,
        });
  
      res.status(200).json({
        success: true,
  
        data:
          result.movements,
  
        pagination:
          result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /api/inventory/products/:id/movements
  |--------------------------------------------------------------------------
  |
  | Get movement history for one product.
  |
  */
  
  export async function getProductMovementHistory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const productId =
        getParamId(req);
  
      const movements =
        await getProductMovements(
          productId,
        );
  
      res.status(200).json({
        success: true,
  
        data:
          movements,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | POST /api/inventory/movements
  |--------------------------------------------------------------------------
  |
  | Create a stock IN / OUT movement.
  |
  | Authentication is handled by requireAuth
  | at the route level.
  |
  */
  
  export async function postMovement(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      /*
      |--------------------------------------------------------------------------
      | Authenticated User
      |--------------------------------------------------------------------------
      */
  
      const userId =
        getUserId(req);
  
      if (!userId) {
        res.status(401).json({
          success: false,
  
          message:
            "Authentication required",
  
          error: {
            code:
              "AUTHENTICATION_REQUIRED",
          },
        });
  
        return;
      }
  
  
      /*
      |--------------------------------------------------------------------------
      | Request Body
      |--------------------------------------------------------------------------
      */
  
      const {
        productId,
        type,
        quantity,
        reason,
      } = req.body;
  
  
      /*
      |--------------------------------------------------------------------------
      | Product ID Validation
      |--------------------------------------------------------------------------
      */
  
      if (
        typeof productId !==
          "string" ||
        !productId.trim()
      ) {
        res.status(400).json({
          success: false,
  
          message:
            "Product ID is required",
  
          error: {
            code:
              "VALIDATION_ERROR",
          },
        });
  
        return;
      }
  
  
      /*
      |--------------------------------------------------------------------------
      | Movement Type Validation
      |--------------------------------------------------------------------------
      */
  
      if (
        !isMovementType(type)
      ) {
        res.status(400).json({
          success: false,
  
          message:
            "Invalid stock movement type",
  
          error: {
            code:
              "INVALID_MOVEMENT_TYPE",
  
            allowed:
              MOVEMENT_TYPES,
          },
        });
  
        return;
      }
  
  
      /*
      |--------------------------------------------------------------------------
      | Quantity Validation
      |--------------------------------------------------------------------------
      */
  
      if (
        typeof quantity !==
          "number" ||
        !Number.isInteger(
          quantity,
        ) ||
        quantity <= 0
      ) {
        res.status(400).json({
          success: false,
  
          message:
            "Quantity must be a positive integer",
  
          error: {
            code:
              "INVALID_QUANTITY",
          },
        });
  
        return;
      }
  
  
      /*
      |--------------------------------------------------------------------------
      | Reason Validation
      |--------------------------------------------------------------------------
      */
  
      if (
        typeof reason !==
          "string" ||
        !reason.trim()
      ) {
        res.status(400).json({
          success: false,
  
          message:
            "Reason is required",
  
          error: {
            code:
              "INVALID_REASON",
          },
        });
  
        return;
      }
  
  
      /*
      |--------------------------------------------------------------------------
      | Create Movement
      |--------------------------------------------------------------------------
      */
  
      const result =
        await createStockMovement({
          productId:
            productId.trim(),
  
          createdById:
            userId,
  
          type,
  
          quantity,
  
          reason:
            reason.trim(),
        });
  
  
      /*
      |--------------------------------------------------------------------------
      | Success Response
      |--------------------------------------------------------------------------
      */
  
      res.status(201).json({
        success: true,
  
        message:
          "Stock movement created successfully",
  
        data:
          result,
      });
    } catch (error) {
  
      /*
      |--------------------------------------------------------------------------
      | Known Business Errors
      |--------------------------------------------------------------------------
      */
  
      if (
        error instanceof Error
      ) {
        switch (
          error.message
        ) {
  
          /*
          |--------------------------------------------------------------------------
          | Product Not Found
          |--------------------------------------------------------------------------
          */
  
          case "PRODUCT_NOT_FOUND":
  
            res.status(404).json({
              success: false,
  
              message:
                "Product not found",
  
              error: {
                code:
                  "PRODUCT_NOT_FOUND",
              },
            });
  
            return;
  
  
          /*
          |--------------------------------------------------------------------------
          | Product Inactive
          |--------------------------------------------------------------------------
          */
  
          case "PRODUCT_INACTIVE":
  
            res.status(409).json({
              success: false,
  
              message:
                "Cannot modify stock for an inactive product",
  
              error: {
                code:
                  "PRODUCT_INACTIVE",
              },
            });
  
            return;
  
  
          /*
          |--------------------------------------------------------------------------
          | Insufficient Stock
          |--------------------------------------------------------------------------
          */
  
          case "INSUFFICIENT_STOCK":
  
            res.status(409).json({
              success: false,
  
              message:
                "Insufficient stock",
  
              error: {
                code:
                  "INSUFFICIENT_STOCK",
              },
            });
  
            return;
  
  
          /*
          |--------------------------------------------------------------------------
          | Negative Stock
          |--------------------------------------------------------------------------
          */
  
          case "NEGATIVE_STOCK":
  
            res.status(409).json({
              success: false,
  
              message:
                "Stock cannot become negative",
  
              error: {
                code:
                  "NEGATIVE_STOCK",
              },
            });
  
            return;
  
  
          /*
          |--------------------------------------------------------------------------
          | Invalid Quantity
          |--------------------------------------------------------------------------
          */
  
          case "INVALID_QUANTITY":
  
            res.status(400).json({
              success: false,
  
              message:
                "Quantity must be a positive integer",
  
              error: {
                code:
                  "INVALID_QUANTITY",
              },
            });
  
            return;
  
  
          /*
          |--------------------------------------------------------------------------
          | Invalid Reason
          |--------------------------------------------------------------------------
          */
  
          case "INVALID_REASON":
  
            res.status(400).json({
              success: false,
  
              message:
                "Reason is required",
  
              error: {
                code:
                  "INVALID_REASON",
              },
            });
  
            return;
  
  
          /*
          |--------------------------------------------------------------------------
          | Invalid Route Parameter
          |--------------------------------------------------------------------------
          */
  
          case "INVALID_ROUTE_PARAMETER":
  
            res.status(400).json({
              success: false,
  
              message:
                "Invalid route parameter",
  
              error: {
                code:
                  "INVALID_ROUTE_PARAMETER",
              },
            });
  
            return;
        }
      }
  
  
      /*
      |--------------------------------------------------------------------------
      | Unknown Error
      |--------------------------------------------------------------------------
      */
  
      next(error);
    }
  }