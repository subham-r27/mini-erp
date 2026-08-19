import {
  get,
  getPaginated,
  post,
  put,
} from "./client";
import {
  customerToApiPayload,
  mapCustomer,
  mapFollowUp,
  type BackendCustomer,
  type BackendFollowUp,
} from "./mappers";

import type { Customer } from "../types";

export interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  customerType?: string;
}

export async function fetchCustomers(
  params: CustomerListParams = {},
) {
  const result = await getPaginated<BackendCustomer[]>(
    "/customers",
    params,
  );

  return {
    customers: result.data.map(mapCustomer),
    pagination: result.pagination,
  };
}

export async function fetchCustomerById(id: string) {
  const customer = await get<BackendCustomer>(
    `/customers/${id}`,
  );

  return mapCustomer(customer);
}

export async function createCustomer(
  data: Omit<
    Customer,
    "id" | "createdAt" | "updatedAt" | "followUps"
  >,
) {
  const customer = await post<BackendCustomer>(
    "/customers",
    customerToApiPayload(data),
  );

  return mapCustomer(customer);
}

export async function updateCustomer(
  id: string,
  data: Omit<
    Customer,
    "id" | "createdAt" | "updatedAt" | "followUps"
  >,
) {
  const customer = await put<BackendCustomer>(
    `/customers/${id}`,
    customerToApiPayload(data),
  );

  return mapCustomer(customer);
}

export async function fetchCustomerFollowUps(
  customerId: string,
) {
  const followUps = await get<BackendFollowUp[]>(
    `/customers/${customerId}/follow-ups`,
  );

  return followUps.map(mapFollowUp);
}

export async function addCustomerFollowUp(
  customerId: string,
  note: string,
  followUpDate?: string,
) {
  const followUp = await post<BackendFollowUp>(
    `/customers/${customerId}/follow-ups`,
    {
      note,
      followUpDate: followUpDate || undefined,
    },
  );

  return mapFollowUp(followUp);
}
