import {
    Filter,
    Plus,
    Search,
    SlidersHorizontal,
    Users,
    X,
  } from "lucide-react";
  
  import {
    useMemo,
    useState,
  } from "react";
  
  import PageHeader from "../components/common/PageHeader";
  import Button from "../components/ui/Button";
  import Modal from "../components/ui/Modal";
  
  import CustomerForm from "../components/customers/CustomerForm";
  import CustomerTable from "../components/customers/CustomerTable";
  import CustomerDetails from "../components/customers/CustomerDetails";
  import FollowUpModal from "../components/customers/FollowUpModal";
  
  import { customers as initialCustomers } from "../data/mockData";
  
  import type {
    Customer,
  } from "../types";
  
  export default function Customers() {
    const [
      customerList,
      setCustomerList,
    ] = useState<Customer[]>(
      initialCustomers,
    );
  
    const [search, setSearch] =
      useState("");
  
    const [
      statusFilter,
      setStatusFilter,
    ] = useState("ALL");
  
    const [
      typeFilter,
      setTypeFilter,
    ] = useState("ALL");
  
    const [
      formOpen,
      setFormOpen,
    ] = useState(false);
  
    const [
      editingCustomer,
      setEditingCustomer,
    ] = useState<Customer | null>(
      null,
    );
  
    const [
      selectedCustomer,
      setSelectedCustomer,
    ] = useState<Customer | null>(
      null,
    );
  
    const [
      followUpOpen,
      setFollowUpOpen,
    ] = useState(false);
  
    const [
      filterOpen,
      setFilterOpen,
    ] = useState(false);
  
    /* Search + filters */
  
    const filteredCustomers =
      useMemo(() => {
        const query =
          search.trim().toLowerCase();
  
        return customerList.filter(
          (customer) => {
            const matchesSearch =
              !query ||
              customer.customerName
                .toLowerCase()
                .includes(query) ||
              customer.businessName
                .toLowerCase()
                .includes(query) ||
              customer.mobile
                .toLowerCase()
                .includes(query) ||
              customer.email
                .toLowerCase()
                .includes(query);
  
            const matchesStatus =
              statusFilter === "ALL" ||
              customer.status ===
                statusFilter;
  
            const matchesType =
              typeFilter === "ALL" ||
              customer.customerType ===
                typeFilter;
  
            return (
              matchesSearch &&
              matchesStatus &&
              matchesType
            );
          },
        );
      }, [
        customerList,
        search,
        statusFilter,
        typeFilter,
      ]);
  
    /* Add customer */
  
    const handleAddCustomer = (
      data: Omit<
        Customer,
        "id" | "createdAt" | "updatedAt"
      >,
    ) => {
      const newCustomer: Customer = {
        ...data,
        id: `CUS-${String(
          customerList.length + 1,
        ).padStart(3, "0")}`,
        createdAt:
          new Date()
            .toISOString()
            .split("T")[0],
        updatedAt:
          new Date()
            .toISOString()
            .split("T")[0],
        followUps: [],
      };
  
      setCustomerList((previous) => [
        newCustomer,
        ...previous,
      ]);
  
      setFormOpen(false);
    };
  
    /* Edit customer */
  
    const handleEditCustomer = (
      data: Omit<
        Customer,
        "id" | "createdAt" | "updatedAt"
      >,
    ) => {
      if (!editingCustomer) {
        return;
      }
  
      setCustomerList((previous) =>
        previous.map((customer) =>
          customer.id ===
          editingCustomer.id
            ? {
                ...customer,
                ...data,
                updatedAt:
                  new Date()
                    .toISOString()
                    .split("T")[0],
              }
            : customer,
        ),
      );
  
      setEditingCustomer(null);
      setFormOpen(false);
    };
  
    /* Follow-up */
  
    const handleFollowUp = (
      note: string,
      date: string,
    ) => {
      if (!selectedCustomer) {
        return;
      }
  
      const newFollowUp = {
        id: `FU-${Date.now()}`,
        customerId:
          selectedCustomer.id,
        note,
        followUpDate: date,
        createdBy: "Arjun Mehta",
        createdAt:
          new Date().toLocaleString(
            "en-IN",
          ),
      };
  
      const updatedCustomer = {
        ...selectedCustomer,
        followUpDate: date,
        followUps: [
          newFollowUp,
          ...(selectedCustomer.followUps ||
            []),
        ],
      };
  
      setCustomerList((previous) =>
        previous.map((customer) =>
          customer.id ===
          selectedCustomer.id
            ? updatedCustomer
            : customer,
        ),
      );
  
      setSelectedCustomer(
        updatedCustomer,
      );
  
      setFollowUpOpen(false);
    };
  
    /* Active filter count */
  
    const activeFilterCount =
      Number(statusFilter !== "ALL") +
      Number(typeFilter !== "ALL");
  
    const clearFilters = () => {
      setStatusFilter("ALL");
      setTypeFilter("ALL");
    };
  
    return (
      <div className="space-y-6">
        {/* Header */}
  
        <PageHeader
          title="Customers"
          description="Manage customer relationships, business information and follow-ups."
          action={
            <Button
              onClick={() => {
                setEditingCustomer(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          }
        />
  
        {/* Summary */}
  
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
  
              <div>
                <p className="text-sm text-slate-500">
                  Total Customers
                </p>
  
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {customerList.length}
                </p>
              </div>
            </div>
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Active Customers
            </p>
  
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {
                customerList.filter(
                  (customer) =>
                    customer.status ===
                    "ACTIVE",
                ).length
              }
            </p>
  
            <p className="mt-1 text-xs text-emerald-600">
              Current active accounts
            </p>
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Leads
            </p>
  
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {
                customerList.filter(
                  (customer) =>
                    customer.status ===
                    "LEAD",
                ).length
              }
            </p>
  
            <p className="mt-1 text-xs text-amber-600">
              Require follow-up
            </p>
          </div>
        </div>
  
        {/* Main table */}
  
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Toolbar */}
  
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
  
            <div className="relative min-w-0 flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
  
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search customers..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
  
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
  
            {/* Filters */}
  
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() =>
                  setFilterOpen(
                    (previous) =>
                      !previous,
                  )
                }
              >
                <SlidersHorizontal className="h-4 w-4" />
  
                Filters
  
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1 text-[11px] font-semibold text-blue-700">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
  
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
  
          {/* Filter panel */}
  
          {filterOpen && (
            <div className="border-b border-slate-100 bg-slate-50/60 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
  
                <p className="text-sm font-semibold text-slate-800">
                  Filter Customers
                </p>
              </div>
  
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="status-filter"
                    className="mb-1.5 block text-xs font-medium text-slate-500"
                  >
                    Status
                  </label>
  
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="ALL">
                      All statuses
                    </option>
  
                    <option value="LEAD">
                      Lead
                    </option>
  
                    <option value="ACTIVE">
                      Active
                    </option>
  
                    <option value="INACTIVE">
                      Inactive
                    </option>
                  </select>
                </div>
  
                <div>
                  <label
                    htmlFor="type-filter"
                    className="mb-1.5 block text-xs font-medium text-slate-500"
                  >
                    Customer Type
                  </label>
  
                  <select
                    id="type-filter"
                    value={typeFilter}
                    onChange={(event) =>
                      setTypeFilter(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="ALL">
                      All types
                    </option>
  
                    <option value="RETAIL">
                      Retail
                    </option>
  
                    <option value="WHOLESALE">
                      Wholesale
                    </option>
  
                    <option value="DISTRIBUTOR">
                      Distributor
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}
  
          {/* Results */}
  
          <div className="border-b border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600">
                {filteredCustomers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-600">
                {customerList.length}
              </span>{" "}
              customers
            </p>
          </div>
  
          {/* Table */}
  
          {filteredCustomers.length > 0 ? (
            <CustomerTable
              customers={
                filteredCustomers
              }
              onView={(customer) =>
                setSelectedCustomer(
                  customer,
                )
              }
              onEdit={(customer) => {
                setEditingCustomer(
                  customer,
                );
                setFormOpen(true);
              }}
            />
          ) : (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Search className="h-5 w-5" />
              </div>
  
              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                No customers found
              </h3>
  
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Try changing your search or
                filters.
              </p>
  
              <div className="mt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch("");
                    clearFilters();
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
  
        {/* Add / Edit */}
  
        <Modal
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingCustomer(null);
          }}
          title={
            editingCustomer
              ? "Edit Customer"
              : "Add Customer"
          }
          description={
            editingCustomer
              ? "Update customer information."
              : "Add a new customer to your CRM."
          }
          size="lg"
        >
          <CustomerForm
            customer={
              editingCustomer
            }
            onSubmit={
              editingCustomer
                ? handleEditCustomer
                : handleAddCustomer
            }
            onCancel={() => {
              setFormOpen(false);
              setEditingCustomer(null);
            }}
          />
        </Modal>
  
        {/* Customer details */}
  
        <CustomerDetails
          customer={
            selectedCustomer
          }
          open={Boolean(
            selectedCustomer,
          )}
          onClose={() =>
            setSelectedCustomer(null)
          }
          onAddFollowUp={() =>
            setFollowUpOpen(true)
          }
        />
  
        {/* Follow-up */}
  
        <FollowUpModal
          open={followUpOpen}
          onClose={() =>
            setFollowUpOpen(false)
          }
          onSubmit={handleFollowUp}
        />
      </div>
    );
  }