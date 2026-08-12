export type UserRole =
  | "ADMIN"
  | "SALES"
  | "WAREHOUSE"
  | "ACCOUNTS";

export type UserStatus =
  | "ACTIVE"
  | "INACTIVE";

export type CustomerType =
  | "RETAIL"
  | "WHOLESALE"
  | "DISTRIBUTOR";

export type CustomerStatus =
  | "LEAD"
  | "ACTIVE"
  | "INACTIVE";

export type ChallanStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "CANCELLED";

export type StockMovementType =
  | "IN"
  | "OUT";

  export interface User {
    id: string;
  
    name: string;
    email: string;
    phone?: string;
  
    role: UserRole;
    status: UserStatus;
  
    avatar?: string;
  
    lastLogin?: string;
    createdAt: string;
  }

export interface FollowUp {
  id: string;
  customerId: string;
  note: string;
  followUpDate: string;
  createdBy: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  customerName: string;
  businessName: string;
  mobile: string;
  email: string;
  gstNumber?: string;
  customerType: CustomerType;
  status: CustomerStatus;
  address: string;
  followUpDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  followUps?: FollowUp[];
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    unitPrice: number;
    currentStock: number;
    minimumStock: number;
    warehouse: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface StockMovement {
    id: string;
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    movementType: StockMovementType;
    reason: string;
    createdBy: string;
    createdAt: string;
  }

  export interface ChallanItem {
    id: string;
    productId: string;
  
    // Snapshot data
    productName: string;
    sku: string;
    unitPrice: number;
  
    quantity: number;
  
    lineTotal: number;
  }
  
  export interface Challan {
    id: string;
    challanNumber: string;
  
    customerId: string;
    customerName: string;
    businessName?: string;
  
    items: ChallanItem[];
  
    totalQuantity: number;
  
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    grandTotal: number;
  
    status: ChallanStatus;
  
    createdBy: string;
    createdAt: string;
    updatedAt?: string;
  }

  export type InvoiceStatus =
  | "DRAFT"
  | "ISSUED"
  | "PAID"
  | "CANCELLED";

export interface InvoiceItem {
  id: string;

  productId: string;
  productName: string;
  sku: string;

  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;

  challanId: string;
  challanNumber: string;

  customerId: string;
  customerName: string;
  businessName?: string;

  items: InvoiceItem[];

  subtotal: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;

  status: InvoiceStatus;

  createdBy: string;
  createdAt: string;

  dueDate?: string;
}