import {
    CustomerStatus,
    CustomerType,
  } from "../generated/prisma/client";
  
  import { prisma } from "../config/database.js";
  
  
  /*
  |--------------------------------------------------------------------------
  | Types
  |--------------------------------------------------------------------------
  */
  
  export interface CreateCustomerInput {
    name: string;
    mobile: string;
    email?: string;
    businessName: string;
    gstNumber?: string;
    customerType: CustomerType;
    status?: CustomerStatus;
    address?: string;
    followUpDate?: string;
    notes?: string;
    createdById: string;
  }
  
  
  export interface UpdateCustomerInput {
    name?: string;
    mobile?: string;
    email?: string;
    businessName?: string;
    gstNumber?: string;
    customerType?: CustomerType;
    status?: CustomerStatus;
    address?: string;
    followUpDate?: string | null;
    notes?: string;
    updatedById: string;
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | List Customers
  |--------------------------------------------------------------------------
  */
  
  export async function listCustomers(
    options: {
      page: number;
      limit: number;
      search?: string;
      status?: CustomerStatus;
      customerType?: CustomerType;
    },
  ) {
    const {
      page,
      limit,
      search,
      status,
      customerType,
    } = options;
  
    const skip =
      (page - 1) * limit;
  
    const where = {
      ...(status
        ? { status }
        : {}),
  
      ...(customerType
        ? { customerType }
        : {}),
  
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                mobile: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                businessName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                gstNumber: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };
  
    const [
      customers,
      total,
    ] = await Promise.all([
      prisma.customer.findMany({
        where,
  
        orderBy: {
          createdAt: "desc",
        },
  
        skip,
  
        take: limit,
      }),
  
      prisma.customer.count({
        where,
      }),
    ]);
  
    return {
      customers,
  
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
  | Get Customer
  |--------------------------------------------------------------------------
  */
  
  export async function getCustomerById(
    id: string,
  ) {
    return prisma.customer.findUnique({
      where: {
        id,
      },
  
      include: {
        followUps: {
          orderBy: {
            createdAt: "desc",
          },
  
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
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
      },
    });
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Create Customer
  |--------------------------------------------------------------------------
  */
  
  export async function createCustomer(
    data: CreateCustomerInput,
  ) {
    return prisma.customer.create({
      data: {
        name: data.name.trim(),
  
        mobile:
          data.mobile.trim(),
  
        email:
          data.email?.trim() ||
          null,
  
        businessName:
          data.businessName.trim(),
  
        gstNumber:
          data.gstNumber?.trim() ||
          null,
  
        customerType:
          data.customerType,
  
        status:
          data.status ??
          CustomerStatus.LEAD,
  
        address:
          data.address?.trim() ||
          null,
  
        followUpDate:
          data.followUpDate
            ? new Date(
                data.followUpDate,
              )
            : null,
  
        notes:
          data.notes?.trim() ||
          null,
  
        createdById:
          data.createdById,
      },
    });
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Update Customer
  |--------------------------------------------------------------------------
  */
  
  export async function updateCustomer(
    id: string,
    data: UpdateCustomerInput,
  ) {
    return prisma.customer.update({
      where: {
        id,
      },
  
      data: {
        ...(data.name !== undefined
          ? {
              name:
                data.name.trim(),
            }
          : {}),
  
        ...(data.mobile !== undefined
          ? {
              mobile:
                data.mobile.trim(),
            }
          : {}),
  
        ...(data.email !== undefined
          ? {
              email:
                data.email.trim() ||
                null,
            }
          : {}),
  
        ...(data.businessName !==
        undefined
          ? {
              businessName:
                data.businessName.trim(),
            }
          : {}),
  
        ...(data.gstNumber !==
        undefined
          ? {
              gstNumber:
                data.gstNumber.trim() ||
                null,
            }
          : {}),
  
        ...(data.customerType !==
        undefined
          ? {
              customerType:
                data.customerType,
            }
          : {}),
  
        ...(data.status !==
        undefined
          ? {
              status:
                data.status,
            }
          : {}),
  
        ...(data.address !==
        undefined
          ? {
              address:
                data.address?.trim() ||
                null,
            }
          : {}),
  
        ...(data.followUpDate !==
        undefined
          ? {
              followUpDate:
                data.followUpDate
                  ? new Date(
                      data.followUpDate,
                    )
                  : null,
            }
          : {}),
  
        ...(data.notes !== undefined
          ? {
              notes:
                data.notes?.trim() ||
                null,
            }
          : {}),
  
        updatedById:
          data.updatedById,
      },
    });
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Delete / Deactivate Customer
  |--------------------------------------------------------------------------
  */
  
  export async function deactivateCustomer(
    id: string,
    updatedById: string,
  ) {
    return prisma.customer.update({
      where: {
        id,
      },
  
      data: {
        status:
          CustomerStatus.INACTIVE,
  
        updatedById,
      },
    });
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Add Follow-up
  |--------------------------------------------------------------------------
  */
  
  export async function addCustomerFollowUp(
    customerId: string,
    userId: string,
    note: string,
    followUpDate?: string,
  ) {
    return prisma.customerFollowUp.create({
      data: {
        customerId,
  
        userId,
  
        note:
          note.trim(),
  
        followUpDate:
          followUpDate
            ? new Date(
                followUpDate,
              )
            : null,
      },
  
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
  
  
  /*
  |--------------------------------------------------------------------------
  | Follow-up History
  |--------------------------------------------------------------------------
  */
  
  export async function getCustomerFollowUps(
    customerId: string,
  ) {
    return prisma.customerFollowUp.findMany({
      where: {
        customerId,
      },
  
      orderBy: {
        createdAt: "desc",
      },
  
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }