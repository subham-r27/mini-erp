import type {
    UserRole,
  } from "../types";
  
  export type Permission =
    | "VIEW_DASHBOARD"
    | "MANAGE_USERS"
    | "VIEW_CUSTOMERS"
    | "MANAGE_CUSTOMERS"
    | "VIEW_PRODUCTS"
    | "MANAGE_PRODUCTS"
    | "VIEW_INVENTORY"
    | "MANAGE_INVENTORY"
    | "VIEW_CHALLANS"
    | "MANAGE_CHALLANS"
    | "VIEW_INVOICES"
    | "MANAGE_INVOICES"
    | "MANAGE_SETTINGS";
  
  const rolePermissions: Record<
    UserRole,
    Permission[]
  > = {
    ADMIN: [
      "VIEW_DASHBOARD",
      "MANAGE_USERS",
  
      "VIEW_CUSTOMERS",
      "MANAGE_CUSTOMERS",
  
      "VIEW_PRODUCTS",
      "MANAGE_PRODUCTS",
  
      "VIEW_INVENTORY",
      "MANAGE_INVENTORY",
  
      "VIEW_CHALLANS",
      "MANAGE_CHALLANS",
  
      "VIEW_INVOICES",
      "MANAGE_INVOICES",
  
      "MANAGE_SETTINGS",
    ],
  
    SALES: [
      "VIEW_DASHBOARD",
  
      "VIEW_CUSTOMERS",
      "MANAGE_CUSTOMERS",
  
      "VIEW_PRODUCTS",
  
      "VIEW_INVENTORY",
  
      "VIEW_CHALLANS",
      "MANAGE_CHALLANS",
  
      "VIEW_INVOICES",
    ],
  
    WAREHOUSE: [
      "VIEW_DASHBOARD",
  
      "VIEW_PRODUCTS",
  
      "VIEW_INVENTORY",
      "MANAGE_INVENTORY",
  
      "VIEW_CHALLANS",
    ],
  
    ACCOUNTS: [
      "VIEW_DASHBOARD",
  
      "VIEW_CUSTOMERS",
  
      "VIEW_PRODUCTS",
  
      "VIEW_INVENTORY",
  
      "VIEW_CHALLANS",
  
      "VIEW_INVOICES",
      "MANAGE_INVOICES",
    ],
  };
  
  export function hasPermission(
    role: UserRole,
    permission: Permission,
  ) {
    return rolePermissions[
      role
    ].includes(permission);
  }