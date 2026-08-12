import api from "./api";

import type {
  Customer,
  FollowUp,
} from "../types";

export const customerService = {
  async getCustomers() {
    const response =
      await api.get<Customer[]>(
        "/customers",
      );

    return response.data;
  },

  async getCustomer(id: string) {
    const response =
      await api.get<Customer>(
        `/customers/${id}`,
      );

    return response.data;
  },

  async createCustomer(
    customer: Omit<
      Customer,
      "id" | "createdAt" | "updatedAt"
    >,
  ) {
    const response =
      await api.post<Customer>(
        "/customers",
        customer,
      );

    return response.data;
  },

  async updateCustomer(
    id: string,
    customer: Partial<Customer>,
  ) {
    const response =
      await api.put<Customer>(
        `/customers/${id}`,
        customer,
      );

    return response.data;
  },

  async getFollowUps(
    customerId: string,
  ) {
    const response =
      await api.get<FollowUp[]>(
        `/customers/${customerId}/follow-ups`,
      );

    return response.data;
  },

  async addFollowUp(
    customerId: string,
    data: {
      note: string;
      followUpDate: string;
    },
  ) {
    const response =
      await api.post<FollowUp>(
        `/customers/${customerId}/follow-ups`,
        data,
      );

    return response.data;
  },
};