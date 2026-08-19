import {
  get,
  getPaginated,
  post,
  put,
} from "./client";
import {
  mapProduct,
  productToApiPayload,
  type BackendProduct,
} from "./mappers";

import type { Product } from "../types";

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  location?: string;
  lowStock?: boolean;
}

export async function fetchProducts(
  params: ProductListParams = {},
) {
  const result = await getPaginated<BackendProduct[]>(
    "/products",
    {
      ...params,
      lowStock:
        params.lowStock === true
          ? "true"
          : undefined,
    },
  );

  return {
    products: result.data.map(mapProduct),
    pagination: result.pagination,
  };
}

export async function fetchProductById(id: string) {
  const product = await get<BackendProduct>(
    `/products/${id}`,
  );

  return mapProduct(product);
}

export async function createProduct(
  data: Omit<
    Product,
    "id" | "createdAt" | "updatedAt" | "currentStock"
  >,
) {
  const product = await post<BackendProduct>(
    "/products",
    productToApiPayload(data),
  );

  return mapProduct(product);
}

export async function updateProduct(
  id: string,
  data: Omit<
    Product,
    "id" | "createdAt" | "updatedAt" | "currentStock"
  >,
) {
  const product = await put<BackendProduct>(
    `/products/${id}`,
    productToApiPayload(data),
  );

  return mapProduct(product);
}
