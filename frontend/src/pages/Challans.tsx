import {
  FileText,
  Plus,
  Search,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  challanFormToApiItems,
  confirmChallan,
  createChallan,
  fetchChallans,
} from "../api/challans";
import { fetchCustomers } from "../api/customers";
import { fetchProducts } from "../api/products";
import { ApiRequestError } from "../api/client";

import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

import ChallanForm from "../components/challans/ChallanForm";
import ChallanTable from "../components/challans/ChallanTable";
import ChallanDetails from "../components/challans/ChallanDetails";

import type {
  Challan,
  Customer,
  Product,
} from "../types";

const PAGE_SIZE = 20;

export default function Challans() {
  const [challanList, setChallanList] = useState<Challan[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [formOpen, setFormOpen] = useState(false);
  const [selectedChallan, setSelectedChallan] =
    useState<Challan | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function loadFormOptions() {
      try {
        const [customersResult, productsResult] = await Promise.all([
          fetchCustomers({ limit: 100 }),
          fetchProducts({ limit: 100 }),
        ]);

        setCustomers(customersResult.customers);
        setProducts(productsResult.products);
      } catch {
        // Dropdown options are optional for viewing the list.
      }
    }

    void loadFormOptions();
  }, []);

  const loadChallans = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchChallans({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status:
          statusFilter === "ALL" ? undefined : statusFilter,
      });

      setChallanList(result.challans);
      setTotalCount(result.pagination.total);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "Failed to load challans.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    void loadChallans();
  }, [loadChallans]);

  const draftCount = useMemo(
    () =>
      challanList.filter((challan) => challan.status === "DRAFT")
        .length,
    [challanList],
  );

  const confirmedCount = useMemo(
    () =>
      challanList.filter(
        (challan) => challan.status === "CONFIRMED",
      ).length,
    [challanList],
  );

  const cancelledCount = useMemo(
    () =>
      challanList.filter(
        (challan) => challan.status === "CANCELLED",
      ).length,
    [challanList],
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const handleSaveDraft = async (challan: Challan) => {
    setSubmitting(true);
    setActionError("");

    try {
      await createChallan({
        customerId: challan.customerId,
        items: challanFormToApiItems(challan),
      });

      setFormOpen(false);
      await loadChallans();
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError
          ? err.message
          : "Failed to save challan draft.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async (challan: Challan) => {
    setSubmitting(true);
    setActionError("");

    try {
      const created = await createChallan({
        customerId: challan.customerId,
        items: challanFormToApiItems(challan),
      });

      await confirmChallan(created.id);
      setFormOpen(false);
      await loadChallans();
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError
          ? err.message
          : "Failed to confirm challan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && challanList.length === 0) {
    return <LoadingState message="Loading challans..." />;
  }

  if (error && challanList.length === 0) {
    return (
      <ErrorState
        title="Unable to load challans"
        description={error}
        onRetry={() => void loadChallans()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Challans"
        description="Create, manage and track sales challans."
        action={
          <Button
            onClick={() => {
              setActionError("");
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Create Challan
          </Button>
        }
      />

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Summary */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-slate-500">Total Challans</p>

              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {totalCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Draft</p>

          <p className="mt-2 text-2xl font-semibold text-amber-600">
            {draftCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Confirmed</p>

          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {confirmedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Cancelled</p>

          <p className="mt-2 text-2xl font-semibold text-red-600">
            {cancelledCount}
          </p>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search challan or customer..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 sm:w-80"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
          >
            <option value="ALL">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">
              {challanList.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-600">
              {totalCount}
            </span>{" "}
            challans
          </p>

          {loading && (
            <span className="text-xs text-slate-400">Updating...</span>
          )}
        </div>

        {challanList.length > 0 ? (
          <ChallanTable
            challans={challanList}
            onView={(challan) => setSelectedChallan(challan)}
          />
        ) : (
          <div className="px-5 py-16 text-center">
            <p className="text-sm font-semibold text-slate-800">
              No challans found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first sales challan.
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

      {/* Create Challan */}

      <Modal
        open={formOpen}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setActionError("");
          }
        }}
        title="Create Sales Challan"
        description="Select a customer and add products."
        size="lg"
      >
        <ChallanForm
          customers={customers}
          products={products}
          onSaveDraft={(challan) => void handleSaveDraft(challan)}
          onConfirm={(challan) => void handleConfirm(challan)}
          onCancel={() => {
            if (!submitting) {
              setFormOpen(false);
              setActionError("");
            }
          }}
        />
      </Modal>

      {/* Details */}

      <ChallanDetails
        challan={selectedChallan}
        open={Boolean(selectedChallan)}
        onClose={() => setSelectedChallan(null)}
      />
    </div>
  );
}
