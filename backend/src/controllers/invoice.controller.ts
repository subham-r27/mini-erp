import type {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  import type {
    AuthenticatedRequest,
  } from "../middleware/auth.middleware.js";
  
  import {
    listInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    issueInvoice,
    cancelInvoice,
    markInvoicePaid,
  } from "../services/invoice.service.js";
  
  
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
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /api/invoices
  |--------------------------------------------------------------------------
  */
  
  export async function getInvoices(
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
  
  
      const customerId =
        typeof req.query.customerId ===
        "string"
          ? req.query.customerId
          : undefined;
  
  
      const rawStatus =
        typeof req.query.status ===
        "string"
          ? req.query.status
          : undefined;
  
  
      const validStatuses = [
        "DRAFT",
        "ISSUED",
        "PAID",
        "CANCELLED",
      ];
  
  
      if (
        rawStatus &&
        !validStatuses.includes(
          rawStatus,
        )
      ) {
        res.status(400).json({
          success: false,
  
          message:
            "Invalid invoice status",
  
          error: {
            code:
              "INVALID_INVOICE_STATUS",
  
            allowed:
              validStatuses,
          },
        });
  
        return;
      }
  
  
      const result =
        await listInvoices({
          page,
          limit,
          search,
          customerId,
  
          status:
            rawStatus as
              | "DRAFT"
              | "ISSUED"
              | "PAID"
              | "CANCELLED"
              | undefined,
        });
  
  
      res.status(200).json({
        success: true,
  
        data:
          result.invoices,
  
        pagination:
          result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /api/invoices/:id
  |--------------------------------------------------------------------------
  */
  
  export async function getInvoice(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const invoice =
        await getInvoiceById(
          getId(req),
        );
  
  
      res.status(200).json({
        success: true,
  
        data:
          invoice,
      });
    } catch (error) {
      handleInvoiceError(
        error,
        res,
        next,
      );
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | POST /api/invoices
  |--------------------------------------------------------------------------
  */
  
  export async function postInvoice(
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
        challanId,
        invoiceDate,
        dueDate,
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
            "At least one invoice item is required",
  
          error: {
            code:
              "INVOICE_ITEMS_REQUIRED",
          },
        });
  
        return;
      }
  
  
      const invoice =
        await createInvoice({
          customerId:
            customerId.trim(),
  
          createdById:
            userId,
  
          challanId:
            typeof challanId ===
            "string"
              ? challanId
              : undefined,
  
          invoiceDate,
  
          dueDate,
  
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
          "Invoice created successfully",
  
        data:
          invoice,
      });
    } catch (error) {
      handleInvoiceError(
        error,
        res,
        next,
      );
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | PUT /api/invoices/:id
  |--------------------------------------------------------------------------
  */
  
  export async function putInvoice(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const invoice =
        await updateInvoice(
          getId(req),
          req.body,
        );
  
  
      res.status(200).json({
        success: true,
  
        message:
          "Invoice updated successfully",
  
        data:
          invoice,
      });
    } catch (error) {
      handleInvoiceError(
        error,
        res,
        next,
      );
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | POST /api/invoices/:id/confirm
  |--------------------------------------------------------------------------
  */
  
  export async function confirmInvoice(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const invoice =
        await issueInvoice(
          getId(req),
        );
  
  
      res.status(200).json({
        success: true,
  
        message:
          "Invoice issued successfully",
  
        data:
          invoice,
      });
    } catch (error) {
      handleInvoiceError(
        error,
        res,
        next,
      );
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | POST /api/invoices/:id/pay
  |--------------------------------------------------------------------------
  */
  
  export async function payInvoice(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const invoice =
        await markInvoicePaid(
          getId(req),
        );
  
  
      res.status(200).json({
        success: true,
  
        message:
          "Invoice marked as paid",
  
        data:
          invoice,
      });
    } catch (error) {
      handleInvoiceError(
        error,
        res,
        next,
      );
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | POST /api/invoices/:id/cancel
  |--------------------------------------------------------------------------
  */
  
  export async function cancel(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const invoice =
        await cancelInvoice(
          getId(req),
        );
  
  
      res.status(200).json({
        success: true,
  
        message:
          "Invoice cancelled successfully",
  
        data:
          invoice,
      });
    } catch (error) {
      handleInvoiceError(
        error,
        res,
        next,
      );
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Error Handler
  |--------------------------------------------------------------------------
  */
  
  function handleInvoiceError(
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
  
        case "INVOICE_NOT_FOUND":
  
          res.status(404).json({
            success: false,
  
            message:
              "Invoice not found",
  
            error: {
              code:
                "INVOICE_NOT_FOUND",
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
  
  
        case "CHALLAN_NOT_CONFIRMED":
  
          res.status(409).json({
            success: false,
  
            message:
              "Invoice can only be created from a confirmed challan",
  
            error: {
              code:
                "CHALLAN_NOT_CONFIRMED",
            },
          });
  
          return;
  
  
        case "INVOICE_ITEMS_REQUIRED":
  
          res.status(400).json({
            success: false,
  
            message:
              "At least one invoice item is required",
  
            error: {
              code:
                "INVOICE_ITEMS_REQUIRED",
            },
          });
  
          return;
  
  
        case "INVALID_QUANTITY":
  
          res.status(400).json({
            success: false,
  
            message:
              "Quantity must be greater than zero",
  
            error: {
              code:
                "INVALID_QUANTITY",
            },
          });
  
          return;
  
  
        case "INVALID_TAX_RATE":
  
          res.status(400).json({
            success: false,
  
            message:
              "Tax rate must be between 0 and 100",
  
            error: {
              code:
                "INVALID_TAX_RATE",
            },
          });
  
          return;
  
  
        case "INVALID_DATE":
  
          res.status(400).json({
            success: false,
  
            message:
              "Invalid date",
  
            error: {
              code:
                "INVALID_DATE",
            },
          });
  
          return;
  
  
        case "INVOICE_NOT_EDITABLE":
  
          res.status(409).json({
            success: false,
  
            message:
              "Only draft invoices can be edited",
  
            error: {
              code:
                "INVOICE_NOT_EDITABLE",
            },
          });
  
          return;
  
  
        case "INVOICE_NOT_ISSUABLE":
  
          res.status(409).json({
            success: false,
  
            message:
              "Only draft invoices can be issued",
  
            error: {
              code:
                "INVOICE_NOT_ISSUABLE",
            },
          });
  
          return;
  
  
        case "INVOICE_NOT_PAYABLE":
  
          res.status(409).json({
            success: false,
  
            message:
              "Only issued invoices can be marked as paid",
  
            error: {
              code:
                "INVOICE_NOT_PAYABLE",
            },
          });
  
          return;
  
  
        case "PAID_INVOICE_CANNOT_BE_CANCELLED":
  
          res.status(409).json({
            success: false,
  
            message:
              "A paid invoice cannot be cancelled",
  
            error: {
              code:
                "PAID_INVOICE_CANNOT_BE_CANCELLED",
            },
          });
  
          return;
  
  
        case "INVOICE_ALREADY_CANCELLED":
  
          res.status(409).json({
            success: false,
  
            message:
              "Invoice is already cancelled",
  
            error: {
              code:
                "INVOICE_ALREADY_CANCELLED",
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