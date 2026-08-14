import {
    prisma,
  } from "../config/database.js";
  
  
  type InvoiceStatus =
    | "DRAFT"
    | "ISSUED"
    | "PAID"
    | "CANCELLED";
  
  
  interface InvoiceItemInput {
    productId: string;
    quantity: number;
    taxRate?: number;
  }
  
  
  interface CreateInvoiceInput {
    customerId: string;
    createdById: string;
    challanId?: string;
    invoiceDate?: string | Date;
    dueDate?: string | Date;
    notes?: string;
    items: InvoiceItemInput[];
  }
  
  
  interface UpdateInvoiceInput {
    customerId?: string;
    challanId?: string | null;
    invoiceDate?: string | Date;
    dueDate?: string | Date | null;
    notes?: string | null;
    items?: InvoiceItemInput[];
  }
  
  
  interface ListInvoiceOptions {
    page: number;
    limit: number;
    search?: string;
    status?: InvoiceStatus;
    customerId?: string;
  }
  
  
  const DEFAULT_TAX_RATE = 18;
  
  
  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */
  
  function generateInvoiceNumber(): string {
    const now = new Date();
  
    const year =
      now.getFullYear();
  
    const month =
      String(
        now.getMonth() + 1,
      ).padStart(2, "0");
  
    const random =
      Math.floor(
        1000 +
          Math.random() * 9000,
      );
  
    return `INV-${year}${month}-${random}`;
  }
  
  
  function toDate(
    value: string | Date | undefined | null,
  ): Date | undefined {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return undefined;
    }
  
    const date =
      value instanceof Date
        ? value
        : new Date(value);
  
    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      throw new Error(
        "INVALID_DATE",
      );
    }
  
    return date;
  }
  
  
  function validateItems(
    items: InvoiceItemInput[],
  ): void {
    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      throw new Error(
        "INVOICE_ITEMS_REQUIRED",
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
        typeof item.quantity !==
          "number" ||
        !Number.isFinite(
          item.quantity,
        ) ||
        item.quantity <= 0
      ) {
        throw new Error(
          "INVALID_QUANTITY",
        );
      }
  
      if (
        item.taxRate !==
          undefined &&
        (
          typeof item.taxRate !==
            "number" ||
          !Number.isFinite(
            item.taxRate,
          ) ||
          item.taxRate < 0 ||
          item.taxRate > 100
        )
      ) {
        throw new Error(
          "INVALID_TAX_RATE",
        );
      }
    }
  }
  
  
  function calculateLine(
    quantity: number,
    unitPrice: number,
    taxRate: number,
  ) {
    const base =
      quantity *
      unitPrice;
  
    const tax =
      base *
      (taxRate / 100);
  
    const total =
      base + tax;
  
    return {
      base,
      tax,
      total,
    };
  }
  
  
  function statusValue(
    value: InvoiceStatus,
  ): any {
    /*
     * Cast keeps this service compatible with
     * the generated Prisma enum while preserving
     * the actual persisted enum values.
     */
    return value as any;
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | GET INVOICE
  |--------------------------------------------------------------------------
  */
  
  export async function getInvoiceById(
    id: string,
  ) {
    const invoice =
      await prisma.invoice.findUnique({
        where: {
          id,
        },
  
        include: {
          customer: true,
  
          challan: true,
  
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
                },
              },
            },
  
            orderBy: {
              createdAt: "asc",
            },
          },
  
          stockMovements: true,
        },
      });
  
  
    if (!invoice) {
      throw new Error(
        "INVOICE_NOT_FOUND",
      );
    }
  
  
    return invoice;
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | LIST INVOICES
  |--------------------------------------------------------------------------
  */
  
  export async function listInvoices(
    options: ListInvoiceOptions,
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
  
  
    const where: any = {};
  
  
    if (status) {
      where.status =
        statusValue(status);
    }
  
  
    if (customerId) {
      where.customerId =
        customerId;
    }
  
  
    if (search) {
      where.OR = [
        {
          invoiceNumber: {
            contains:
              search,
  
            mode:
              "insensitive",
          },
        },
  
        {
          customer: {
            name: {
              contains:
                search,
  
              mode:
                "insensitive",
            },
          },
        },
  
        {
          customer: {
            businessName: {
              contains:
                search,
  
              mode:
                "insensitive",
            },
          },
        },
      ];
    }
  
  
    const [
      invoices,
      total,
    ] = await Promise.all([
      prisma.invoice.findMany({
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
              taxRate: true,
              taxAmount: true,
              lineTotal: true,
            },
          },
        },
  
        orderBy: {
          createdAt: "desc",
        },
  
        skip,
  
        take: limit,
      }),
  
      prisma.invoice.count({
        where,
      }),
    ]);
  
  
    return {
      invoices,
  
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
  | CREATE INVOICE
  |--------------------------------------------------------------------------
  */
  
  export async function createInvoice(
    data: CreateInvoiceInput,
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
    | User
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
    | Optional Challan
    |--------------------------------------------------------------------------
    */
  
    if (data.challanId) {
      const challan =
        await prisma.challan.findUnique({
          where: {
            id:
              data.challanId,
          },
        });
  
  
      if (!challan) {
        throw new Error(
          "CHALLAN_NOT_FOUND",
        );
      }
  
  
      if (
        challan.status !==
        "CONFIRMED"
      ) {
        throw new Error(
          "CHALLAN_NOT_CONFIRMED",
        );
      }
    }
  
  
    /*
    |--------------------------------------------------------------------------
    | Products
    |--------------------------------------------------------------------------
    */
  
    const productIds =
      [
        ...new Set(
          data.items.map(
            (item) =>
              item.productId,
          ),
        ),
      ];
  
  
    const products =
      await prisma.product.findMany({
        where: {
          id: {
            in:
              productIds,
          },
        },
      });
  
  
    if (
      products.length !==
      productIds.length
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
    | Calculate Totals
    |--------------------------------------------------------------------------
    */
  
    let subtotal = 0;
    let taxAmount = 0;
    let totalAmount = 0;
  
  
    const invoiceItems =
      data.items.map(
        (item) => {
          const product =
            productMap.get(
              item.productId,
            )!;
  
  
          const taxRate =
            item.taxRate ??
            DEFAULT_TAX_RATE;
  
  
          const line =
            calculateLine(
              item.quantity,
              Number(
                product.unitPrice,
              ),
              taxRate,
            );
  
  
          subtotal +=
            line.base;
  
          taxAmount +=
            line.tax;
  
          totalAmount +=
            line.total;
  
  
          return {
            productId:
              product.id,
  
            quantity:
              item.quantity,
  
            productNameSnapshot:
              product.name,
  
            skuSnapshot:
              product.sku,
  
            unitPriceSnapshot:
              product.unitPrice,
  
            taxRate,
  
            taxAmount:
              line.tax,
  
            lineTotal:
              line.total,
          };
        },
      );
  
  
    const invoiceDate =
      toDate(
        data.invoiceDate,
      ) ??
      new Date();
  
  
    const dueDate =
      toDate(
        data.dueDate,
      );
  
  
    /*
    |--------------------------------------------------------------------------
    | Create Invoice
    |--------------------------------------------------------------------------
    */
  
    const invoice =
      await prisma.invoice.create({
        data: {
          invoiceNumber:
            generateInvoiceNumber(),
  
          customerId:
            data.customerId,
  
          challanId:
            data.challanId ??
            null,
  
          status:
            statusValue(
              "DRAFT",
            ),
  
          invoiceDate,
  
          dueDate:
            dueDate ??
            null,
  
          subtotal,
  
          taxAmount,
  
          totalAmount,
  
          notes:
            data.notes?.trim() ||
            null,
  
          createdById:
            data.createdById,
  
          items: {
            create:
              invoiceItems,
          },
        },
  
        include: {
          customer: true,
  
          items: true,
        },
      });
  
  
    return invoice;
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | UPDATE DRAFT INVOICE
  |--------------------------------------------------------------------------
  */
  
  export async function updateInvoice(
    id: string,
    data: UpdateInvoiceInput,
  ) {
    const existing =
      await prisma.invoice.findUnique({
        where: {
          id,
        },
  
        include: {
          items: true,
        },
      });
  
  
    if (!existing) {
      throw new Error(
        "INVOICE_NOT_FOUND",
      );
    }
  
  
    if (
      existing.status !==
      statusValue("DRAFT")
    ) {
      throw new Error(
        "INVOICE_NOT_EDITABLE",
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
    | No Item Changes
    |--------------------------------------------------------------------------
    */
  
    if (!data.items) {
      return prisma.invoice.update({
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
  
          ...(data.challanId !==
          undefined
            ? {
                challanId:
                  data.challanId,
              }
            : {}),
  
          ...(data.invoiceDate !==
          undefined
            ? {
                invoiceDate:
                  toDate(
                    data.invoiceDate,
                  ),
              }
            : {}),
  
          ...(data.dueDate !==
          undefined
            ? {
                dueDate:
                  toDate(
                    data.dueDate,
                  ) ??
                  null,
              }
            : {}),
  
          ...(data.notes !==
          undefined
            ? {
                notes:
                  data.notes?.trim() ||
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
    | Recalculate Items
    |--------------------------------------------------------------------------
    */
  
    const productIds =
      [
        ...new Set(
          data.items.map(
            (item) =>
              item.productId,
          ),
        ),
      ];
  
  
    const products =
      await prisma.product.findMany({
        where: {
          id: {
            in:
              productIds,
          },
        },
      });
  
  
    if (
      products.length !==
      productIds.length
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
  
  
    let subtotal = 0;
    let taxAmount = 0;
    let totalAmount = 0;
  
  
    const items =
      data.items.map(
        (item) => {
          const product =
            productMap.get(
              item.productId,
            )!;
  
  
          const taxRate =
            item.taxRate ??
            DEFAULT_TAX_RATE;
  
  
          const line =
            calculateLine(
              item.quantity,
              Number(
                product.unitPrice,
              ),
              taxRate,
            );
  
  
          subtotal +=
            line.base;
  
          taxAmount +=
            line.tax;
  
          totalAmount +=
            line.total;
  
  
          return {
            productId:
              product.id,
  
            quantity:
              item.quantity,
  
            productNameSnapshot:
              product.name,
  
            skuSnapshot:
              product.sku,
  
            unitPriceSnapshot:
              product.unitPrice,
  
            taxRate,
  
            taxAmount:
              line.tax,
  
            lineTotal:
              line.total,
          };
        },
      );
  
  
    /*
    |--------------------------------------------------------------------------
    | Transaction
    |--------------------------------------------------------------------------
    */
  
    return prisma.$transaction(
      async (tx) => {
  
        await tx.invoiceItem.deleteMany({
          where: {
            invoiceId:
              id,
          },
        });
  
  
        await tx.invoiceItem.createMany({
          data:
            items.map(
              (item) => ({
                invoiceId:
                  id,
  
                ...item,
              }),
            ),
        });
  
  
        return tx.invoice.update({
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
  
            ...(data.challanId !==
            undefined
              ? {
                  challanId:
                    data.challanId,
                }
              : {}),
  
            ...(data.invoiceDate !==
            undefined
              ? {
                  invoiceDate:
                    toDate(
                      data.invoiceDate,
                    ),
                }
              : {}),
  
            ...(data.dueDate !==
            undefined
              ? {
                  dueDate:
                    toDate(
                      data.dueDate,
                    ) ??
                    null,
                }
              : {}),
  
            ...(data.notes !==
            undefined
              ? {
                  notes:
                    data.notes?.trim() ||
                    null,
                }
              : {}),
  
            subtotal,
            taxAmount,
            totalAmount,
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
  | ISSUE INVOICE
  |--------------------------------------------------------------------------
  */
  
  export async function issueInvoice(
    id: string,
  ) {
    const invoice =
      await prisma.invoice.findUnique({
        where: {
          id,
        },
      });
  
  
    if (!invoice) {
      throw new Error(
        "INVOICE_NOT_FOUND",
      );
    }
  
  
    if (
      invoice.status !==
      statusValue("DRAFT")
    ) {
      throw new Error(
        "INVOICE_NOT_ISSUABLE",
      );
    }
  
  
    return prisma.invoice.update({
      where: {
        id,
      },
  
      data: {
        status:
          statusValue(
            "ISSUED",
          ),
      },
  
      include: {
        customer: true,
        items: true,
      },
    });
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | MARK PAID
  |--------------------------------------------------------------------------
  */
  
  export async function markInvoicePaid(
    id: string,
  ) {
    const invoice =
      await prisma.invoice.findUnique({
        where: {
          id,
        },
      });
  
  
    if (!invoice) {
      throw new Error(
        "INVOICE_NOT_FOUND",
      );
    }
  
  
    if (
      invoice.status !==
      statusValue("ISSUED")
    ) {
      throw new Error(
        "INVOICE_NOT_PAYABLE",
      );
    }
  
  
    return prisma.invoice.update({
      where: {
        id,
      },
  
      data: {
        status:
          statusValue(
            "PAID",
          ),
  
        paidAt:
          new Date(),
      },
  
      include: {
        customer: true,
        items: true,
      },
    });
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | CANCEL
  |--------------------------------------------------------------------------
  */
  
  export async function cancelInvoice(
    id: string,
  ) {
    const invoice =
      await prisma.invoice.findUnique({
        where: {
          id,
        },
      });
  
  
    if (!invoice) {
      throw new Error(
        "INVOICE_NOT_FOUND",
      );
    }
  
  
    if (
      invoice.status ===
      statusValue("PAID")
    ) {
      throw new Error(
        "PAID_INVOICE_CANNOT_BE_CANCELLED",
      );
    }
  
  
    if (
      invoice.status ===
      statusValue("CANCELLED")
    ) {
      throw new Error(
        "INVOICE_ALREADY_CANCELLED",
      );
    }
  
  
    return prisma.invoice.update({
      where: {
        id,
      },
  
      data: {
        status:
          statusValue(
            "CANCELLED",
          ),
      },
  
      include: {
        customer: true,
        items: true,
      },
    });
  }