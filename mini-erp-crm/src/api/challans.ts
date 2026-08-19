import {
  get,
  getPaginated,
  post,
} from "./client";
import {
  mapChallan,
  type BackendChallan,
} from "./mappers";

import type { Challan } from "../types";

export interface ChallanListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  customerId?: string;
}

export async function fetchChallans(
  params: ChallanListParams = {},
) {
  const result = await getPaginated<BackendChallan[]>(
    "/challans",
    params,
  );

  return {
    challans: result.data.map(mapChallan),
    pagination: result.pagination,
  };
}

export async function fetchChallanById(id: string) {
  const challan = await get<BackendChallan>(
    `/challans/${id}`,
  );

  return mapChallan(challan);
}

export async function createChallan(input: {
  customerId: string;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}) {
  const challan = await post<BackendChallan>(
    "/challans",
    input,
  );

  return mapChallan(challan);
}

export async function confirmChallan(id: string) {
  const challan = await post<BackendChallan>(
    `/challans/${id}/confirm`,
  );

  return mapChallan(challan);
}

export async function cancelChallan(id: string) {
  const challan = await post<BackendChallan>(
    `/challans/${id}/cancel`,
  );

  return mapChallan(challan);
}

export function challanFormToApiItems(
  challan: Challan,
) {
  return challan.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
}
