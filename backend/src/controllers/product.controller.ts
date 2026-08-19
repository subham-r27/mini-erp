import type {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  import {
    createProduct,
    getProductById,
    listProducts,
    updateProduct,
    updateProductStatus,
  } from "../services/product.service.js";
  
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
  | GET /products
  |--------------------------------------------------------------------------
  */
  
  export async function getProducts(
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
  
      const category =
        typeof req.query.category ===
        "string"
          ? req.query.category
          : undefined;
  
      const location =
        typeof req.query.location ===
        "string"
          ? req.query.location
          : undefined;
  
      const isActive =
        req.query.isActive ===
        "true"
          ? true
          : req.query.isActive ===
            "false"
            ? false
            : undefined;
  
      const lowStock =
        req.query.lowStock ===
        "true";
  
      const result =
        await listProducts({
          page,
          limit,
          search,
          category,
          location,
          isActive,
          lowStock,
        });
  
      res.status(200).json({
        success: true,
        data: result.products,
        pagination:
          result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET /products/:id
  |--------------------------------------------------------------------------
  */
  
  export async function getProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const product =
        await getProductById(
          getParamId(req),
        );
  
      if (!product) {
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
      }
  
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | POST /products
  |--------------------------------------------------------------------------
  */
  
  export async function postProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const {
        name,
        sku,
        category,
        unitPrice,
        minimumStock,
        location,
        description,
        imageUrl,
      } = req.body;
  
      if (
        typeof name !== "string" ||
        !name.trim() ||
  
        typeof sku !== "string" ||
        !sku.trim() ||
  
        typeof category !==
          "string" ||
        !category.trim() ||
  
        typeof unitPrice !==
          "number" ||
        unitPrice < 0 ||
  
        typeof minimumStock !==
          "number" ||
        minimumStock < 0 ||
  
        typeof location !==
          "string" ||
        !location.trim()
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid product data",
          error: {
            code:
              "VALIDATION_ERROR",
          },
        });
  
        return;
      }
  
      const existing =
        await prismaProductBySku(
          sku,
        );
  
      if (existing) {
        res.status(409).json({
          success: false,
          message:
            "A product with this SKU already exists",
          error: {
            code:
              "DUPLICATE_SKU",
          },
        });
  
        return;
      }
  
      const product =
        await createProduct({
          name,
          sku,
          category,
          unitPrice,
          minimumStock,
          location,
          description,
          imageUrl,
        });
  
      res.status(201).json({
        success: true,
        message:
          "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | PUT /products/:id
  |--------------------------------------------------------------------------
  */
  
  export async function putProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const existing =
        await getProductById(
          getParamId(req),
        );
  
      if (!existing) {
        res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
  
        return;
      }
  
      const {
        name,
        sku,
        category,
        unitPrice,
        minimumStock,
        location,
        description,
        imageUrl,
        isActive,
      } = req.body;
  
      if (
        unitPrice !== undefined &&
        (
          typeof unitPrice !==
            "number" ||
          unitPrice < 0
        )
      ) {
        res.status(400).json({
          success: false,
          message:
            "Unit price must be a non-negative number",
          error: {
            code:
              "VALIDATION_ERROR",
          },
        });
  
        return;
      }
  
      if (
        minimumStock !== undefined &&
        (
          typeof minimumStock !==
            "number" ||
          minimumStock < 0
        )
      ) {
        res.status(400).json({
          success: false,
          message:
            "Minimum stock must be a non-negative number",
          error: {
            code:
              "VALIDATION_ERROR",
          },
        });
  
        return;
      }
  
      const product =
        await updateProduct(
          getParamId(req),
          {
            name,
            sku,
            category,
            unitPrice,
            minimumStock,
            location,
            description,
            imageUrl,
            isActive,
          },
        );
  
      res.status(200).json({
        success: true,
        message:
          "Product updated successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | PATCH /products/:id/status
  |--------------------------------------------------------------------------
  */
  
  export async function patchProductStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const existing =
        await getProductById(
          getParamId(req),
        );
  
      if (!existing) {
        res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
  
        return;
      }
  
      const {
        isActive,
      } = req.body;
  
      if (
        typeof isActive !==
        "boolean"
      ) {
        res.status(400).json({
          success: false,
          message:
            "isActive must be a boolean",
          error: {
            code:
              "VALIDATION_ERROR",
          },
        });
  
        return;
      }
  
      const product =
        await updateProductStatus(
          getParamId(req),
          isActive,
        );
  
      res.status(200).json({
        success: true,
        message:
          isActive
            ? "Product activated successfully"
            : "Product deactivated successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Internal helper
  |--------------------------------------------------------------------------
  */
  
  import {
    prisma,
  } from "../config/database.js";
  
  
  async function prismaProductBySku(
    sku: string,
  ) {
    return prisma.product.findUnique({
      where: {
        sku: sku.trim(),
      },
    });
  }