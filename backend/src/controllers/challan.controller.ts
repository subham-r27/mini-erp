import type {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  import type {
    AuthenticatedRequest,
  } from "../middleware/auth.middleware.js";
  
  import {
    createChallan,
    updateChallan,
    getChallanById,
    listChallans,
    confirmChallan,
    cancelChallan,
  } from "../services/challan.service.js";
  
  
  function getUserId(
    req: Request,
  ): string | null {
    const request =
      req as AuthenticatedRequest;
  
    return (
      request.user?.id ??
      null
    );
  }
  
  
  function getId(
    req: Request,
  ): string {
    const id =
      req.params.id;
  
    if (
      typeof id !==
      "string"
    ) {
      throw new Error(
        "INVALID_ROUTE_PARAMETER",
      );
    }
  
    return id;
  }
  
  
  function positiveInt(
    value: unknown,
    fallback: number,
  ) {
    const number =
      Number(value);
  
    if (
      !Number.isInteger(
        number,
      ) ||
      number <= 0
    ) {
      return fallback;
    }
  
    return number;
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /api/challans
  |--------------------------------------------------------------------------
  */
  
  export async function getChallans(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const page =
        positiveInt(
          req.query.page,
          1,
        );
  
      const limit =
        Math.min(
          positiveInt(
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
  
      const status =
        typeof req.query.status ===
        "string"
          ? req.query.status
          : undefined;
  
      const customerId =
        typeof req.query.customerId ===
        "string"
          ? req.query.customerId
          : undefined;
  
  
      const result =
        await listChallans({
          page,
          limit,
          search,
          status:
            status as
              | "DRAFT"
              | "CONFIRMED"
              | "CANCELLED"
              | undefined,
          customerId,
        });
  
  
      res.status(200).json({
        success: true,
  
        data:
          result.challans,
  
        pagination:
          result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /api/challans/:id
  |--------------------------------------------------------------------------
  */
  
  export async function getChallan(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const challan =
        await getChallanById(
          getId(req),
        );
  
  
      res.status(200).json({
        success: true,
  
        data:
          challan,
      });
    } catch (error) {
      handleChallanError(
        error,
        res,
        next,
      );
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | POST /api/challans
  |--------------------------------------------------------------------------
  */
  
  export async function postChallan(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId =
        getUserId(req);
  
  
      if (!userId) {
        res.status(401).json({
          success: false,
          message:
            "Authentication required",
        });
  
        return;
      }
  
  
      const {
        customerId,
        notes,
        items,
      } = req.body;
  
  
      if (
        typeof customerId !==
          "string" ||
        !customerId.trim()
      ) {
        res.status(400).json({
          success: false,
          message:
            "Customer ID is required",
          error: {
            code:
              "CUSTOMER_ID_REQUIRED",
          },
        });
  
        return;
      }
  
  
      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        res.status(400).json({
          success: false,
          message:
            "At least one product is required",
          error: {
            code:
              "CHALLAN_ITEMS_REQUIRED",
          },
        });
  
        return;
      }
  
  
      const challan =
        await createChallan({
          customerId:
            customerId.trim(),
  
          createdById:
            userId,
  
          notes:
            typeof notes ===
            "string"
              ? notes
              : undefined,
  
          items,
        });
  
  
      res.status(201).json({
        success: true,
  
        message:
          "Challan created successfully",
  
        data:
          challan,
      });
    } catch (error) {
      handleChallanError(
        error,
        res,
        next,
      );
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | PUT /api/challans/:id
  |--------------------------------------------------------------------------
  */
  
  export async function putChallan(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const challan =
        await updateChallan(
          getId(req),
          req.body,
        );
  
  
      res.status(200).json({
        success: true,
  
        message:
          "Challan updated successfully",
  
        data:
          challan,
      });
    } catch (error) {
      handleChallanError(
        error,
        res,
        next,
      );
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | POST /api/challans/:id/confirm
  |--------------------------------------------------------------------------
  */
  
  export async function confirm(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId =
        getUserId(req);
  
  
      if (!userId) {
        res.status(401).json({
          success: false,
  
          message:
            "Authentication required",
        });
  
        return;
      }
  
  
      const challan =
        await confirmChallan(
          getId(req),
          userId,
        );
  
  
      res.status(200).json({
        success: true,
  
        message:
          "Challan confirmed successfully",
  
        data:
          challan,
      });
    } catch (error) {
      handleChallanError(
        error,
        res,
        next,
      );
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | POST /api/challans/:id/cancel
  |--------------------------------------------------------------------------
  */
  
  export async function cancel(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const challan =
        await cancelChallan(
          getId(req),
        );
  
  
      res.status(200).json({
        success: true,
  
        message:
          "Challan cancelled successfully",
  
        data:
          challan,
      });
    } catch (error) {
      handleChallanError(
        error,
        res,
        next,
      );
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Error Handling
  |--------------------------------------------------------------------------
  */
  
  function handleChallanError(
    error: unknown,
    res: Response,
    next: NextFunction,
  ) {
    if (
      error instanceof Error
    ) {
      switch (
        error.message
      ) {
  
        case "CHALLAN_NOT_FOUND":
  
          res.status(404).json({
            success: false,
            message:
              "Challan not found",
            error: {
              code:
                "CHALLAN_NOT_FOUND",
            },
          });
  
          return;
  
  
        case "CUSTOMER_NOT_FOUND":
  
          res.status(404).json({
            success: false,
            message:
              "Customer not found",
            error: {
              code:
                "CUSTOMER_NOT_FOUND",
            },
          });
  
          return;
  
  
        case "PRODUCT_NOT_FOUND":
  
          res.status(404).json({
            success: false,
            message:
              "One or more products were not found",
            error: {
              code:
                "PRODUCT_NOT_FOUND",
            },
          });
  
          return;
  
  
        case "USER_NOT_FOUND":
  
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
  
  
        case "CHALLAN_ITEMS_REQUIRED":
  
          res.status(400).json({
            success: false,
            message:
              "At least one challan item is required",
            error: {
              code:
                "CHALLAN_ITEMS_REQUIRED",
            },
          });
  
          return;
  
  
        case "CHALLAN_NOT_EDITABLE":
  
          res.status(409).json({
            success: false,
            message:
              "Only draft challans can be edited",
            error: {
              code:
                "CHALLAN_NOT_EDITABLE",
            },
          });
  
          return;
  
  
        case "CHALLAN_NOT_CONFIRMABLE":
  
          res.status(409).json({
            success: false,
            message:
              "Only draft challans can be confirmed",
            error: {
              code:
                "CHALLAN_NOT_CONFIRMABLE",
            },
          });
  
          return;
  
  
        case "PRODUCT_INACTIVE":
  
          res.status(409).json({
            success: false,
            message:
              "One or more products are inactive",
            error: {
              code:
                "PRODUCT_INACTIVE",
            },
          });
  
          return;
  
  
        case "INSUFFICIENT_STOCK": {
  
          const stockError =
            error as Error & {
              productName?: string;
              available?: number;
              requested?: number;
            };
  
  
          res.status(409).json({
            success: false,
  
            message:
              "Insufficient stock",
  
            error: {
              code:
                "INSUFFICIENT_STOCK",
  
              productName:
                stockError.productName,
  
              available:
                stockError.available,
  
              requested:
                stockError.requested,
            },
          });
  
          return;
        }
  
  
        case "CHALLAN_ALREADY_CANCELLED":
  
          res.status(409).json({
            success: false,
            message:
              "Challan is already cancelled",
            error: {
              code:
                "CHALLAN_ALREADY_CANCELLED",
            },
          });
  
          return;
  
  
        case "CONFIRMED_CHALLAN_CANNOT_BE_CANCELLED":
  
          res.status(409).json({
            success: false,
            message:
              "A confirmed challan cannot be cancelled",
            error: {
              code:
                "CONFIRMED_CHALLAN_CANNOT_BE_CANCELLED",
            },
          });
  
          return;
  
  
        case "INVALID_ROUTE_PARAMETER":
  
          res.status(400).json({
            success: false,
            message:
              "Invalid route parameter",
          });
  
          return;
      }
    }
  
  
    next(error);
  }