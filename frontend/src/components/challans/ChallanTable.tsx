import {
    Eye,
  } from "lucide-react";
  
  import type {
    Challan,
  } from "../../types";
  
  import ChallanStatusBadge from "./ChallanStatusBadge";
  
  interface ChallanTableProps {
    challans: Challan[];
  
    onView: (
      challan: Challan,
    ) => void;
  }
  
  export default function ChallanTable({
    challans,
    onView,
  }: ChallanTableProps) {
    return (
      <>
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Challan
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Customer
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Items
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>
  
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Action
                </th>
              </tr>
            </thead>
  
            <tbody className="divide-y divide-slate-100">
              {challans.map(
                (challan) => (
                  <tr
                    key={challan.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {
                          challan.challanNumber
                        }
                      </p>
  
                      <p className="mt-1 text-xs text-slate-400">
                        {
                          challan.createdAt
                        }
                      </p>
                    </td>
  
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-800">
                        {
                          challan.customerName
                        }
                      </p>
  
                      <p className="mt-1 text-xs text-slate-400">
                        {
                          challan.businessName
                        }
                      </p>
                    </td>
  
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {
                        challan.items.length
                      }{" "}
                      products
                    </td>
  
                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                      ₹
                      {challan.grandTotal.toLocaleString(
                        "en-IN",
                      )}
                    </td>
  
                    <td className="px-5 py-4">
                      <ChallanStatusBadge
                        status={
                          challan.status
                        }
                      />
                    </td>
  
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            onView(
                              challan,
                            )
                          }
                          className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
  
        <div className="divide-y divide-slate-100 lg:hidden">
          {challans.map(
            (challan) => (
              <div
                key={challan.id}
                className="p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {
                        challan.challanNumber
                      }
                    </p>
  
                    <p className="mt-1 text-xs text-slate-400">
                      {
                        challan.customerName
                      }
                    </p>
                  </div>
  
                  <ChallanStatusBadge
                    status={
                      challan.status
                    }
                  />
                </div>
  
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      Products
                    </p>
  
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {
                        challan.items
                          .length
                      }
                    </p>
                  </div>
  
                  <div>
                    <p className="text-xs text-slate-400">
                      Total
                    </p>
  
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      ₹
                      {challan.grandTotal.toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                </div>
  
                <button
                  type="button"
                  onClick={() =>
                    onView(
                      challan,
                    )
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  <Eye className="h-4 w-4" />
                  View Challan
                </button>
              </div>
            ),
          )}
        </div>
      </>
    );
  }