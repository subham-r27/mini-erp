import type {
  Challan,
  ChallanItem,
  Customer,
  FollowUp,
  Invoice,
  InvoiceItem,
  Product,
  StockMovement,
  User,
} from "../types";

function formatDate(value?: string | Date | null) {
  if (!value) {
    return undefined;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string | Date | null) {
  if (!value) {
    return "";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-IN");
}

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return 0;
}

export interface BackendCustomer {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  businessName: string;
  gstNumber?: string | null;
  customerType: Customer["customerType"];
  status: Customer["status"];
  address?: string | null;
  followUpDate?: string | Date | null;
  notes?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  followUps?: BackendFollowUp[];
}

export interface BackendFollowUp {
  id: string;
  customerId: string;
  note: string;
  followUpDate?: string | Date | null;
  createdAt?: string | Date;
  user?: {
    id: string;
    name: string;
  } | null;
}

export interface BackendProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: unknown;
  currentStock: unknown;
  minimumStock: unknown;
  location: string;
  description?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface BackendStockMovement {
  id: string;
  productId: string;
  quantity: unknown;
  type: "IN" | "OUT";
  reason: string;
  createdAt?: string | Date;
  product?: {
    id: string;
    name: string;
    sku: string;
  } | null;
  createdBy?: {
    id: string;
    name: string;
  } | null;
}

export interface BackendChallanItem {
  id: string;
  productId: string;
  quantity: unknown;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPriceSnapshot: unknown;
  categorySnapshot?: string | null;
}

export interface BackendChallan {
  id: string;
  challanNumber: string;
  customerId: string;
  status: Challan["status"];
  totalQuantity: unknown;
  notes?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  customer?: {
    id: string;
    name: string;
    businessName?: string | null;
  } | null;
  createdBy?: {
    id: string;
    name: string;
  } | null;
  items?: BackendChallanItem[];
}

export interface BackendInvoiceItem {
  id: string;
  productId: string;
  quantity: unknown;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPriceSnapshot: unknown;
  taxRate?: unknown;
  taxAmount?: unknown;
  lineTotal?: unknown;
}

export interface BackendInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  challanId?: string | null;
  status: Invoice["status"];
  invoiceDate?: string | Date;
  dueDate?: string | Date | null;
  subtotal: unknown;
  taxAmount: unknown;
  totalAmount: unknown;
  createdAt?: string | Date;
  customer?: {
    id: string;
    name: string;
    businessName?: string | null;
  } | null;
  createdBy?: {
    id: string;
    name: string;
  } | null;
  items?: BackendInvoiceItem[];
  challan?: {
    id: string;
    challanNumber: string;
  } | null;
}

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: User["role"];
  status: User["status"];
  createdAt?: string | Date;
}

export function mapFollowUp(
  followUp: BackendFollowUp,
): FollowUp {
  return {
    id: followUp.id,
    customerId: followUp.customerId,
    note: followUp.note,
    followUpDate:
      formatDate(followUp.followUpDate) ||
      formatDate(followUp.createdAt) ||
      "",
    createdBy: followUp.user?.name || "Unknown",
    createdAt: formatDateTime(followUp.createdAt),
  };
}

export function mapCustomer(
  customer: BackendCustomer,
): Customer {
  return {
    id: customer.id,
    customerName: customer.name,
    businessName: customer.businessName,
    mobile: customer.mobile,
    email: customer.email || "",
    gstNumber: customer.gstNumber || undefined,
    customerType: customer.customerType,
    status: customer.status,
    address: customer.address || "",
    followUpDate: formatDate(customer.followUpDate),
    notes: customer.notes || undefined,
    createdAt: formatDate(customer.createdAt),
    updatedAt: formatDate(customer.updatedAt),
    followUps: customer.followUps?.map(mapFollowUp),
  };
}

export function mapProduct(
  product: BackendProduct,
): Product {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    unitPrice: toNumber(product.unitPrice),
    currentStock: toNumber(product.currentStock),
    minimumStock: toNumber(product.minimumStock),
    warehouse: product.location,
    description: product.description || undefined,
    createdAt: formatDate(product.createdAt),
    updatedAt: formatDate(product.updatedAt),
  };
}

export function mapStockMovement(
  movement: BackendStockMovement,
): StockMovement {
  return {
    id: movement.id,
    productId: movement.productId,
    productName: movement.product?.name || "Unknown product",
    sku: movement.product?.sku || "",
    quantity: toNumber(movement.quantity),
    movementType: movement.type,
    reason: movement.reason,
    createdBy: movement.createdBy?.name || "Unknown",
    createdAt: formatDateTime(movement.createdAt),
  };
}

function mapChallanItem(
  item: BackendChallanItem,
): ChallanItem {
  const unitPrice = toNumber(item.unitPriceSnapshot);
  const quantity = toNumber(item.quantity);

  return {
    id: item.id,
    productId: item.productId,
    productName: item.productNameSnapshot,
    sku: item.skuSnapshot,
    unitPrice,
    quantity,
    lineTotal: unitPrice * quantity,
  };
}

export function mapChallan(
  challan: BackendChallan,
): Challan {
  const items = (challan.items || []).map(mapChallanItem);
  const subtotal = items.reduce(
    (sum, item) => sum + item.lineTotal,
    0,
  );
  const taxRate = 18;
  const taxAmount = subtotal * (taxRate / 100);

  return {
    id: challan.id,
    challanNumber: challan.challanNumber,
    customerId: challan.customerId,
    customerName:
      challan.customer?.name || "Unknown customer",
    businessName:
      challan.customer?.businessName || undefined,
    items,
    totalQuantity: toNumber(challan.totalQuantity),
    subtotal,
    taxRate,
    taxAmount,
    grandTotal: subtotal + taxAmount,
    status: challan.status,
    createdBy: challan.createdBy?.name || "Unknown",
    createdAt:
      formatDate(challan.createdAt) ||
      formatDateTime(challan.createdAt),
    updatedAt: formatDate(challan.updatedAt),
  };
}

function mapInvoiceItem(
  item: BackendInvoiceItem,
): InvoiceItem {
  const unitPrice = toNumber(item.unitPriceSnapshot);
  const quantity = toNumber(item.quantity);

  return {
    id: item.id,
    productId: item.productId,
    productName: item.productNameSnapshot,
    sku: item.skuSnapshot,
    unitPrice,
    quantity,
    lineTotal: toNumber(item.lineTotal) || unitPrice * quantity,
  };
}

export function mapInvoice(
  invoice: BackendInvoice,
): Invoice {
  const items = (invoice.items || []).map(mapInvoiceItem);
  const subtotal = toNumber(invoice.subtotal);
  const taxAmount = toNumber(invoice.taxAmount);
  const grandTotal = toNumber(invoice.totalAmount);
  const taxRate =
    subtotal > 0
      ? Math.round((taxAmount / subtotal) * 100)
      : 18;

  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    challanId: invoice.challanId || "",
    challanNumber: invoice.challan?.challanNumber || "",
    customerId: invoice.customerId,
    customerName:
      invoice.customer?.name || "Unknown customer",
    businessName:
      invoice.customer?.businessName || undefined,
    items,
    subtotal,
    taxRate,
    taxAmount,
    grandTotal,
    status: invoice.status,
    createdBy: invoice.createdBy?.name || "Unknown",
    createdAt:
      formatDate(invoice.invoiceDate || invoice.createdAt) ||
      formatDateTime(invoice.createdAt),
    dueDate: formatDate(invoice.dueDate),
  };
}

export function mapUser(user: BackendUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt:
      formatDate(user.createdAt) ||
      formatDateTime(user.createdAt),
  };
}

export function customerToApiPayload(
  customer: Omit<
    Customer,
    "id" | "createdAt" | "updatedAt" | "followUps"
  >,
) {
  return {
    name: customer.customerName,
    mobile: customer.mobile,
    email: customer.email || undefined,
    businessName: customer.businessName,
    gstNumber: customer.gstNumber || undefined,
    customerType: customer.customerType,
    status: customer.status,
    address: customer.address || undefined,
    followUpDate: customer.followUpDate || undefined,
    notes: customer.notes || undefined,
  };
}

export function productToApiPayload(
  product: Omit<
    Product,
    "id" | "createdAt" | "updatedAt" | "currentStock"
  >,
) {
  return {
    name: product.name,
    sku: product.sku,
    category: product.category,
    unitPrice: product.unitPrice,
    minimumStock: product.minimumStock,
    location: product.warehouse,
    description: product.description || undefined,
  };
}
