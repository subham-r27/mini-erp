import {
    FileCheck2,
    FileText,
    IndianRupee,
    Search,
  } from "lucide-react";
  
  import {
    useMemo,
    useState,
  } from "react";
  
  import PageHeader from "../components/common/PageHeader";
  
  import InvoiceTable from "../components/invoices/InvoiceTable";
  import InvoiceDetails from "../components/invoices/InvoiceDetails";
  
  import {
    invoices as initialInvoices,
  } from "../data/mockData";
  
  import type {
    Invoice,
  } from "../types";
  
  export default function Invoices() {
    const [invoiceList] =
      useState<Invoice[]>(
        initialInvoices,
      );
  
    const [search, setSearch] =
      useState("");
  
    const [statusFilter, setStatusFilter] =
      useState("ALL");
  
    const [selectedInvoice, setSelectedInvoice] =
      useState<Invoice | null>(
        null,
      );
  
    const filteredInvoices =
      useMemo(() => {
        const query =
          search.trim().toLowerCase();
  
        return invoiceList.filter(
          (invoice) => {
            const matchesSearch =
              !query ||
              invoice.invoiceNumber
                .toLowerCase()
                .includes(query) ||
              invoice.customerName
                .toLowerCase()
                .includes(query) ||
              invoice.challanNumber
                .toLowerCase()
                .includes(query);
  
            const matchesStatus =
              statusFilter === "ALL" ||
              invoice.status ===
                statusFilter;
  
            return (
              matchesSearch &&
              matchesStatus
            );
          },
        );
      }, [
        invoiceList,
        search,
        statusFilter,
      ]);
  
    const issuedCount =
      invoiceList.filter(
        (invoice) =>
          invoice.status ===
          "ISSUED",
      ).length;
  
    const paidCount =
      invoiceList.filter(
        (invoice) =>
          invoice.status ===
          "PAID",
      ).length;
  
    const totalRevenue =
      invoiceList
        .filter(
          (invoice) =>
            invoice.status !==
            "CANCELLED",
        )
        .reduce(
          (sum, invoice) =>
            sum + invoice.grandTotal,
          0,
        );
  
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
                <p className="text-sm text-slate-500">
                  Total Invoices
                </p>
  
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {invoiceList.length}
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
                <p className="text-sm text-slate-500">
                  Issued
                </p>
  
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {issuedCount}
                </p>
              </div>
            </div>
          </div>
  
          {/* Paid */}
  
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Paid
            </p>
  
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
                <p className="text-sm text-slate-500">
                  Invoice Value
                </p>
  
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  ₹
                  {totalRevenue.toLocaleString(
                    "en-IN",
                  )}
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
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search invoice or customer..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 sm:w-80"
              />
            </div>
  
            {/* Status */}
  
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value,
                )
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
            >
              <option value="ALL">
                All statuses
              </option>
  
              <option value="DRAFT">
                Draft
              </option>
  
              <option value="ISSUED">
                Issued
              </option>
  
              <option value="PAID">
                Paid
              </option>
  
              <option value="CANCELLED">
                Cancelled
              </option>
            </select>
          </div>
  
          <div className="border-b border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600">
                {
                  filteredInvoices.length
                }
              </span>{" "}
              invoices
            </p>
          </div>
  
          {filteredInvoices.length > 0 ? (
            <InvoiceTable
              invoices={
                filteredInvoices
              }
              onView={(invoice) =>
                setSelectedInvoice(
                  invoice,
                )
              }
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
        </div>
  
        {/* Details Modal */}
  
        <InvoiceDetails
          invoice={selectedInvoice}
          open={Boolean(
            selectedInvoice,
          )}
          onClose={() =>
            setSelectedInvoice(null)
          }
        />
      </div>
    );
  }