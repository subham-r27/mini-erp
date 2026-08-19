import {
  getPaginated,
  post,
} from "./client";
import {
  mapProduct,
  mapStockMovement,
  type BackendProduct,
  type BackendStockMovement,
} from "./mappers";

import type {
  Product,
  StockMovementType,
} from "../types";

export interface InventoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  lowStock?: boolean;
}

export interface MovementListParams {
  page?: number;
  limit?: number;
  productId?: string;
  type?: StockMovementType;
}

export async function fetchInventoryProducts(
  params: InventoryListParams = {},
) {
  const result = await getPaginated<BackendProduct[]>(
    "/inventory",
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

export async function fetchStockMovements(
  params: MovementListParams = {},
) {
  const result =
    await getPaginated<BackendStockMovement[]>(
      "/inventory/movements",
      params,
    );

  return {
    movements: result.data.map(mapStockMovement),
    pagination: result.pagination,
  };
}

export async function createStockMovement(input: {
  productId: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
}) {
  const response = await post<{
    movement: BackendStockMovement;
    product: BackendProduct;
  }>("/inventory/movements", input);

  return {
    movement: mapStockMovement(response.movement),
    product: mapProduct(response.product),
  };
}

export async function fetchProductsForInventory(): Promise<
  Product[]
> {
  const { products } = await fetchInventoryProducts({
    page: 1,
    limit: 100,
  });

  return products;
}
