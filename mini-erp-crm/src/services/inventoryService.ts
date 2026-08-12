import api from "./api";

import type {
  StockMovement,
  StockMovementType,
} from "../types";

export const inventoryService = {
  async getMovements() {
    const response =
      await api.get<StockMovement[]>(
        "/inventory/movements",
      );

    return response.data;
  },

  async createMovement(data: {
    productId: string;
    movementType: StockMovementType;
    quantity: number;
    reason: string;
  }) {
    const response =
      await api.post<StockMovement>(
        "/inventory/movements",
        data,
      );

    return response.data;
  },
};