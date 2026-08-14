import { prisma } from "../config/database.js";

export async function getDashboardSummary() {
  const [
    totalCustomers,
    totalProducts,
    activeProducts,
    lowStockProducts,
    totalChallans,
    draftChallans,
    confirmedChallans,
    cancelledChallans,
    totalInvoices,
    draftInvoices,
    issuedInvoices,
    paidInvoices,
    cancelledInvoices,
    salesAggregate,
    outstandingAggregate,
  ] = await Promise.all([
    prisma.customer.count(),

    prisma.product.count(),

    prisma.product.count({
      where: {
        isActive: true,
      },
    }),

    prisma.product.count({
      where: {
        isActive: true,

        currentStock: {
          lte: prisma.product.fields.minimumStock,
        },
      },
    }),

    prisma.challan.count(),

    prisma.challan.count({
      where: {
        status: "DRAFT",
      },
    }),

    prisma.challan.count({
      where: {
        status: "CONFIRMED",
      },
    }),

    prisma.challan.count({
      where: {
        status: "CANCELLED",
      },
    }),

    prisma.invoice.count(),

    prisma.invoice.count({
      where: {
        status: "DRAFT",
      },
    }),

    prisma.invoice.count({
      where: {
        status: "ISSUED",
      },
    }),

    prisma.invoice.count({
      where: {
        status: "PAID",
      },
    }),

    prisma.invoice.count({
      where: {
        status: "CANCELLED",
      },
    }),

    prisma.invoice.aggregate({
      where: {
        status: {
          in: [
            "ISSUED",
            "PAID",
          ],
        },
      },

      _sum: {
        totalAmount: true,
      },
    }),

    prisma.invoice.aggregate({
      where: {
        status: "ISSUED",
      },

      _sum: {
        totalAmount: true,
      },
    }),
  ]);

  return {
    customers: {
      total: totalCustomers,
    },

    products: {
      total: totalProducts,
      active: activeProducts,
      lowStock: lowStockProducts,
    },

    challans: {
      total: totalChallans,
      draft: draftChallans,
      confirmed: confirmedChallans,
      cancelled: cancelledChallans,
    },

    invoices: {
      total: totalInvoices,
      draft: draftInvoices,
      issued: issuedInvoices,
      paid: paidInvoices,
      cancelled: cancelledInvoices,
    },

    sales: {
      total:
        salesAggregate._sum.totalAmount ??
        0,

      outstanding:
        outstandingAggregate._sum.totalAmount ??
        0,
    },
  };
}
export async function getRecentChallans(
    limit = 5,
  ) {
    return prisma.challan.findMany({
      take: limit,
  
      orderBy: {
        createdAt: "desc",
      },
  
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            businessName: true,
          },
        },
  
        items: {
          select: {
            id: true,
            productNameSnapshot: true,
            quantity: true,
            unitPriceSnapshot: true,
          },
        },
      },
    });
  }
  export async function getRecentInvoices(
    limit = 5,
  ) {
    return prisma.invoice.findMany({
      take: limit,
  
      orderBy: {
        createdAt: "desc",
      },
  
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            businessName: true,
          },
        },
  
        items: {
          select: {
            id: true,
            productNameSnapshot: true,
            quantity: true,
            lineTotal: true,
          },
        },
      },
    });
  }
  export async function getLowStockProducts(
    limit = 10,
  ) {
    const products =
      await prisma.product.findMany({
        where: {
          isActive: true,
        },
  
        select: {
          id: true,
          name: true,
          sku: true,
          category: true,
          currentStock: true,
          minimumStock: true,
          location: true,
        },
  
        orderBy: {
          currentStock: "asc",
        },
      });
  
    const lowStock =
      products.filter(
        (product) =>
          Number(product.currentStock) <=
          Number(product.minimumStock),
      );
  
    return lowStock.slice(
      0,
      limit,
    );
  }