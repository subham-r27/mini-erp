import {
    prisma,
  } from "../config/database.js";
  
  
  /*
  |--------------------------------------------------------------------------
  | Types
  |--------------------------------------------------------------------------
  */
  
  export type InventoryMovementType =
    "IN" |
    "OUT";
  
  
    export interface CreateMovementInput {
        productId: string;
        createdById: string;
        type: InventoryMovementType;
        quantity: number;
        reason: string;
      }
  
  
  /*
  |--------------------------------------------------------------------------
  | Inventory Overview
  |--------------------------------------------------------------------------
  */
  
  export async function getInventoryOverview(
    options: {
      page: number;
      limit: number;
      search?: string;
      location?: string;
      lowStock?: boolean;
    },
  ) {
    const {
      page,
      limit,
      search,
      location,
      lowStock,
    } = options;
  
  
    const skip =
      (page - 1) * limit;
  
  
    /*
    |--------------------------------------------------------------------------
    | Filters
    |--------------------------------------------------------------------------
    */
  
    const where = {
      isActive: true,
  
      ...(location
        ? {
            location,
          }
        : {}),
  
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains:
                    search,
  
                  mode:
                    "insensitive" as const,
                },
              },
  
              {
                sku: {
                  contains:
                    search,
  
                  mode:
                    "insensitive" as const,
                },
              },
  
              {
                category: {
                  contains:
                    search,
  
                  mode:
                    "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };
  
  
    /*
    |--------------------------------------------------------------------------
    | Fetch Products
    |--------------------------------------------------------------------------
    */
  
    let products =
      await prisma.product.findMany({
        where,
  
        orderBy: {
          name: "asc",
        },
      });
  
  
    /*
    |--------------------------------------------------------------------------
    | Low Stock Filter
    |--------------------------------------------------------------------------
    */
  
    if (lowStock) {
      products =
        products.filter(
          (product) =>
            Number(
              product.currentStock,
            ) <=
            Number(
              product.minimumStock,
            ),
        );
    }
  
  
    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */
  
    const total =
      products.length;
  
  
    products =
      products.slice(
        skip,
        skip + limit,
      );
  
  
    return {
      products,
  
      pagination: {
        page,
        limit,
        total,
  
        totalPages:
          Math.ceil(
            total / limit,
          ),
      },
    };
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Get Stock Movements
  |--------------------------------------------------------------------------
  */
  
  export async function getStockMovements(
    options: {
      page: number;
      limit: number;
      productId?: string;
      type?: InventoryMovementType;
    },
  ) {
    const {
      page,
      limit,
      productId,
      type,
    } = options;
  
  
    const skip =
      (page - 1) * limit;
  
  
    /*
    |--------------------------------------------------------------------------
    | Filters
    |--------------------------------------------------------------------------
    */
  
    const where = {
      ...(productId
        ? {
            productId,
          }
        : {}),
  
      ...(type
        ? {
            type,
          }
        : {}),
    };
  
  
    /*
    |--------------------------------------------------------------------------
    | Fetch Movements + Count
    |--------------------------------------------------------------------------
    */
  
    const [
      movements,
      total,
    ] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
  
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              category: true,
            },
          },
        },
  
        orderBy: {
          createdAt:
            "desc",
        },
  
        skip,
  
        take: limit,
      }),
  
      prisma.stockMovement.count({
        where,
      }),
    ]);
  
  
    return {
      movements,
  
      pagination: {
        page,
        limit,
        total,
  
        totalPages:
          Math.ceil(
            total / limit,
          ),
      },
    };
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Product Movement History
  |--------------------------------------------------------------------------
  */
  
  export async function getProductMovements(
    productId: string,
  ) {
    return prisma.stockMovement.findMany({
      where: {
        productId,
      },
  
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            category: true,
          },
        },
      },
  
      orderBy: {
        createdAt:
          "desc",
      },
    });
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Create Stock Movement
  |--------------------------------------------------------------------------
  |
  | Product stock update and movement creation
  | happen inside ONE database transaction.
  |
  */
  
  export async function createStockMovement(
    data: CreateMovementInput,
  ) {
    /*
    |--------------------------------------------------------------------------
    | Validate Quantity
    |--------------------------------------------------------------------------
    */
  
    if (
      !Number.isInteger(
        data.quantity,
      ) ||
      data.quantity <= 0
    ) {
      throw new Error(
        "INVALID_QUANTITY",
      );
    }
  
  
    /*
    |--------------------------------------------------------------------------
    | Validate Reason
    |--------------------------------------------------------------------------
    */
  
    if (
      !data.reason.trim()
    ) {
      throw new Error(
        "INVALID_REASON",
      );
    }
  
  
    /*
    |--------------------------------------------------------------------------
    | Transaction
    |--------------------------------------------------------------------------
    */
  
    return prisma.$transaction(
      async (tx) => {
  
        /*
        |--------------------------------------------------------------------------
        | Find Product
        |--------------------------------------------------------------------------
        */
  
        const product =
          await tx.product.findUnique({
            where: {
              id:
                data.productId,
            },
          });
  
  
        if (!product) {
          throw new Error(
            "PRODUCT_NOT_FOUND",
          );
        }
  
  
        /*
        |--------------------------------------------------------------------------
        | Active Product Check
        |--------------------------------------------------------------------------
        */
  
        if (
          !product.isActive
        ) {
          throw new Error(
            "PRODUCT_INACTIVE",
          );
        }
  
  
        /*
        |--------------------------------------------------------------------------
        | Decimal → Number
        |--------------------------------------------------------------------------
        |
        | Your Prisma schema stores stock as Decimal.
        |
        */
  
        const currentStock =
          Number(
            product.currentStock,
          );
  
  
        /*
        |--------------------------------------------------------------------------
        | Calculate New Stock
        |--------------------------------------------------------------------------
        */
  
        let newStock =
          currentStock;
  
  
        /*
        |--------------------------------------------------------------------------
        | STOCK IN
        |--------------------------------------------------------------------------
        */
  
        if (
          data.type === "IN"
        ) {
          newStock =
            currentStock +
            data.quantity;
        }
  
  
        /*
        |--------------------------------------------------------------------------
        | STOCK OUT
        |--------------------------------------------------------------------------
        */
  
        if (
          data.type === "OUT"
        ) {
  
          if (
            currentStock <
            data.quantity
          ) {
            throw new Error(
              "INSUFFICIENT_STOCK",
            );
          }
  
  
          newStock =
            currentStock -
            data.quantity;
        }
  
  
        /*
        |--------------------------------------------------------------------------
        | Negative Stock Protection
        |--------------------------------------------------------------------------
        */
  
        if (
          newStock < 0
        ) {
          throw new Error(
            "NEGATIVE_STOCK",
          );
        }
  
  
        /*
        |--------------------------------------------------------------------------
        | Update Product Stock
        |--------------------------------------------------------------------------
        */
  
        const updatedProduct =
          await tx.product.update({
            where: {
              id:
                data.productId,
            },
  
            data: {
              currentStock:
                newStock,
            },
          });
  
  
        /*
        |--------------------------------------------------------------------------
        | Create Stock Movement
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | The current Prisma StockMovement model does not
        | contain userId or a User relation.
        |
        */
  
        const movement =
         await tx.stockMovement.create({
          data: {
      productId:
        data.productId,

      createdById:
        data.createdById,

      type:
        data.type,

      quantity:
        data.quantity,

      reason:
        data.reason.trim(),
    },
  
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  currentStock: true,
                },
              },
            },
          });
  
  
        /*
        |--------------------------------------------------------------------------
        | Return
        |--------------------------------------------------------------------------
        */
  
        return {
          movement,
  
          product:
            updatedProduct,
        };
      },
    );
  }