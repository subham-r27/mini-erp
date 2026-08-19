import { getPaginated } from "./client";
import {
  mapUser,
  type BackendUser,
} from "./mappers";

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export async function fetchUsers(
  params: UserListParams = {},
) {
  const result = await getPaginated<BackendUser[]>(
    "/users",
    params,
  );

  return {
    users: result.data.map(mapUser),
    pagination: result.pagination,
  };
}
