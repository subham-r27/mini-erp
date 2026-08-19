import {
  FileCheck2,
  FileText,
  IndianRupee,
  Search,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { fetchInvoices } from "../api/invoices";
import { ApiRequestError } from "../api/client";

import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";

import InvoiceTable from "../components/invoices/InvoiceTable";
import InvoiceDetails from "../components/invoices/InvoiceDetails";

import type { Invoice } from "../types";

const PAGE_SIZE = 20;

export default function Invoices() {
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchInvoices({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status:
          statusFilter === "ALL" ? undefined : statusFilter,
      });

      setInvoiceList(result.invoices);
      setTotalCount(result.pagination.total);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "Failed to load invoices.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    void loadInvoices();
  }, [loadInvoices]);

  const issuedCount = useMemo(
    () =>
      invoiceList.filter((invoice) => invoice.status === "ISSUED")
        .length,
    [invoiceList],
  );

  const paidCount = useMemo(
    () =>
      invoiceList.filter((invoice) => invoice.status === "PAID")
        .length,
    [invoiceList],
  );

  const totalRevenue = useMemo(
    () =>
      invoiceList
        .filter((invoice) => invoice.status !== "CANCELLED")
        .reduce((sum, invoice) => sum + invoice.grandTotal, 0),
    [invoiceList],
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  if (loading && invoiceList.length === 0) {
    return <LoadingState message="Loading invoices..." />;
  }

  if (error && invoiceList.length === 0) {
    return (
      <ErrorState
        title="Unable to load invoices"
        description={error}
        onRetry={() => void loadInvoices()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="View and manage invoices generated from sales challans."
      />

      {/* Summary Cards */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-slate-500">Total Invoices</p>

              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {totalCount}
              </p>
            </div>
          </div>
        </div>

        {/* Issued */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <FileCheck2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-slate-500">Issued</p>

              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {issuedCount}
              </p>
            </div>
          </div>
        </div>

        {/* Paid */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Paid</p>

          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {paidCount}
          </p>
        </div>

        {/* Revenue */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
              <IndianRupee className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-slate-500">Invoice Value</p>

              <p className="mt-1 text-2xl font-semibold text-slate-900">
                ₹
                {totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice List */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search invoice or customer..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 sm:w-80"
            />
          </div>

          {/* Status */}

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
            <option value="ISSUED">Issued</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">
              {invoiceList.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-600">
              {totalCount}
            </span>{" "}
            invoices
          </p>

          {loading && (
            <span className="text-xs text-slate-400">Updating...</span>
          )}
        </div>

        {invoiceList.length > 0 ? (
          <InvoiceTable
            invoices={invoiceList}
            onView={(invoice) => setSelectedInvoice(invoice)}
          />
        ) : (
          <div className="px-5 py-16 text-center">
            <p className="text-sm font-semibold text-slate-800">
              No invoices found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filter.
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

      {/* Details Modal */}

      <InvoiceDetails
        invoice={selectedInvoice}
        open={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}
