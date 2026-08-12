import type {
    Challan,
    Customer,
    Product,
    Invoice,
    StockMovement,
    User,
  } from "../types";
  
  export const mockUser: User = {
    id: "USR-001",
    name: "Subham Rout",
    email: "subham@minierp.com",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2026-01-10",
    lastLogin: "2026-08-12 18:42",
  };
  
  export const customers: Customer[] = [
    {
      id: "CUS-001",
      customerName: "Rahul Sharma",
      businessName: "Rahul Traders",
      mobile: "+91 98765 43210",
      email: "rahul@rahultraders.com",
      gstNumber: "29ABCDE1234F1Z5",
      customerType: "WHOLESALE",
      status: "ACTIVE",
      address: "45, 1st Main Road, Indiranagar, Bengaluru",
      followUpDate: "2026-08-15",
      notes: "Regular wholesale customer. Prefers monthly billing.",
      createdAt: "2026-06-12",
      updatedAt: "2026-08-10",
      followUps: [
        {
          id: "FU-001",
          customerId: "CUS-001",
          note: "Discussed upcoming bulk order.",
          followUpDate: "2026-08-15",
          createdBy: "Arjun Mehta",
          createdAt: "2026-08-10 11:30",
        },
        {
          id: "FU-002",
          customerId: "CUS-001",
          note: "Quotation sent for computer accessories.",
          followUpDate: "2026-08-05",
          createdBy: "Rohit Verma",
          createdAt: "2026-08-05 15:20",
        },
      ],
    },
  
    {
      id: "CUS-002",
      customerName: "Priya Nair",
      businessName: "Nair Distributors",
      mobile: "+91 99887 66554",
      email: "priya@nairdistributors.com",
      gstNumber: "29FGHIJ5678K1Z3",
      customerType: "DISTRIBUTOR",
      status: "ACTIVE",
      address: "12, ITPL Main Road, Whitefield, Bengaluru",
      followUpDate: "2026-08-14",
      notes: "High-volume distributor.",
      createdAt: "2026-05-18",
      updatedAt: "2026-08-09",
      followUps: [
        {
          id: "FU-003",
          customerId: "CUS-002",
          note: "CONFIRMED requirement for monitors.",
          followUpDate: "2026-08-14",
          createdBy: "Arjun Mehta",
          createdAt: "2026-08-09 10:15",
        },
      ],
    },
  
    {
      id: "CUS-003",
      customerName: "Amit Kumar",
      businessName: "AK Retail",
      mobile: "+91 91234 56789",
      email: "amit@akretail.com",
      customerType: "RETAIL",
      status: "LEAD",
      address: "80, 5th Block, Koramangala, Bengaluru",
      followUpDate: "2026-08-13",
      notes: "Interested in computer accessories.",
      createdAt: "2026-08-01",
      updatedAt: "2026-08-11",
      followUps: [
        {
          id: "FU-004",
          customerId: "CUS-003",
          note: "Initial sales call completed.",
          followUpDate: "2026-08-13",
          createdBy: "Rohit Verma",
          createdAt: "2026-08-11 14:00",
        },
      ],
    },
  
    {
      id: "CUS-004",
      customerName: "Sneha Rao",
      businessName: "SR Enterprises",
      mobile: "+91 90000 12345",
      email: "sneha@srenterprises.com",
      gstNumber: "29LMNOP9012Q1Z7",
      customerType: "WHOLESALE",
      status: "INACTIVE",
      address: "21, 4th Cross, Jayanagar, Bengaluru",
      notes: "No recent transactions.",
      createdAt: "2026-03-22",
      updatedAt: "2026-07-20",
      followUps: [],
    },
  
    {
      id: "CUS-005",
      customerName: "Vikram Singh",
      businessName: "VS Enterprises",
      mobile: "+91 90123 45678",
      email: "vikram@vsenterprises.com",
      customerType: "WHOLESALE",
      status: "ACTIVE",
      address: "Electronic City, Bengaluru",
      followUpDate: "2026-08-18",
      notes: "Regular office equipment buyer.",
      createdAt: "2026-06-30",
      updatedAt: "2026-08-08",
      followUps: [],
    },
  
    {
      id: "CUS-006",
      customerName: "Neha Kapoor",
      businessName: "NK Retail",
      mobile: "+91 93456 78901",
      email: "neha@nkretail.com",
      customerType: "RETAIL",
      status: "LEAD",
      address: "HSR Layout, Bengaluru",
      followUpDate: "2026-08-20",
      notes: "New lead from website.",
      createdAt: "2026-08-05",
      updatedAt: "2026-08-05",
      followUps: [],
    },
  ];
  
  export const products: Product[] = [
    {
      id: "PRD-001",
      name: "Wireless Mouse",
      sku: "WM-1001",
      category: "Accessories",
      unitPrice: 799,
      currentStock: 7,
      minimumStock: 10,
      warehouse: "Bangalore Central",
      description:
        "Ergonomic wireless mouse with USB receiver.",
      createdAt: "2026-05-10",
      updatedAt: "2026-08-10",
    },
  
    {
      id: "PRD-002",
      name: "Mechanical Keyboard",
      sku: "KB-2001",
      category: "Accessories",
      unitPrice: 2499,
      currentStock: 35,
      minimumStock: 10,
      warehouse: "Bangalore Central",
      description:
        "Mechanical keyboard with RGB backlight.",
      createdAt: "2026-05-15",
      updatedAt: "2026-08-11",
    },
  
    {
      id: "PRD-003",
      name: "USB-C Hub",
      sku: "UCH-3001",
      category: "Accessories",
      unitPrice: 1499,
      currentStock: 3,
      minimumStock: 8,
      warehouse: "Bangalore East",
      description:
        "Multi-port USB-C hub with HDMI and USB 3.0.",
      createdAt: "2026-06-01",
      updatedAt: "2026-08-09",
    },
  
    {
      id: "PRD-004",
      name: "24-inch Monitor",
      sku: "MON-4001",
      category: "Monitors",
      unitPrice: 12999,
      currentStock: 18,
      minimumStock: 5,
      warehouse: "Bangalore Central",
      description:
        "Full HD IPS monitor.",
      createdAt: "2026-04-22",
      updatedAt: "2026-08-08",
    },
  
    {
      id: "PRD-005",
      name: "HDMI Cable",
      sku: "HDMI-5001",
      category: "Cables",
      unitPrice: 499,
      currentStock: 4,
      minimumStock: 10,
      warehouse: "Bangalore East",
      description:
        "High-speed HDMI cable.",
      createdAt: "2026-06-18",
      updatedAt: "2026-08-07",
    },
  
    {
      id: "PRD-006",
      name: "Laptop Stand",
      sku: "LS-6001",
      category: "Accessories",
      unitPrice: 1299,
      currentStock: 24,
      minimumStock: 8,
      warehouse: "Bangalore Central",
      description:
        "Adjustable aluminum laptop stand.",
      createdAt: "2026-07-01",
      updatedAt: "2026-08-05",
    },
  
    {
      id: "PRD-007",
      name: "Webcam",
      sku: "WC-7001",
      category: "Accessories",
      unitPrice: 1899,
      currentStock: 12,
      minimumStock: 5,
      warehouse: "Bangalore North",
      description:
        "1080p USB webcam with built-in microphone.",
      createdAt: "2026-07-12",
      updatedAt: "2026-08-06",
    },
  ];
  
  export const stockMovements: StockMovement[] = [
    {
      id: "MOV-001",
      productId: "PRD-001",
      productName: "Wireless Mouse",
      sku: "WM-1001",
      quantity: 20,
      movementType: "IN",
      reason: "New supplier shipment",
      createdBy: "Arjun Mehta",
      createdAt: "2026-08-10 10:30",
    },
  
    {
      id: "MOV-002",
      productId: "PRD-001",
      productName: "Wireless Mouse",
      sku: "WM-1001",
      quantity: 13,
      movementType: "OUT",
      reason: "Sales Challan SC-1024",
      createdBy: "Rohit Verma",
      createdAt: "2026-08-11 14:15",
    },
  
    {
      id: "MOV-003",
      productId: "PRD-002",
      productName: "Mechanical Keyboard",
      sku: "KB-2001",
      quantity: 30,
      movementType: "IN",
      reason: "Purchase order received",
      createdBy: "Arjun Mehta",
      createdAt: "2026-08-09 11:20",
    },
  
    {
      id: "MOV-004",
      productId: "PRD-003",
      productName: "USB-C Hub",
      sku: "UCH-3001",
      quantity: 5,
      movementType: "OUT",
      reason: "Sales Challan SC-1023",
      createdBy: "Rohit Verma",
      createdAt: "2026-08-09 16:45",
    },
  
    {
      id: "MOV-005",
      productId: "PRD-004",
      productName: "24-inch Monitor",
      sku: "MON-4001",
      quantity: 10,
      movementType: "IN",
      reason: "Supplier delivery",
      createdBy: "Arjun Mehta",
      createdAt: "2026-08-08 09:30",
    },
  
    {
      id: "MOV-006",
      productId: "PRD-005",
      productName: "HDMI Cable",
      sku: "HDMI-5001",
      quantity: 6,
      movementType: "OUT",
      reason: "Sales Challan SC-1022",
      createdBy: "Rohit Verma",
      createdAt: "2026-08-07 13:10",
    },
  ];
  
  export const challans: Challan[] = [
    {
      id: "CHL-001",
      challanNumber: "SC-2026-0001",
  
      customerId: "CUS-001",
      customerName: "Rajesh Kumar",
      businessName: "RK Electronics",
  
      items: [
        {
          id: "ITEM-001",
          productId: "PRD-001",
          productName: "Wireless Mouse",
          sku: "WM-1001",
          unitPrice: 799,
          quantity: 5,
          lineTotal: 3995,
        },
        {
          id: "ITEM-002",
          productId: "PRD-002",
          productName: "Mechanical Keyboard",
          sku: "KB-2001",
          unitPrice: 2499,
          quantity: 2,
          lineTotal: 4998,
        },
      ],
  
      totalQuantity: 7,
  
      subtotal: 8993,
      taxRate: 18,
      taxAmount: 1618.74,
      grandTotal: 10611.74,
  
      status: "CONFIRMED",
  
      createdBy: "Arjun Mehta",
      createdAt: "2026-08-10 11:30",
    },
  
    {
      id: "CHL-002",
      challanNumber: "SC-2026-0002",
  
      customerId: "CUS-002",
      customerName: "Priya Sharma",
      businessName: "PS Distributors",
  
      items: [
        {
          id: "ITEM-003",
          productId: "PRD-004",
          productName: "24-inch Monitor",
          sku: "MON-4001",
          unitPrice: 12999,
          quantity: 3,
          lineTotal: 38997,
        },
      ],
  
      totalQuantity: 3,
  
      subtotal: 38997,
      taxRate: 18,
      taxAmount: 7019.46,
      grandTotal: 46016.46,
  
      status: "DRAFT",
  
      createdBy: "Arjun Mehta",
      createdAt: "2026-08-11 15:20",
    },
  ];
  export const salesOverview = [
    {
      date: "Aug 01",
      sales: 42000,
      challans: 8,
    },
    {
      date: "Aug 03",
      sales: 38500,
      challans: 6,
    },
    {
      date: "Aug 05",
      sales: 52000,
      challans: 11,
    },
    {
      date: "Aug 07",
      sales: 47000,
      challans: 9,
    },
    {
      date: "Aug 09",
      sales: 61000,
      challans: 14,
    },
    {
      date: "Aug 11",
      sales: 73500,
      challans: 17,
    },
    {
      date: "Aug 12",
      sales: 68200,
      challans: 15,
    },
  ];
  
  export const recentActivities = [
    {
      id: "ACT-001",
      title: "Challan SC-1024 CONFIRMED",
      description: "Rahul Traders · ₹14,392",
      time: "12 minutes ago",
      type: "success",
    },
    {
      id: "ACT-002",
      title: "New customer added",
      description: "AK Retail",
      time: "42 minutes ago",
      type: "customer",
    },
    {
      id: "ACT-003",
      title: "Stock received",
      description: "Wireless Keyboard · +50 units",
      time: "1 hour ago",
      type: "inventory",
    },
    {
      id: "ACT-004",
      title: "Challan SC-1023 created",
      description: "Nair Distributors · DRAFT",
      time: "2 hours ago",
      type: "challan",
    },
    {
      id: "ACT-005",
      title: "Low stock detected",
      description: "USB-C Hub · 3 units remaining",
      time: "3 hours ago",
      type: "warning",
    },
  ];

  export const invoices: Invoice[] = [
    {
      id: "INV-001",
      invoiceNumber: "INV-2026-0001",
  
      challanId: "CHL-001",
      challanNumber: "SC-2026-0001",
  
      customerId: "CUS-001",
      customerName: "Rajesh Kumar",
      businessName: "RK Electronics",
  
      items: [
        {
          id: "INV-ITEM-001",
          productId: "PRD-001",
          productName: "Wireless Mouse",
          sku: "WM-1001",
          unitPrice: 799,
          quantity: 5,
          lineTotal: 3995,
        },
        {
          id: "INV-ITEM-002",
          productId: "PRD-002",
          productName: "Mechanical Keyboard",
          sku: "KB-2001",
          unitPrice: 2499,
          quantity: 2,
          lineTotal: 4998,
        },
      ],
  
      subtotal: 8993,
      taxRate: 18,
      taxAmount: 1618.74,
      grandTotal: 10611.74,
  
      status: "ISSUED",
  
      createdBy: "Arjun Mehta",
      createdAt: "2026-08-10 11:45",
  
      dueDate: "2026-09-09",
    },
  ];
  export const users: User[] = [
    {
      id: "USR-001",
      name: "Subham Rout",
      email: "subham@minierp.com",
      phone: "+91 98765 43210",
      role: "ADMIN",
      status: "ACTIVE",
      lastLogin: "2026-08-12 18:42",
      createdAt: "2026-01-10",
    },
  
    {
      id: "USR-002",
      name: "Rahul Sharma",
      email: "rahul@minierp.com",
      phone: "+91 98765 12345",
      role: "SALES",
      status: "ACTIVE",
      lastLogin: "2026-08-12 17:30",
      createdAt: "2026-02-14",
    },
  
    {
      id: "USR-003",
      name: "Arjun Kumar",
      email: "arjun@minierp.com",
      phone: "+91 98765 67890",
      role: "WAREHOUSE",
      status: "ACTIVE",
      lastLogin: "2026-08-12 16:12",
      createdAt: "2026-03-02",
    },
  
    {
      id: "USR-004",
      name: "Priya Singh",
      email: "priya@minierp.com",
      phone: "+91 98765 11111",
      role: "ACCOUNTS",
      status: "INACTIVE",
      lastLogin: "2026-08-09 10:24",
      createdAt: "2026-03-20",
    },
  ];