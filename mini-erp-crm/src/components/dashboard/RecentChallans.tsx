import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

import { challans } from "../../data/mockData";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function RecentChallans() {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <h2 className="font-semibold text-slate-900">
            Recent Challans
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest sales activity
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={() => navigate("/challans")}
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop table */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                Challan
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                Customer
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                Amount
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                Date
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {challans.map((challan) => (
              <tr
                key={challan.id}
                className="transition hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-800">
                    {challan.challanNumber}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-slate-700">
                    {challan.customerName}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-800">
                    ₹
                    {challan.grandTotal.toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <Badge
                    variant={
                      challan.status === "CONFIRMED"
                        ? "success"
                        : challan.status === "DRAFT"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {challan.status}
                  </Badge>
                </td>

                <td className="px-5 py-4 text-sm text-slate-500">
                  {challan.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}

      <div className="divide-y divide-slate-100 md:hidden">
        {challans.map((challan) => (
          <div
            key={challan.id}
            className="space-y-3 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {challan.challanNumber}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {challan.customerName}
                </p>
              </div>

              <Badge
                variant={
                  challan.status === "CONFIRMED"
                    ? "success"
                    : challan.status === "DRAFT"
                      ? "warning"
                      : "danger"
                }
              >
                {challan.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {challan.createdAt}
              </span>

              <span className="text-sm font-semibold text-slate-800">
                ₹
                {challan.grandTotal.toLocaleString(
                  "en-IN",
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}