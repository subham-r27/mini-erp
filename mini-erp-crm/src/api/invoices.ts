import {
  get,
  getPaginated,
} from "./client";
import {
  mapInvoice,
  type BackendInvoice,
} from "./mappers";

export interface InvoiceListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  customerId?: string;
}

export async function fetchInvoices(
  params: InvoiceListParams = {},
) {
  const result = await getPaginated<BackendInvoice[]>(
    "/invoices",
    params,
  );

  return {
    invoices: result.data.map(mapInvoice),
    pagination: result.pagination,
  };
}

export async function fetchInvoiceById(id: string) {
  const invoice = await get<BackendInvoice>(
    `/invoices/${id}`,
  );

  return mapInvoice(invoice);
}
