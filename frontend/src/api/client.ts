const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T;
  pagination: PaginationMeta;
}

export interface ApiError {
  success?: boolean;
  message?: string;
  error?: {
    code?: string;
    [key: string]: unknown;
  };
}

export class ApiRequestError extends Error {
  status: number;
  details?: ApiError;

  constructor(
    message: string,
    status: number,
    details?: ApiError,
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export type QueryParams = object;

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null =
  null;

export function setUnauthorizedHandler(
  handler: UnauthorizedHandler,
) {
  unauthorizedHandler = handler;
}

function buildQueryString(
  params?: QueryParams,
): string {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

async function parseResponseBody<T>(
  response: Response,
): Promise<ApiResponse<T> | ApiError | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const result =
    await apiRequestRaw<T>(endpoint, options);

  return result.data;
}

export async function apiRequestRaw<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<PaginatedResult<T>> {
  const {
    auth = true,
    headers,
    ...requestOptions
  } = options;

  const token = localStorage.getItem("erp_access_token");

  const requestHeaders = new Headers(headers);

  if (!(requestOptions.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth && token) {
    requestHeaders.set(
      "Authorization",
      `Bearer ${token}`,
    );
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...requestOptions,
      headers: requestHeaders,
    });
  } catch {
    throw new ApiRequestError(
      "Unable to reach the server. Please check your connection.",
      0,
    );
  }

  const body = await parseResponseBody<T>(response);

  if (!response.ok) {
    const errorBody = body as ApiError | null;

    if (response.status === 401) {
      clearAccessToken();
      unauthorizedHandler?.();
    }

    throw new ApiRequestError(
      errorBody?.message ||
        `Request failed with status ${response.status}`,
      response.status,
      errorBody || undefined,
    );
  }

  if (body && "data" in body) {
    return {
      data: body.data,
      pagination: body.pagination ?? {
        page: 1,
        limit: 0,
        total: Array.isArray(body.data)
          ? body.data.length
          : 1,
        totalPages: 1,
      },
    };
  }

  return {
    data: body as T,
    pagination: {
      page: 1,
      limit: 0,
      total: 1,
      totalPages: 1,
    },
  };
}

export function get<T>(
  endpoint: string,
  params?: QueryParams,
  options?: Omit<RequestOptions, "method">,
) {
  return apiRequest<T>(
    `${endpoint}${buildQueryString(params)}`,
    {
      method: "GET",
      ...options,
    },
  );
}

export function getPaginated<T>(
  endpoint: string,
  params?: QueryParams,
  options?: Omit<RequestOptions, "method">,
) {
  return apiRequestRaw<T>(
    `${endpoint}${buildQueryString(params)}`,
    {
      method: "GET",
      ...options,
    },
  );
}

export function post<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">,
) {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body:
      body === undefined
        ? undefined
        : JSON.stringify(body),
    ...options,
  });
}

export function put<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">,
) {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body:
      body === undefined
        ? undefined
        : JSON.stringify(body),
    ...options,
  });
}

export function patch<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">,
) {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    body:
      body === undefined
        ? undefined
        : JSON.stringify(body),
    ...options,
  });
}

export function del<T>(
  endpoint: string,
  options?: Omit<RequestOptions, "method">,
) {
  return apiRequest<T>(endpoint, {
    method: "DELETE",
    ...options,
  });
}

export function setAccessToken(token: string) {
  localStorage.setItem("erp_access_token", token);
}

export function getAccessToken() {
  return localStorage.getItem("erp_access_token");
}

export function clearAccessToken() {
  localStorage.removeItem("erp_access_token");
}

export { API_BASE_URL };
