import {
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addCustomerFollowUp,
  createCustomer,
  fetchCustomerById,
  fetchCustomers,
  updateCustomer,
} from "../api/customers";
import { ApiRequestError } from "../api/client";

import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

import CustomerForm from "../components/customers/CustomerForm";
import CustomerTable from "../components/customers/CustomerTable";
import CustomerDetails from "../components/customers/CustomerDetails";
import FollowUpModal from "../components/customers/FollowUpModal";

import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/permissions";

import type { Customer } from "../types";

const PAGE_SIZE = 20;

export default function Customers() {
  const { user } = useAuth();
  const canManage =
    user &&
    hasPermission(user.role, "MANAGE_CUSTOMERS");

  const [customerList, setCustomerList] = useState<
    Customer[]
  >([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] =
    useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);
  const [followUpOpen, setFollowUpOpen] =
    useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchCustomers({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status:
          statusFilter === "ALL"
            ? undefined
            : statusFilter,
        customerType:
          typeFilter === "ALL"
            ? undefined
            : typeFilter,
      });

      setCustomerList(result.customers);
      setTotalCount(result.pagination.total);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "Failed to load customers.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    debouncedSearch,
    statusFilter,
    typeFilter,
  ]);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const handleAddCustomer = async (
    data: Omit<
      Customer,
      "id" | "createdAt" | "updatedAt"
    >,
  ) => {
    setActionError("");

    try {
      await createCustomer(data);
      setFormOpen(false);
      await loadCustomers();
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError
          ? err.message
          : "Failed to create customer.",
      );
    }
  };

  const handleEditCustomer = async (
    data: Omit<
      Customer,
      "id" | "createdAt" | "updatedAt"
    >,
  ) => {
    if (!editingCustomer) {
      return;
    }

    setActionError("");

    try {
      await updateCustomer(editingCustomer.id, data);
      setEditingCustomer(null);
      setFormOpen(false);
      await loadCustomers();
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError
          ? err.message
          : "Failed to update customer.",
      );
    }
  };

  const handleFollowUp = async (
    note: string,
    date: string,
  ) => {
    if (!selectedCustomer) {
      return;
    }

    setActionError("");

    try {
      await addCustomerFollowUp(
        selectedCustomer.id,
        note,
        date,
      );

      const refreshed = await fetchCustomerById(
        selectedCustomer.id,
      );

      setSelectedCustomer(refreshed);
      setFollowUpOpen(false);
      await loadCustomers();
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError
          ? err.message
          : "Failed to add follow-up.",
      );
    }
  };

  const activeFilterCount =
    Number(statusFilter !== "ALL") +
    Number(typeFilter !== "ALL");

  const clearFilters = () => {
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setPage(1);
  };

  const activeOnPage = useMemo(
    () =>
      customerList.filter(
        (customer) => customer.status === "ACTIVE",
      ).length,
    [customerList],
  );

  const leadsOnPage = useMemo(
    () =>
      customerList.filter(
        (customer) => customer.status === "LEAD",
      ).length,
    [customerList],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / PAGE_SIZE),
  );

  if (loading && customerList.length === 0) {
    return <LoadingState message="Loading customers..." />;
  }

  if (error && customerList.length === 0) {
    return (
      <ErrorState
        title="Unable to load customers"
        description={error}
        onRetry={() => void loadCustomers()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customer relationships, business information and follow-ups."
        action={
          canManage ? (
            <Button
              onClick={() => {
                setEditingCustomer(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          ) : undefined
        }
      />

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

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
                {totalCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Active on this page
          </p>

          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {activeOnPage}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Leads on this page
          </p>

          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {leadsOnPage}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
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

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                setFilterOpen((previous) => !previous)
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
              <Button variant="ghost" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>

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
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="ALL">All statuses</option>
                  <option value="LEAD">Lead</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
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
                  onChange={(event) => {
                    setTypeFilter(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="ALL">All types</option>
                  <option value="RETAIL">Retail</option>
                  <option value="WHOLESALE">Wholesale</option>
                  <option value="DISTRIBUTOR">Distributor</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">
              {customerList.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-600">
              {totalCount}
            </span>{" "}
            customers
          </p>

          {loading && (
            <span className="text-xs text-slate-400">
              Updating...
            </span>
          )}
        </div>

        {customerList.length > 0 ? (
          <CustomerTable
            customers={customerList}
            onView={(customer) =>
              setSelectedCustomer(customer)
            }
            onEdit={
              canManage
                ? (customer) => {
                    setEditingCustomer(customer);
                    setFormOpen(true);
                  }
                : undefined
            }
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
              Try changing your search or filters.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
            >
              Previous
            </Button>

            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>

            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) =>
                  Math.min(totalPages, current + 1),
                )
              }
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingCustomer(null);
          setActionError("");
        }}
        title={
          editingCustomer ? "Edit Customer" : "Add Customer"
        }
        description={
          editingCustomer
            ? "Update customer information."
            : "Add a new customer to your CRM."
        }
        size="lg"
      >
        <CustomerForm
          customer={editingCustomer}
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

      <CustomerDetails
        customer={selectedCustomer}
        open={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        onAddFollowUp={
          canManage
            ? () => setFollowUpOpen(true)
            : undefined
        }
      />

      <FollowUpModal
        open={followUpOpen}
        onClose={() => setFollowUpOpen(false)}
        onSubmit={handleFollowUp}
      />
    </div>
  );
}
