import api from "./api";

import type {
  Challan,
} from "../types";

export const challanService = {
  async getChallans() {
    const response =
      await api.get<Challan[]>(
        "/challans",
      );

    return response.data;
  },

  async getChallan(id: string) {
    const response =
      await api.get<Challan>(
        `/challans/${id}`,
      );

    return response.data;
  },

  async createDraft(
    challan: Omit<
      Challan,
      "id"
    >,
  ) {
    const response =
      await api.post<Challan>(
        "/challans",
        challan,
      );

    return response.data;
  },

  async confirmChallan(
    id: string,
  ) {
    const response =
      await api.post<Challan>(
        `/challans/${id}/confirm`,
      );

    return response.data;
  },

  async cancelChallan(
    id: string,
  ) {
    const response =
      await api.post<Challan>(
        `/challans/${id}/cancel`,
      );

    return response.data;
  },
};