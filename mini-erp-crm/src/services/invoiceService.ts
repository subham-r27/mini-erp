import api from "./api";

import type {
  Invoice,
} from "../types";

export const invoiceService = {
  async getInvoices() {
    const response =
      await api.get<Invoice[]>(
        "/invoices",
      );

    return response.data;
  },

  async getInvoice(id: string) {
    const response =
      await api.get<Invoice>(
        `/invoices/${id}`,
      );

    return response.data;
  },

  async generateFromChallan(
    challanId: string,
  ) {
    const response =
      await api.post<Invoice>(
        `/invoices/from-challan/${challanId}`,
      );

    return response.data;
  },

  async updateStatus(
    id: string,
    status: string,
  ) {
    const response =
      await api.patch<Invoice>(
        `/invoices/${id}/status`,
        {
          status,
        },
      );

    return response.data;
  },
};