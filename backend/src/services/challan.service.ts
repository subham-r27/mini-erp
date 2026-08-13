import {
    prisma,
  } from "../config/database.js";
  
  
  type ChallanStatus =
    | "DRAFT"
    | "CONFIRMED"
    | "CANCELLED";
  
  
  interface ChallanItemInput {
    productId: string;
    quantity: number;
  }
  
  
  interface CreateChallanInput {
    customerId: string;
    createdById: string;
    notes?: string;
    items: ChallanItemInput[];
  }
  
  
  interface UpdateChallanInput {
    customerId?: string;
    notes?: string;
    items?: ChallanItemInput[];
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */
  
  function generateChallanNumber(): string {
    const now =
      new Date();
  
    const year =
      now.getFullYear();
  
    const month =
      String(
        now.getMonth() + 1,
      ).padStart(2, "0");
  
    const day =
      String(
        now.getDate(),
      ).padStart(2, "0");
  
    const random =
      Math.floor(
        1000 +
          Math.random() *
            9000,
      );
  
    return `CH-${year}${month}${day}-${random}`;
  }
  
  
  function validateItems(
    items: ChallanItemInput[],
  ): void {
    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      throw new Error(
        "CHALLAN_ITEMS_REQUIRED",
      );
    }
  
  
    for (
      const item of items
    ) {
      if (
        typeof item.productId !==
          "string" ||
        !item.productId.trim()
      ) {
        throw new Error(
          "INVALID_PRODUCT_ID",
        );
      }
  
  
      if (
        !Number.isInteger(
          item.quantity,
        ) ||
        item.quantity <= 0
      ) {
        throw new Error(
          "INVALID_QUANTITY",
        );
      }
    }
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Get Challan Details
  |--------------------------------------------------------------------------
  */
  
  export async function getChallanById(
    id: string,
  ) {
    const challan =
      await prisma.challan.findUnique({
        where: {
          id,
        },
  
        include: {
          customer: true,
  
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
  
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  category: true,
                  unitPrice: true,
                  currentStock: true,
                },
              },
            },
  
            orderBy: {
              createdAt: "asc",
            },
          },
  
          stockMovements: true,
  
          invoice: true,
        },
      });
  
  
    if (!challan) {
      throw new Error(
        "CHALLAN_NOT_FOUND",
      );
    }
  
  
    return challan;
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | List Challans
  |--------------------------------------------------------------------------
  */
  
  export async function listChallans(
    options: {
      page: number;
      limit: number;
      search?: string;
      status?: ChallanStatus;
      customerId?: string;
    },
  ) {
    const {
      page,
      limit,
      search,
      status,
      customerId,
    } = options;
  
  
    const skip =
      (page - 1) * limit;
  
  
    const where = {
      ...(status
        ? {
            status,
          }
        : {}),
  
      ...(customerId
        ? {
            customerId,
          }
        : {}),
  
      ...(search
        ? {
            OR: [
              {
                challanNumber: {
                  contains:
                    search,
  
                  mode:
                    "insensitive" as const,
                },
              },
  
              {
                customer: {
                  name: {
                    contains:
                      search,
  
                    mode:
                      "insensitive" as const,
                  },
                },
              },
  
              {
                customer: {
                  businessName: {
                    contains:
                      search,
  
                    mode:
                      "insensitive" as const,
                  },
                },
              },
            ],
          }
        : {}),
    };
  
  
    const [
      challans,
      total,
    ] = await Promise.all([
      prisma.challan.findMany({
        where,
  
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              businessName: true,
              mobile: true,
            },
          },
  
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
  
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              productNameSnapshot: true,
              skuSnapshot: true,
              unitPriceSnapshot: true,
            },
          },
        },
  
        orderBy: {
          createdAt: "desc",
        },
  
        skip,
  
        take: limit,
      }),
  
      prisma.challan.count({
        where,
      }),
    ]);
  
  
    return {
      challans,
  
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
  | Create Draft Challan
  |--------------------------------------------------------------------------
  */
  
  export async function createChallan(
    data: CreateChallanInput,
  ) {
    validateItems(
      data.items,
    );
  
  
    /*
    |--------------------------------------------------------------------------
    | Customer
    |--------------------------------------------------------------------------
    */
  
    const customer =
      await prisma.customer.findUnique({
        where: {
          id:
            data.customerId,
        },
      });
  
  
    if (!customer) {
      throw new Error(
        "CUSTOMER_NOT_FOUND",
      );
    }
  
  
    /*
    |--------------------------------------------------------------------------
    | Validate User
    |--------------------------------------------------------------------------
    */
  
    const user =
      await prisma.user.findUnique({
        where: {
          id:
            data.createdById,
        },
      });
  
  
    if (!user) {
      throw new Error(
        "USER_NOT_FOUND",
      );
    }
  
  
    /*
    |--------------------------------------------------------------------------
    | Validate Products + Build Snapshots
    |--------------------------------------------------------------------------
    */
  
    const productIds =
      data.items.map(
        (item) =>
          item.productId,
      );
  
  
    const uniqueProductIds =
      [
        ...new Set(
          productIds,
        ),
      ];
  
  
    const products =
      await prisma.product.findMany({
        where: {
          id: {
            in:
              uniqueProductIds,
          },
        },
      });
  
  
    if (
      products.length !==
      uniqueProductIds.length
    ) {
      throw new Error(
        "PRODUCT_NOT_FOUND",
      );
    }
  
  
    const productMap =
      new Map(
        products.map(
          (product) => [
            product.id,
            product,
          ],
        ),
      );
  
  
    /*
    |--------------------------------------------------------------------------
    | Total Quantity
    |--------------------------------------------------------------------------
    */
  
    const totalQuantity =
      data.items.reduce(
        (
          total,
          item,
        ) =>
          total +
          item.quantity,
  
        0,
      );
  
  
    /*
    |--------------------------------------------------------------------------
    | Create Challan + Items
    |--------------------------------------------------------------------------
    */
  
    const challan =
      await prisma.challan.create({
        data: {
          challanNumber:
            generateChallanNumber(),
  
          customerId:
            data.customerId,
  
          status:
            "DRAFT",
  
          totalQuantity,
  
          notes:
            data.notes?.trim() ||
            null,
  
          createdById:
            data.createdById,
  
          items: {
            create:
              data.items.map(
                (item) => {
                  const product =
                    productMap.get(
                      item.productId,
                    )!;
  
  
                  return {
                    productId:
                      product.id,
  
                    quantity:
                      item.quantity,
  
                    productNameSnapshot:
                      product.name,
  
                    skuSnapshot:
                      product.sku,
  
                    categorySnapshot:
                      product.category,
  
                    unitPriceSnapshot:
                      product.unitPrice,
                  };
                },
              ),
          },
        },
  
        include: {
          customer: true,
  
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
  
          items: true,
        },
      });
  
  
    return challan;
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Update Draft Challan
  |--------------------------------------------------------------------------
  */
  
  export async function updateChallan(
    id: string,
    data: UpdateChallanInput,
  ) {
    const existing =
      await prisma.challan.findUnique({
        where: {
          id,
        },
  
        include: {
          items: true,
        },
      });
  
  
    if (!existing) {
      throw new Error(
        "CHALLAN_NOT_FOUND",
      );
    }
  
  
    if (
      existing.status !==
      "DRAFT"
    ) {
      throw new Error(
        "CHALLAN_NOT_EDITABLE",
      );
    }
  
  
    if (
      data.customerId
    ) {
      const customer =
        await prisma.customer.findUnique({
          where: {
            id:
              data.customerId,
          },
        });
  
  
      if (!customer) {
        throw new Error(
          "CUSTOMER_NOT_FOUND",
        );
      }
    }
  
  
    if (data.items) {
      validateItems(
        data.items,
      );
    }
  
  
    /*
    |--------------------------------------------------------------------------
    | Update Only Basic Fields
    |--------------------------------------------------------------------------
    */
  
    if (!data.items) {
      return prisma.challan.update({
        where: {
          id,
        },
  
        data: {
          ...(data.customerId
            ? {
                customerId:
                  data.customerId,
              }
            : {}),
  
          ...(data.notes !==
          undefined
            ? {
                notes:
                  data.notes.trim() ||
                  null,
              }
            : {}),
        },
  
        include: {
          customer: true,
          items: true,
        },
      });
    }
  
  
    /*
    |--------------------------------------------------------------------------
    | Rebuild Items Transactionally
    |--------------------------------------------------------------------------
    */
  
    return prisma.$transaction(
      async (tx) => {
  
        const products =
          await tx.product.findMany({
            where: {
              id: {
                in:
                  [
                    ...new Set(
                      data.items!.map(
                        (item) =>
                          item.productId,
                      ),
                    ),
                  ],
              },
            },
          });
  
  
        if (
          products.length !==
          new Set(
            data.items!.map(
              (item) =>
                item.productId,
            ),
          ).size
        ) {
          throw new Error(
            "PRODUCT_NOT_FOUND",
          );
        }
  
  
        const productMap =
          new Map(
            products.map(
              (product) => [
                product.id,
                product,
              ],
            ),
          );
  
  
        const totalQuantity =
          data.items!.reduce(
            (
              total,
              item,
            ) =>
              total +
              item.quantity,
  
            0,
          );
  
  
        await tx.challanItem.deleteMany({
          where: {
            challanId:
              id,
          },
        });
  
  
        await tx.challanItem.createMany({
          data:
            data.items!.map(
              (item) => {
                const product =
                  productMap.get(
                    item.productId,
                  )!;
  
  
                return {
                  challanId:
                    id,
  
                  productId:
                    product.id,
  
                  quantity:
                    item.quantity,
  
                  productNameSnapshot:
                    product.name,
  
                  skuSnapshot:
                    product.sku,
  
                  categorySnapshot:
                    product.category,
  
                  unitPriceSnapshot:
                    product.unitPrice,
                };
              },
            ),
        });
  
  
        return tx.challan.update({
          where: {
            id,
          },
  
          data: {
            ...(data.customerId
              ? {
                  customerId:
                    data.customerId,
                }
              : {}),
  
            ...(data.notes !==
            undefined
              ? {
                  notes:
                    data.notes.trim() ||
                    null,
                }
              : {}),
  
            totalQuantity,
          },
  
          include: {
            customer: true,
            items: true,
          },
        });
      },
    );
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Confirm Challan
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | Stock changes + movement creation + status change
  | happen inside ONE transaction.
  |
  */
  
  export async function confirmChallan(
    id: string,
    confirmedById: string,
  ) {
    return prisma.$transaction(
      async (tx) => {
  
        const challan =
          await tx.challan.findUnique({
            where: {
              id,
            },
  
            include: {
              items: true,
            },
          });
  
  
        if (!challan) {
          throw new Error(
            "CHALLAN_NOT_FOUND",
          );
        }
  
  
        if (
          challan.status !==
          "DRAFT"
        ) {
          throw new Error(
            "CHALLAN_NOT_CONFIRMABLE",
          );
        }
  
  
        /*
        |--------------------------------------------------------------------------
        | Validate User
        |--------------------------------------------------------------------------
        */
  
        const user =
          await tx.user.findUnique({
            where: {
              id:
                confirmedById,
            },
          });
  
  
        if (!user) {
          throw new Error(
            "USER_NOT_FOUND",
          );
        }
  
  
        /*
        |--------------------------------------------------------------------------
        | Validate Every Product
        |--------------------------------------------------------------------------
        */
  
        const products =
          await tx.product.findMany({
            where: {
              id: {
                in:
                  challan.items.map(
                    (item) =>
                      item.productId,
                  ),
              },
            },
          });
  
  
        const productMap =
          new Map(
            products.map(
              (product) => [
                product.id,
                product,
              ],
            ),
          );
  
  
        /*
        |--------------------------------------------------------------------------
        | Stock Validation
        |--------------------------------------------------------------------------
        */
  
        for (
          const item of
          challan.items
        ) {
          const product =
            productMap.get(
              item.productId,
            );
  
  
          if (!product) {
            throw new Error(
              "PRODUCT_NOT_FOUND",
            );
          }
  
  
          if (
            !product.isActive
          ) {
            throw new Error(
              "PRODUCT_INACTIVE",
            );
          }
  
  
          const stock =
            Number(
              product.currentStock,
            );
  
  
          const quantity =
            Number(
              item.quantity,
            );
  
  
          if (
            stock <
            quantity
          ) {
            const error =
              new Error(
                "INSUFFICIENT_STOCK",
              );
  
            (
              error as Error & {
                productName?: string;
                available?: number;
                requested?: number;
              }
            ).productName =
              product.name;
  
            (
              error as Error & {
                available?: number;
              }
            ).available =
              stock;
  
            (
              error as Error & {
                requested?: number;
              }
            ).requested =
              quantity;
  
            throw error;
          }
        }
  
  
        /*
        |--------------------------------------------------------------------------
        | Reduce Stock + Create OUT Movement
        |--------------------------------------------------------------------------
        */
  
        for (
          const item of
          challan.items
        ) {
          const product =
            productMap.get(
              item.productId,
            )!;
  
  
          const quantity =
            Number(
              item.quantity,
            );
  
  
          const newStock =
            Number(
              product.currentStock,
            ) -
            quantity;
  
  
          await tx.product.update({
            where: {
              id:
                product.id,
            },
  
            data: {
              currentStock:
                newStock,
            },
          });
  
  
          await tx.stockMovement.create({
            data: {
              productId:
                product.id,
  
              createdById:
                confirmedById,
  
              type:
                "OUT",
  
              quantity,
  
              reason:
                `Sales challan ${challan.challanNumber}`,
  
              challanId:
                challan.id,
            },
          });
        }
  
  
        /*
        |--------------------------------------------------------------------------
        | Confirm Challan
        |--------------------------------------------------------------------------
        */
  
        return tx.challan.update({
          where: {
            id,
          },
  
          data: {
            status:
              "CONFIRMED",
  
            confirmedAt:
              new Date(),
          },
  
          include: {
            customer: true,
  
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
  
            items: true,
  
            stockMovements: true,
          },
        });
      },
    );
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Cancel Challan
  |--------------------------------------------------------------------------
  */
  
  export async function cancelChallan(
    id: string,
  ) {
    const challan =
      await prisma.challan.findUnique({
        where: {
          id,
        },
      });
  
  
    if (!challan) {
      throw new Error(
        "CHALLAN_NOT_FOUND",
      );
    }
  
  
    if (
      challan.status ===
      "CANCELLED"
    ) {
      throw new Error(
        "CHALLAN_ALREADY_CANCELLED",
      );
    }
  
  
    if (
      challan.status ===
      "CONFIRMED"
    ) {
      throw new Error(
        "CONFIRMED_CHALLAN_CANNOT_BE_CANCELLED",
      );
    }
  
  
    return prisma.challan.update({
      where: {
        id,
      },
  
      data: {
        status:
          "CANCELLED",
  
        cancelledAt:
          new Date(),
      },
  
      include: {
        customer: true,
        items: true,
      },
    });
  }