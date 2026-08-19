import { get } from "./client";
import {
  mapChallan,
  mapInvoice,
  mapProduct,
  type BackendChallan,
  type BackendInvoice,
  type BackendProduct,
} from "./mappers";

export interface DashboardSummary {
  customers: { total: number };
  products: {
    total: number;
    active: number;
    lowStock: number;
  };
  challans: {
    total: number;
    draft: number;
    confirmed: number;
    cancelled: number;
  };
  invoices: {
    total: number;
    draft: number;
    issued: number;
    paid: number;
    cancelled: number;
  };
  sales: {
    total: number;
    outstanding: number;
  };
}

export async function fetchDashboardSummary() {
  return get<DashboardSummary>("/dashboard/summary");
}

export async function fetchRecentChallans(limit = 5) {
  const challans = await get<BackendChallan[]>(
    "/dashboard/recent-challans",
    { limit },
  );

  return challans.map(mapChallan);
}

export async function fetchRecentInvoices(limit = 5) {
  const invoices = await get<BackendInvoice[]>(
    "/dashboard/recent-invoices",
    { limit },
  );

  return invoices.map(mapInvoice);
}

export async function fetchLowStockProducts(limit = 10) {
  const products = await get<BackendProduct[]>(
    "/dashboard/low-stock",
    { limit },
  );

  return products.map(mapProduct);
}
