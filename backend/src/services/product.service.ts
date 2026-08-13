import { prisma } from "../config/database.js";


/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export interface CreateProductInput {
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  minimumStock: number;
  location: string;
  description?: string;
  imageUrl?: string;
}


export interface UpdateProductInput {
  name?: string;
  sku?: string;
  category?: string;
  unitPrice?: number;
  minimumStock?: number;
  location?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}


/*
|--------------------------------------------------------------------------
| List Products
|--------------------------------------------------------------------------
*/

export async function listProducts(
  options: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    location?: string;
    isActive?: boolean;
    lowStock?: boolean;
  },
) {
  const {
    page,
    limit,
    search,
    category,
    location,
    isActive,
    lowStock,
  } = options;


  const skip =
    (page - 1) * limit;


  /*
  |--------------------------------------------------------------------------
  | Base Filters
  |--------------------------------------------------------------------------
  */

  const baseWhere = {
    ...(category
      ? {
          category,
        }
      : {}),

    ...(location
      ? {
          location,
        }
      : {}),

    ...(isActive !== undefined
      ? {
          isActive,
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
  |
  | Low-stock filtering is handled after retrieval because
  | currentStock and minimumStock are two separate database
  | columns.
  |
  */

  let products =
    await prisma.product.findMany({
      where: baseWhere,

      orderBy: {
        createdAt:
          "desc",
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
| Get Product By ID
|--------------------------------------------------------------------------
*/

export async function getProductById(
  id: string,
) {
  return prisma.product.findUnique({
    where: {
      id,
    },
  });
}


/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export async function createProduct(
  data: CreateProductInput,
) {
  return prisma.product.create({
    data: {
      name:
        data.name.trim(),

      sku:
        data.sku.trim(),

      category:
        data.category.trim(),

      unitPrice:
        data.unitPrice,

      minimumStock:
        data.minimumStock,

      location:
        data.location.trim(),

      description:
        data.description?.trim() ||
        null,

      imageUrl:
        data.imageUrl?.trim() ||
        null,
    },
  });
}


/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export async function updateProduct(
  id: string,
  data: UpdateProductInput,
) {
  return prisma.product.update({
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

      ...(data.sku !== undefined
        ? {
            sku:
              data.sku.trim(),
          }
        : {}),

      ...(data.category !==
      undefined
        ? {
            category:
              data.category.trim(),
          }
        : {}),

      ...(data.unitPrice !==
      undefined
        ? {
            unitPrice:
              data.unitPrice,
          }
        : {}),

      ...(data.minimumStock !==
      undefined
        ? {
            minimumStock:
              data.minimumStock,
          }
        : {}),

      ...(data.location !==
      undefined
        ? {
            location:
              data.location.trim(),
          }
        : {}),

      ...(data.description !==
      undefined
        ? {
            description:
              data.description?.trim() ||
              null,
          }
        : {}),

      ...(data.imageUrl !==
      undefined
        ? {
            imageUrl:
              data.imageUrl?.trim() ||
              null,
          }
        : {}),

      ...(data.isActive !==
      undefined
        ? {
            isActive:
              data.isActive,
          }
        : {}),
    },
  });
}


/*
|--------------------------------------------------------------------------
| Activate / Deactivate Product
|--------------------------------------------------------------------------
*/

export async function updateProductStatus(
  id: string,
  isActive: boolean,
) {
  return prisma.product.update({
    where: {
      id,
    },

    data: {
      isActive,
    },
  });
}