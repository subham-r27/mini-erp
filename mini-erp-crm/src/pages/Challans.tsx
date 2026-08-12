import {
    FileText,
    Plus,
    Search,
  } from "lucide-react";
  
  import {
    useMemo,
    useState,
  } from "react";
  
  import PageHeader from "../components/common/PageHeader";
  import Button from "../components/ui/Button";
  import Modal from "../components/ui/Modal";
  
  import ChallanForm from "../components/challans/ChallanForm";
  import ChallanTable from "../components/challans/ChallanTable";
  import ChallanDetails from "../components/challans/ChallanDetails";
  
  import {
    challans as initialChallans,
    customers,
    products,
  } from "../data/mockData";
  
  import type {
    Challan,
  } from "../types";
  
  export default function Challans() {
    const [challanList, setChallanList] =
      useState<Challan[]>(
        initialChallans,
      );
  
    const [search, setSearch] =
      useState("");
  
    const [statusFilter, setStatusFilter] =
      useState("ALL");
  
    const [formOpen, setFormOpen] =
      useState(false);
  
    const [selectedChallan, setSelectedChallan] =
      useState<Challan | null>(
        null,
      );
  
    const filteredChallans =
      useMemo(() => {
        const query =
          search.trim().toLowerCase();
  
        return challanList.filter(
          (challan) => {
            const matchesSearch =
              !query ||
              challan.challanNumber
                .toLowerCase()
                .includes(query) ||
              challan.customerName
                .toLowerCase()
                .includes(query) ||
              (
                challan.businessName ||
                ""
              )
                .toLowerCase()
                .includes(query);
  
            const matchesStatus =
              statusFilter === "ALL" ||
              challan.status ===
                statusFilter;
  
            return (
              matchesSearch &&
              matchesStatus
            );
          },
        );
      }, [
        challanList,
        search,
        statusFilter,
      ]);
  
    const draftCount =
      challanList.filter(
        (challan) =>
          challan.status === "DRAFT",
      ).length;
  
    const confirmedCount =
      challanList.filter(
        (challan) =>
          challan.status ===
          "CONFIRMED",
      ).length;
  
    const cancelledCount =
      challanList.filter(
        (challan) =>
          challan.status ===
          "CANCELLED",
      ).length;
  
    const handleSaveDraft = (
      challan: Challan,
    ) => {
      setChallanList((previous) => [
        challan,
        ...previous,
      ]);
  
      setFormOpen(false);
    };
  
    const handleConfirm = (
      challan: Challan,
    ) => {
      setChallanList((previous) => [
        challan,
        ...previous,
      ]);
  
      setFormOpen(false);
    };
  
    return (
      <div className="space-y-6">
        <PageHeader
          title="Sales Challans"
          description="Create, manage and track sales challans."
          action={
            <Button
              onClick={() =>
                setFormOpen(true)
              }
            >
              <Plus className="h-4 w-4" />
              Create Challan
            </Button>
          }
        />
  
        {/* Summary */}
  
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
  
              <div>
                <p className="text-sm text-slate-500">
                  Total Challans
                </p>
  
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {
                    challanList.length
                  }
                </p>
              </div>
            </div>
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Draft
            </p>
  
            <p className="mt-2 text-2xl font-semibold text-amber-600">
              {draftCount}
            </p>
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Confirmed
            </p>
  
            <p className="mt-2 text-2xl font-semibold text-emerald-600">
              {confirmedCount}
            </p>
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Cancelled
            </p>
  
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
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search challan or customer..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 sm:w-80"
              />
            </div>
  
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
  
              <option value="CONFIRMED">
                Confirmed
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
                  filteredChallans.length
                }
              </span>{" "}
              challans
            </p>
          </div>
  
          {filteredChallans.length > 0 ? (
            <ChallanTable
              challans={
                filteredChallans
              }
              onView={(challan) =>
                setSelectedChallan(
                  challan,
                )
              }
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
        </div>
  
        {/* Create Challan */}
  
        <Modal
          open={formOpen}
          onClose={() =>
            setFormOpen(false)
          }
          title="Create Sales Challan"
          description="Select a customer and add products."
          size="lg"
        >
          <ChallanForm
            customers={customers}
            products={products}
            onSaveDraft={
              handleSaveDraft
            }
            onConfirm={
              handleConfirm
            }
            onCancel={() =>
              setFormOpen(false)
            }
          />
        </Modal>
  
        {/* Details */}
  
        <ChallanDetails
          challan={selectedChallan}
          open={Boolean(
            selectedChallan,
          )}
          onClose={() =>
            setSelectedChallan(null)
          }
        />
      </div>
    );
  }