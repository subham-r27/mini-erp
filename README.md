# Mini ERP + CRM Operations Portal

## Full Stack Developer Case Study Documentation

**Project:** Mini ERP + CRM Operations Portal\
**Business Context:** Wholesale / Distribution Company\
**Purpose:** Internal ERP/CRM system for Sales, Warehouse, Accounts and
Administration teams.

------------------------------------------------------------------------

## 1. Project Overview

The Mini ERP + CRM Operations Portal is a small business operations
system designed for a wholesale/distribution company.

The system manages:

-   Customers
-   Products
-   Stock
-   Purchase orders
-   Sales challans
-   Invoices
-   CRM follow-ups
-   Internal users and roles

The objective is to demonstrate full-stack development capability
across:

-   Frontend development
-   Backend REST APIs
-   Database design
-   Authentication and authorization
-   Business logic
-   Validation and error handling
-   Deployment
-   Documentation
-   DevOps practices

The system is intentionally scoped as a practical ERP/CRM portal rather
than a large enterprise ERP.

------------------------------------------------------------------------

# 2. Required Technology Stack

## Backend

-   Node.js
-   TypeScript
-   Express.js or NestJS
-   PostgreSQL or MySQL
-   REST APIs
-   Input validation
-   Proper error handling

## Frontend

-   React
-   HTML
-   CSS
-   JavaScript / TypeScript
-   Responsive UI

## Deployment / DevOps

AWS deployment is preferred but optional.

The project must use:

-   Environment variables
-   Documented server setup
-   Documented local setup
-   Documented deployment process

The case study permits free hosting platforms for the deployment.

------------------------------------------------------------------------

# 3. System Architecture

The application follows a layered full-stack architecture.

``` text
┌─────────────────────────────────────────────┐
│                 React Frontend              │
│                                             │
│ Dashboard | CRM | Products | Inventory      │
│ Challans  | Invoices | Users | Settings     │
└──────────────────────┬──────────────────────┘
                       │
                       │ REST API / JSON
                       ▼
┌─────────────────────────────────────────────┐
│             Node.js + Express API           │
│                                             │
│ Routes → Middleware → Controllers           │
│              ↓                              │
│           Services                          │
│              ↓                              │
│           Prisma ORM                        │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                PostgreSQL                   │
│                                             │
│ Users | Customers | Products | Stock        │
│ Challans | Invoices | Audit Logs            │
└─────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 4. Authentication and Roles

The system requires role-based authentication.

Required roles:

1.  Admin
2.  Sales
3.  Warehouse
4.  Accounts

JWT-based authentication is acceptable.

### Role Responsibilities

  Role        Primary Responsibility
  ----------- -----------------------------------------------
  Admin       User administration and overall system access
  Sales       Customers, CRM, sales challans
  Warehouse   Products, inventory and stock movements
  Accounts    Invoices and financial operations

Actual authorization rules should be enforced by backend middleware
rather than only hiding frontend UI elements.

------------------------------------------------------------------------

# 5. Customer CRM Module

The CRM module manages customer information and follow-ups.

## Customer Fields

Each customer should contain:

-   Customer name
-   Mobile number
-   Email
-   Business name
-   GST number (optional)
-   Customer type
-   Address
-   Status
-   Follow-up date
-   Notes

### Customer Type

-   Retail
-   Wholesale
-   Distributor

### Customer Status

-   Lead
-   Active
-   Inactive

## Required CRM Features

-   Add customer
-   Edit customer
-   Search customer
-   View customer detail page
-   Add follow-up notes

## Expected API

Example:

``` text
GET /customers
```

Additional customer endpoints should follow REST conventions.

------------------------------------------------------------------------

# 6. Product and Inventory Module

The system must support product and stock management.

## Product Fields

Each product should contain:

-   Product name
-   SKU / code
-   Category
-   Unit price
-   Current stock
-   Minimum stock alert quantity
-   Location / warehouse

## Product Features

-   Add product
-   Edit product

## Stock Movement Log

Every stock movement should track:

-   Product
-   Quantity changed
-   Movement type
-   Reason
-   Created by
-   Timestamp

### Movement Types

``` text
IN
OUT
```

The inventory implementation should ensure that stock changes are
traceable.

------------------------------------------------------------------------

# 7. Sales Challan Module

The sales challan module represents the outbound sales process.

A Sales user should be able to:

1.  Select a customer
2.  Add multiple products
3.  Add quantity for each product
4.  Generate a challan number automatically
5.  Save the challan as Draft or Confirmed

## Challan Fields

-   Challan number
-   Customer
-   Products
-   Total quantity
-   Status
-   Created by
-   Created date

### Challan Status

``` text
Draft
Confirmed
Cancelled
```

------------------------------------------------------------------------

# 8. Challan Business Rules

These are important business rules and must be implemented on the
backend.

## Confirmation

When a challan is confirmed:

``` text
Challan Confirmed
       ↓
Validate Product Stock
       ↓
Enough Stock?
   ┌───┴───┐
  YES      NO
   ↓        ↓
Reduce     Return
Stock      Proper Error
   ↓
Create Stock Movement
```

## Stock Protection

Stock must never become negative.

If requested quantity exceeds available stock, the API must return a
proper error.

## Product Snapshot

A confirmed challan should store product snapshot information rather
than relying only on the current Product record.

This ensures historical challan data remains meaningful even if product
information changes later.

------------------------------------------------------------------------

# 9. REST API Expectations

Backend APIs should be clean REST APIs.

Examples from the case study:

``` text
POST /auth/login
GET  /customers
```

APIs should provide:

-   Input validation
-   Proper HTTP status codes
-   Useful error messages
-   Pagination where needed
-   Search/filter where needed

------------------------------------------------------------------------

# 10. Frontend Requirements

The frontend should provide a clean admin-style UI.

The UI should be:

-   Responsive
-   Practical
-   Easy to navigate
-   Suitable for internal business operations

The frontend modules should correspond to the backend business modules.

------------------------------------------------------------------------

# 11. Database Architecture

The backend uses PostgreSQL.

The current database design contains the following major entities:

``` text
User
Customer
CustomerFollowUp
Product
StockMovement
Challan
ChallanItem
Invoice
InvoiceItem
AuditLog
CompanySetting
```

### Core Relationships

``` text
User
 ├── Customers created/updated
 ├── Stock Movements
 ├── Challans
 ├── Invoices
 ├── Follow-ups
 └── Audit Logs

Customer
 ├── Follow-ups
 ├── Challans
 └── Invoices

Product
 ├── Stock Movements
 ├── Challan Items
 └── Invoice Items

Challan
 ├── Challan Items
 ├── Stock Movements
 └── Invoice

Invoice
 ├── Invoice Items
 └── Stock Movements
```

------------------------------------------------------------------------

# 12. Backend Layering

The backend should maintain separation between responsibilities.

Recommended structure:

``` text
src/
├── config/
│   ├── database.ts
│   └── env.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── role.middleware.ts
│   ├── validation.middleware.ts
│   └── error.middleware.ts
│
├── routes/
│   ├── auth.routes.ts
│   ├── customers.routes.ts
│   ├── products.routes.ts
│   ├── inventory.routes.ts
│   ├── challans.routes.ts
│   ├── invoices.routes.ts
│   ├── users.routes.ts
│   └── health.routes.ts
│
├── controllers/
├── services/
├── validators/
├── utils/
├── app.ts
└── server.ts
```

The exact folder structure may evolve as implementation progresses.

------------------------------------------------------------------------

# 13. Environment Variables

Secrets and environment-specific configuration must not be hardcoded.

Expected configuration includes values such as:

``` env
NODE_ENV=development
PORT=8000

DATABASE_URL=...

JWT_SECRET=...
JWT_EXPIRES_IN=...

FRONTEND_URL=http://localhost:5173
```

Production values should be configured through the hosting platform's
environment-variable system.

------------------------------------------------------------------------

# 14. Error Handling

The backend should use centralized error handling.

Expected flow:

``` text
Request
   ↓
Route
   ↓
Validation
   ↓
Controller
   ↓
Service
   ↓
Database
   ↓
Response
```

If an error occurs:

``` text
Controller / Service
        ↓
      Error
        ↓
Central Error Middleware
        ↓
Consistent JSON Response
```

Business errors such as insufficient stock should produce meaningful
HTTP responses rather than generic server failures.

------------------------------------------------------------------------

# 15. Pagination, Search and Filtering

Where appropriate, list APIs should support:

-   Pagination
-   Search
-   Filtering

For example:

``` text
GET /customers?page=1&limit=20
```

and potentially:

``` text
GET /customers?search=acme
```

The exact query parameters should be documented with the API collection.

------------------------------------------------------------------------

# 16. Dashboard

The frontend dashboard should eventually consume real backend data
rather than mock data.

Potential dashboard information should be derived from the application's
real records, including operational information relevant to:

-   Customers
-   Products
-   Inventory
-   Challans
-   Invoices

The exact dashboard metrics should remain aligned with the implemented
business data.

------------------------------------------------------------------------

# 17. Auditability

The system includes an audit-log capability for recording important
actions.

Audit records should capture information such as:

-   User
-   Action
-   Module
-   Description
-   Status
-   Timestamp
-   Entity
-   Entity ID
-   IP address where available

This provides traceability for important operational actions.

------------------------------------------------------------------------

# 18. Deployment

The case study permits free hosting platforms.

Acceptable examples include:

### Frontend

-   Vercel
-   Netlify
-   Render Static Site
-   Similar free hosting platform

### Backend

-   Render
-   Railway
-   Fly.io
-   Similar platform

### Database

-   Supabase
-   Neon
-   Render Postgres
-   Similar PostgreSQL provider

AWS deployment is optional and is considered a bonus.

------------------------------------------------------------------------

# 19. Local Development

## Frontend

``` text
cd mini-erp-crm
npm install
npm run dev
```

The frontend development server is expected to run on the local
development URL configured by Vite.

## Backend

``` text
cd backend
npm install
npm run dev
```

The backend should expose the API on the configured `PORT`.

## Database

PostgreSQL must be available locally or through a configured PostgreSQL
provider.

Prisma is used as the database ORM.

------------------------------------------------------------------------

# 20. Database Migration Workflow

The development workflow is:

``` text
Modify Prisma Schema
        ↓
Generate Prisma Client
        ↓
Create Migration
        ↓
Apply Migration
        ↓
Verify Database
        ↓
Run Backend
```

Example commands:

``` powershell
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

Migration commands should be used deliberately because the database
schema is part of the application contract.

------------------------------------------------------------------------

# 21. Testing and API Verification

The project should provide a Postman collection or equivalent API
documentation.

The collection should cover at least:

``` text
Authentication
Customers
Products
Inventory
Challans
Invoices
Users
Health
```

Important scenarios should include:

### Authentication

-   Successful login
-   Invalid credentials
-   Protected endpoint without token
-   Role-restricted endpoint

### Customers

-   Create
-   List
-   Search
-   Update
-   Detail
-   Follow-up

### Products

-   Create
-   List
-   Update
-   Search

### Inventory

-   Stock IN
-   Stock OUT
-   Movement history
-   Insufficient stock

### Challans

-   Create draft
-   Confirm challan
-   Insufficient stock
-   Cancel challan

------------------------------------------------------------------------

# 22. Deployment Documentation

The README/project documentation must explain:

1.  How the server was set up
2.  How environment variables are managed
3.  How to run the project locally
4.  How to deploy the project
5.  Any assumptions made

------------------------------------------------------------------------

# 23. GitHub Repository

The final project should be maintained in a GitHub repository with
proper commits.

Recommended commit progression:

``` text
feat: initialize frontend
feat: add dashboard and navigation
feat: add CRM module
feat: add inventory module
feat: add challan module
feat: add invoice module
feat: initialize backend
feat: add prisma database schema
feat: add authentication
feat: add customer APIs
feat: add product APIs
feat: add inventory APIs
feat: add challan business logic
feat: add invoice APIs
feat: integrate frontend with backend
test: add API tests
docs: add setup and deployment guide
```

------------------------------------------------------------------------

# 24. Bonus Features

The case study identifies the following bonus features:

## Docker Setup

Containerize the application and provide reproducible
development/deployment configuration.

Possible components:

``` text
Frontend Container
Backend Container
PostgreSQL Container
```

## GitHub Actions

Automate:

``` text
Push
 ↓
Install
 ↓
Typecheck
 ↓
Build
 ↓
Test
 ↓
Deploy
```

## Invoice PDF Export

Allow invoices to be exported as PDF documents.

## Product Image Upload to AWS S3

Allow product images to be uploaded to AWS S3 and store the resulting
image reference in the database.

AWS deployment itself is optional; AWS usage for the bonus functionality
can be implemented independently.

------------------------------------------------------------------------

# 25. Submission Requirements

The final submission should contain:

-   GitHub repository link
-   Live frontend URL
-   Live backend API URL
-   Test login credentials for all roles
-   Postman collection or API documentation
-   README with setup and deployment instructions
-   Short explanation of architecture
-   Known limitations or incomplete parts

------------------------------------------------------------------------

# 26. Final End-to-End Business Flow

The intended application flow is:

``` text
                    ┌──────────────┐
                    │    Login     │
                    └──────┬───────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │ Role Verification│
                 └────────┬─────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
            Sales      Warehouse   Accounts
              │           │           │
              ▼           ▼           ▼
          Customers     Products    Invoices
              │           │
              ▼           ▼
          Follow-ups   Inventory
              │           │
              └─────┬─────┘
                    ▼
                Challans
                    │
                    ▼
             Stock Validation
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
       Sufficient          Insufficient
          │                   │
          ▼                   ▼
    Reduce Stock          API Error
          │
          ▼
    Stock Movement
          │
          ▼
       Invoice
          │
          ▼
       Dashboard
```

------------------------------------------------------------------------

# 27. Implementation Roadmap

The implementation is being completed incrementally.

### Completed

-   Frontend foundation
-   Responsive admin UI
-   Dashboard
-   CRM UI
-   Products UI
-   Inventory UI
-   Challans UI
-   Invoices UI
-   Users UI
-   Settings/Profile UI
-   Backend foundation
-   PostgreSQL setup
-   Prisma schema
-   Database connectivity foundation

### Next

**Phase 2D --- Database Seeding**

-   Seed initial users
-   Hash passwords
-   Create Admin
-   Create Sales user
-   Create Warehouse user
-   Create Accounts user
-   Verify database records

### Following Phases

``` text
2D  Database Seed
2E  JWT Authentication
2F  Role-Based Authorization
2G  Customer CRM APIs
2H  Product APIs
2I  Inventory APIs
2J  Challan + Stock Transactions
2K  Invoice APIs
2L  Dashboard APIs
2M  Audit Logs
2N  Validation / Pagination / API Quality
2O  Frontend ↔ Backend Integration
2P  Testing + Postman
2Q  Deployment + Documentation
2R  Bonus Features
```

------------------------------------------------------------------------

# 28. Known Scope and Assumptions

The original case study intentionally describes a small ERP/CRM system
rather than a complete enterprise ERP.

Therefore:

-   The implementation should prioritize the explicitly required
    workflows.
-   Optional functionality should not compromise the required modules.
-   AWS deployment is optional.
-   Bonus features should be added after the core application is stable.
-   Business rules must be enforced by the backend, not only by the
    frontend.
-   Historical challan data should retain product snapshot information.
-   Stock must not become negative.
-   Authentication and role authorization must be enforced server-side.

------------------------------------------------------------------------

# 29. Project Completion Definition

The project is considered complete when:

``` text
Frontend
   ✓
Backend REST APIs
   ✓
Authentication
   ✓
Role Authorization
   ✓
PostgreSQL
   ✓
CRM
   ✓
Products
   ✓
Inventory
   ✓
Challans
   ✓
Invoices
   ✓
Dashboard
   ✓
Validation
   ✓
Error Handling
   ✓
Search / Pagination
   ✓
Auditability
   ✓
Frontend Integration
   ✓
Testing / Postman
   ✓
Deployment
   ✓
README
   ✓
```

Bonus features can then be added:

``` text
Docker
GitHub Actions
Invoice PDF
AWS S3 Product Images
```

------------------------------------------------------------------------

## Source

This documentation is based on the provided **Full Stack Developer Case
Study --- Mini ERP + CRM Operations Portal**, including its stated
business context, technology requirements, modules, API expectations,
deployment expectations, bonus features and submission requirements.

# 30. Test Credentials

These credentials are intended for **local development/testing only**.

They should be created by the Phase 2D database seed.

  Role        Email / Username          Password
  ----------- ------------------------- ---------------
  Admin       admin@minierp.local       Admin@123
  Sales       sales@minierp.local       Sales@123
  Warehouse   warehouse@minierp.local   Warehouse@123
  Accounts    accounts@minierp.local    Accounts@123

> **Security:** These are development test credentials. Do not use them
> in production. Production credentials must be changed and stored
> securely as environment/platform secrets.

### Recommended Seed Users

``` text
Admin
  email: admin@minierp.local
  role: ADMIN

Sales
  email: sales@minierp.local
  role: SALES

Warehouse
  email: warehouse@minierp.local
  role: WAREHOUSE

Accounts
  email: accounts@minierp.local
  role: ACCOUNTS
```

Passwords must never be stored as plain text in PostgreSQL. The backend
should store only a secure password hash.

------------------------------------------------------------------------

# 31. API Endpoint Reference

The following is the planned REST API surface for the implementation.

## Base URLs

### Local

``` text
http://localhost:8000
```

### API prefix

``` text
/api
```

Therefore an endpoint such as:

``` text
/api/customers
```

will be available locally as:

``` text
http://localhost:8000/api/customers
```

------------------------------------------------------------------------

## 31.1 Health

  Method   Endpoint             Purpose
  -------- -------------------- -------------------------
  GET      `/`                  API information
  GET      `/health`            Basic server health
  GET      `/health/database`   PostgreSQL connectivity

Example:

``` http
GET /health/database
```

Expected response:

``` json
{
  "success": true,
  "status": "healthy",
  "database": "connected"
}
```

------------------------------------------------------------------------

# 31.2 Authentication

  Method   Endpoint             Purpose                      Access
  -------- -------------------- ---------------------------- ---------------
  POST     `/api/auth/login`    Login                        Public
  GET      `/api/auth/me`       Current authenticated user   Authenticated
  POST     `/api/auth/logout`   Logout                       Authenticated

### Login

``` http
POST /api/auth/login
Content-Type: application/json
```

Request:

``` json
{
  "email": "admin@minierp.local",
  "password": "Admin@123"
}
```

Successful response will contain an authentication token and user
information.

Example structure:

``` json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "...",
      "name": "System Administrator",
      "email": "admin@minierp.local",
      "role": "ADMIN"
    }
  }
}
```

------------------------------------------------------------------------

# 31.3 Users

  Method   Endpoint                  Purpose               Access
  -------- ------------------------- --------------------- --------
  GET      `/api/users`              List users            ADMIN
  GET      `/api/users/:id`          User details          ADMIN
  POST     `/api/users`              Create user           ADMIN
  PUT      `/api/users/:id`          Update user           ADMIN
  PATCH    `/api/users/:id/status`   Activate/deactivate   ADMIN

The frontend Users module will consume these endpoints.

------------------------------------------------------------------------

# 31.4 Profile

  Method   Endpoint                  Purpose
  -------- ------------------------- ---------------------
  GET      `/api/auth/me`            Get current profile
  PUT      `/api/profile`            Update profile
  PUT      `/api/profile/password`   Change password

The exact profile fields will remain aligned with the frontend Profile
screen.

------------------------------------------------------------------------

# 31.5 Customers / CRM

  Method   Endpoint                          Purpose
  -------- --------------------------------- ----------------------------
  GET      `/api/customers`                  List customers
  GET      `/api/customers/:id`              Customer details
  POST     `/api/customers`                  Create customer
  PUT      `/api/customers/:id`              Update customer
  DELETE   `/api/customers/:id`              Delete/deactivate customer
  GET      `/api/customers/:id/follow-ups`   Follow-up history
  POST     `/api/customers/:id/follow-ups`   Add follow-up

### List/search example

``` http
GET /api/customers?page=1&limit=20&search=acme
```

Optional filters can include:

``` text
status
customerType
followUpDate
```

------------------------------------------------------------------------

# 31.6 Products

  Method   Endpoint                     Purpose
  -------- ---------------------------- ---------------------
  GET      `/api/products`              List products
  GET      `/api/products/:id`          Product details
  POST     `/api/products`              Create product
  PUT      `/api/products/:id`          Update product
  PATCH    `/api/products/:id/status`   Activate/deactivate
  DELETE   `/api/products/:id`          Delete/deactivate

Example:

``` http
GET /api/products?page=1&limit=20&search=rose
```

Possible filters:

``` text
category
location
isActive
lowStock
```

------------------------------------------------------------------------

# 31.7 Inventory

  ------------------------------------------------------------------------------------------------
  Method                  Endpoint                                         Purpose
  ----------------------- ------------------------------------------------ -----------------------
  GET                     `/api/inventory`                                 Inventory overview

  GET                     `/api/inventory/movements`                       Stock movement history

  POST                    `/api/inventory/movements`                       Create stock movement

  GET                     `/api/inventory/products/:productId/movements`   Product movement
                                                                           history
  ------------------------------------------------------------------------------------------------

Example stock IN:

``` http
POST /api/inventory/movements
Content-Type: application/json
Authorization: Bearer JWT_TOKEN
```

``` json
{
  "productId": "PRODUCT_ID",
  "quantity": 100,
  "type": "IN",
  "reason": "New stock received"
}
```

Stock OUT must validate that sufficient stock exists.

------------------------------------------------------------------------

# 31.8 Challans

  Method   Endpoint                      Purpose
  -------- ----------------------------- ----------------------
  GET      `/api/challans`               List challans
  GET      `/api/challans/:id`           Challan details
  POST     `/api/challans`               Create draft challan
  PUT      `/api/challans/:id`           Update draft
  POST     `/api/challans/:id/confirm`   Confirm challan
  POST     `/api/challans/:id/cancel`    Cancel challan

### Create challan

``` http
POST /api/challans
```

Example:

``` json
{
  "customerId": "CUSTOMER_ID",
  "notes": "Urgent delivery",
  "items": [
    {
      "productId": "PRODUCT_ID",
      "quantity": 10
    }
  ]
}
```

### Confirm challan

``` http
POST /api/challans/CHALLAN_ID/confirm
```

The backend must:

1.  Load the challan
2.  Verify its current status
3.  Check product stock
4.  Reject insufficient stock
5.  Prevent negative stock
6.  Reduce product stock
7.  Create OUT stock movements
8.  Mark the challan as `CONFIRMED`
9.  Store confirmation timestamp
10. Execute the operation transactionally

------------------------------------------------------------------------

# 31.9 Invoices

  Method   Endpoint                     Purpose
  -------- ---------------------------- -----------------
  GET      `/api/invoices`              List invoices
  GET      `/api/invoices/:id`          Invoice details
  POST     `/api/invoices`              Create invoice
  PUT      `/api/invoices/:id`          Update invoice
  POST     `/api/invoices/:id/issue`    Issue invoice
  POST     `/api/invoices/:id/pay`      Mark paid
  POST     `/api/invoices/:id/cancel`   Cancel invoice

Possible filters:

``` text
status
customerId
invoiceDate
dueDate
search
```

------------------------------------------------------------------------

# 31.10 Dashboard

  Method   Endpoint                            Purpose
  -------- ----------------------------------- ---------------------
  GET      `/api/dashboard/summary`            Main KPI summary
  GET      `/api/dashboard/recent-challans`    Recent challans
  GET      `/api/dashboard/recent-invoices`    Recent invoices
  GET      `/api/dashboard/low-stock`          Low-stock products
  GET      `/api/dashboard/customer-summary`   Customer statistics

The dashboard should use real PostgreSQL data after frontend
integration.

------------------------------------------------------------------------

# 31.11 Audit Logs

  Method   Endpoint                Purpose              Access
  -------- ----------------------- -------------------- --------
  GET      `/api/audit-logs`       List audit records   ADMIN
  GET      `/api/audit-logs/:id`   Audit detail         ADMIN

Audit creation should primarily happen automatically inside backend
services/middleware rather than allowing ordinary users to manually
create audit records.

------------------------------------------------------------------------

# 31.12 Settings

  Method   Endpoint                  Purpose
  -------- ------------------------- -------------------------
  GET      `/api/settings/company`   Get company settings
  PUT      `/api/settings/company`   Update company settings

Recommended access:

``` text
ADMIN only
```

------------------------------------------------------------------------

# 32. Authentication Header

Protected endpoints should use:

``` http
Authorization: Bearer JWT_TOKEN
```

Example:

``` http
GET /api/customers
Authorization: Bearer eyJhbGciOi...
```

The backend should reject:

-   Missing token
-   Invalid token
-   Expired token
-   Inactive user

with appropriate HTTP status codes.

------------------------------------------------------------------------

# 33. HTTP Status Code Convention

The API should consistently use appropriate HTTP status codes.

  Status   Meaning
  -------- ------------------------------------------
  200      Successful request
  201      Resource created
  204      Successful request with no response body
  400      Invalid request
  401      Authentication required/invalid
  403      Insufficient permissions
  404      Resource not found
  409      Business conflict
  422      Validation failure where used
  500      Unexpected server error

Examples:

### Insufficient stock

``` http
409 Conflict
```

### Invalid login

``` http
401 Unauthorized
```

### Sales user trying to access admin-only user management

``` http
403 Forbidden
```

### Customer doesn't exist

``` http
404 Not Found
```

------------------------------------------------------------------------

# 34. Standard API Response Format

Successful responses should generally follow:

``` json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

List responses can use:

``` json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Errors should follow a consistent structure:

``` json
{
  "success": false,
  "message": "Insufficient stock",
  "error": {
    "code": "INSUFFICIENT_STOCK"
  }
}
```

The exact error structure may be refined during the
validation/error-handling phase.

------------------------------------------------------------------------

# 35. Test Credential Matrix

For final testing, the following credentials should be supplied with the
submission.

``` text
┌────────────┬─────────────────────────────┬─────────────┐
│ Role       │ Email                       │ Password    │
├────────────┼─────────────────────────────┼─────────────┤
│ Admin      │ admin@minierp.local         │ Admin@123   │
│ Sales      │ sales@minierp.local         │ Sales@123   │
│ Warehouse  │ warehouse@minierp.local     │ Warehouse@123 │
│ Accounts   │ accounts@minierp.local      │ Accounts@123  │
└────────────┴─────────────────────────────┴─────────────┘
```

These are **development credentials only** and must not be used for
production.

------------------------------------------------------------------------

# 36. Postman Collection Structure

The eventual Postman collection should be organized as:

``` text
Mini ERP CRM API
│
├── 01 Health
│   ├── API Health
│   └── Database Health
│
├── 02 Authentication
│   ├── Login - Admin
│   ├── Login - Sales
│   ├── Login - Warehouse
│   ├── Login - Accounts
│   ├── Get Current User
│   └── Logout
│
├── 03 Users
│   ├── List Users
│   ├── Get User
│   ├── Create User
│   ├── Update User
│   └── Change Status
│
├── 04 Customers
│   ├── List
│   ├── Search
│   ├── Create
│   ├── Get Detail
│   ├── Update
│   └── Follow-up
│
├── 05 Products
│   ├── List
│   ├── Search
│   ├── Create
│   └── Update
│
├── 06 Inventory
│   ├── Overview
│   ├── Stock IN
│   ├── Stock OUT
│   └── Movement History
│
├── 07 Challans
│   ├── Create Draft
│   ├── Update Draft
│   ├── Confirm
│   ├── Insufficient Stock Test
│   └── Cancel
│
├── 08 Invoices
│   ├── List
│   ├── Create
│   ├── Issue
│   ├── Pay
│   └── Cancel
│
├── 09 Dashboard
│   ├── Summary
│   ├── Recent Challans
│   ├── Recent Invoices
│   └── Low Stock
│
├── 10 Audit Logs
│   ├── List
│   └── Detail
│
└── 11 Settings
    ├── Get Company Settings
    └── Update Company Settings
```

------------------------------------------------------------------------

# 37. Test Sequence

The recommended end-to-end API testing sequence is:

``` text
1. Health check
       ↓
2. Admin login
       ↓
3. Create/verify users
       ↓
4. Create customer
       ↓
5. Create product
       ↓
6. Add stock
       ↓
7. Create challan
       ↓
8. Confirm challan
       ↓
9. Verify stock decreased
       ↓
10. Verify stock movement
       ↓
11. Create invoice
       ↓
12. Issue invoice
       ↓
13. Verify dashboard
       ↓
14. Verify audit logs
```

------------------------------------------------------------------------

# 38. Important Development Rule

The frontend should never be considered the authority for:

-   Authentication
-   Role permissions
-   Stock availability
-   Challan confirmation
-   Invoice state transitions
-   Business validation

These rules must be enforced by the backend.

The React frontend should provide a good user experience, while
Express + services + PostgreSQL remain the source of truth.
