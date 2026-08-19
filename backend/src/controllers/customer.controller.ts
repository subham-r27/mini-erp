import type {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  import {
    CustomerStatus,
    CustomerType,
  } from "../generated/prisma/client";
  
  import {
    AuthenticatedRequest,
  } from "../middleware/auth.middleware.js";
  
  import {
    addCustomerFollowUp,
    createCustomer,
    deactivateCustomer,
    getCustomerById,
    getCustomerFollowUps,
    listCustomers,
    updateCustomer,
  } from "../services/customer.service.js";
  
  
  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */
  function getParamId(
    req: Request,
  ): string {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error(
        "INVALID_ROUTE_PARAMETER",
      );
    }

    return id;
  }

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
  
  
  function parsePositiveInt(
    value: unknown,
    fallback: number,
  ): number {
    const parsed =
      Number(value);
  
    if (
      !Number.isInteger(parsed) ||
      parsed <= 0
    ) {
      return fallback;
    }
  
    return parsed;
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /customers
  |--------------------------------------------------------------------------
  */
  
  export async function getCustomers(
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
  
      const limit = Math.min(
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
  
      const status =
        typeof req.query.status ===
        "string"
          ? (
              Object.values(
                CustomerStatus,
              ) as string[]
            ).includes(
              req.query.status,
            )
            ? (
                req.query.status as CustomerStatus
              )
            : undefined
          : undefined;
  
      const customerType =
        typeof req.query.customerType ===
        "string"
          ? (
              Object.values(
                CustomerType,
              ) as string[]
            ).includes(
              req.query.customerType,
            )
            ? (
                req.query.customerType as CustomerType
              )
            : undefined
          : undefined;
  
      const result =
        await listCustomers({
          page,
          limit,
          search,
          status,
          customerType,
        });
  
      res.status(200).json({
        success: true,
        data: result.customers,
        pagination:
          result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /customers/:id
  |--------------------------------------------------------------------------
  */
  
  export async function getCustomer(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const customer =
        await getCustomerById(
          getParamId(req),
        );
  
      if (!customer) {
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
      }
  
      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | POST /customers
  |--------------------------------------------------------------------------
  */
  
  export async function postCustomer(
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
        name,
        mobile,
        email,
        businessName,
        gstNumber,
        customerType,
        status,
        address,
        followUpDate,
        notes,
      } = req.body;
  
      if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof mobile !== "string" ||
        !mobile.trim() ||
        typeof businessName !== "string" ||
        !businessName.trim() ||
        !Object.values(
          CustomerType,
        ).includes(customerType)
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid customer data",
          error: {
            code:
              "VALIDATION_ERROR",
          },
        });
  
        return;
      }
  
      const customer =
        await createCustomer({
          name,
          mobile,
          email,
          businessName,
          gstNumber,
          customerType,
          status,
          address,
          followUpDate,
          notes,
          createdById:
            userId,
        });
  
      res.status(201).json({
        success: true,
        message:
          "Customer created successfully",
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | PUT /customers/:id
  |--------------------------------------------------------------------------
  */
  
  export async function putCustomer(
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
  
      const existing =
        await getCustomerById(
          getParamId(req),
        );
  
      if (!existing) {
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
      }
  
      const {
        name,
        mobile,
        email,
        businessName,
        gstNumber,
        customerType,
        status,
        address,
        followUpDate,
        notes,
      } = req.body;
  
      if (
        customerType !== undefined &&
        !Object.values(
          CustomerType,
        ).includes(customerType)
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid customer type",
          error: {
            code:
              "VALIDATION_ERROR",
          },
        });
  
        return;
      }
  
      if (
        status !== undefined &&
        !Object.values(
          CustomerStatus,
        ).includes(status)
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid customer status",
          error: {
            code:
              "VALIDATION_ERROR",
          },
        });
  
        return;
      }
  
      const customer =
        await updateCustomer(
          getParamId(req),
          {
            name,
            mobile,
            email,
            businessName,
            gstNumber,
            customerType,
            status,
            address,
            followUpDate,
            notes,
            updatedById:
              userId,
          },
        );
  
      res.status(200).json({
        success: true,
        message:
          "Customer updated successfully",
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | DELETE /customers/:id
  |--------------------------------------------------------------------------
  */
  
  export async function deleteCustomer(
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
  
      const existing =
        await getCustomerById(
          getParamId(req),
        );
  
      if (!existing) {
        res.status(404).json({
          success: false,
          message:
            "Customer not found",
        });
  
        return;
      }
  
      const customer =
        await deactivateCustomer(
          getParamId(req),
          userId,
        );
  
      res.status(200).json({
        success: true,
        message:
          "Customer deactivated successfully",
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /customers/:id/follow-ups
  |--------------------------------------------------------------------------
  */
  
  export async function getFollowUps(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const customer =
        await getCustomerById(
          getParamId(req),
        );
  
      if (!customer) {
        res.status(404).json({
          success: false,
          message:
            "Customer not found",
        });
  
        return;
      }
  
      const followUps =
        await getCustomerFollowUps(
          getParamId(req),
        );
  
      res.status(200).json({
        success: true,
        data: followUps,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | POST /customers/:id/follow-ups
  |--------------------------------------------------------------------------
  */
  
  export async function postFollowUp(
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
  
      const customer =
        await getCustomerById(
          getParamId(req),
        );
  
      if (!customer) {
        res.status(404).json({
          success: false,
          message:
            "Customer not found",
        });
  
        return;
      }
  
      const {
        note,
        followUpDate,
      } = req.body;
  
      if (
        typeof note !== "string" ||
        !note.trim()
      ) {
        res.status(400).json({
          success: false,
          message:
            "Follow-up note is required",
          error: {
            code:
              "VALIDATION_ERROR",
          },
        });
  
        return;
      }
  
      const followUp =
        await addCustomerFollowUp(
          getParamId(req),
          userId,
          note,
          followUpDate,
        );
  
      res.status(201).json({
        success: true,
        message:
          "Follow-up added successfully",
        data: followUp,
      });
    } catch (error) {
      next(error);
    }
  }