import api from "./api";

import type {
  Product,
} from "../types";

export const productService = {
  async getProducts() {
    const response =
      await api.get<Product[]>(
        "/products",
      );

    return response.data;
  },

  async getProduct(id: string) {
    const response =
      await api.get<Product>(
        `/products/${id}`,
      );

    return response.data;
  },

  async createProduct(
    product: Omit<
      Product,
      "id" | "createdAt" | "updatedAt"
    >,
  ) {
    const response =
      await api.post<Product>(
        "/products",
        product,
      );

    return response.data;
  },

  async updateProduct(
    id: string,
    product: Partial<Product>,
  ) {
    const response =
      await api.put<Product>(
        `/products/${id}`,
        product,
      );

    return response.data;
  },
};