import {
    Eye,
    MoreHorizontal,
    Pencil,
  } from "lucide-react";
  
  import type {
    Customer,
  } from "../../types";
  
  import CustomerStatusBadge from "./CustomerStatusBadge";
  import CustomerTypeBadge from "./CustomerTypeBadge";
  
  interface CustomerTableProps {
    customers: Customer[];
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
  }
  
  export default function CustomerTable({
    customers,
    onView,
    onEdit,
  }: CustomerTableProps) {
    return (
      <>
        {/* Desktop */}
  
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Customer
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Contact
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Type
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Follow-up
                </th>
  
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
  
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="group transition hover:bg-slate-50"
                >
                  {/* Customer */}
  
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-semibold text-blue-700">
                        {customer.businessName
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
  
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {customer.businessName}
                        </p>
  
                        <p className="mt-0.5 text-xs text-slate-400">
                          {customer.customerName}
                        </p>
                      </div>
                    </div>
                  </td>
  
                  {/* Contact */}
  
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">
                      {customer.mobile}
                    </p>
  
                    <p className="mt-0.5 text-xs text-slate-400">
                      {customer.email}
                    </p>
                  </td>
  
                  {/* Type */}
  
                  <td className="px-5 py-4">
                    <CustomerTypeBadge
                      type={customer.customerType}
                    />
                  </td>
  
                  {/* Status */}
  
                  <td className="px-5 py-4">
                    <CustomerStatusBadge
                      status={customer.status}
                    />
                  </td>
  
                  {/* Follow-up */}
  
                  <td className="px-5 py-4">
                    {customer.followUpDate ? (
                      <span className="text-sm text-slate-600">
                        {new Date(
                          customer.followUpDate,
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">
                        —
                      </span>
                    )}
                  </td>
  
                  {/* Actions */}
  
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() =>
                          onView(customer)
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                        title="View customer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
  
                      <button
                        onClick={() =>
                          onEdit(customer)
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        title="Edit customer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
  
                      <button
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        title="More actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Mobile */}
  
        <div className="divide-y divide-slate-100 lg:hidden">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-semibold text-blue-700">
                    {customer.businessName
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
  
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {customer.businessName}
                    </p>
  
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {customer.customerName}
                    </p>
                  </div>
                </div>
  
                <CustomerStatusBadge
                  status={customer.status}
                />
              </div>
  
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">
                    Mobile
                  </p>
  
                  <p className="mt-1 text-slate-700">
                    {customer.mobile}
                  </p>
                </div>
  
                <div>
                  <p className="text-xs text-slate-400">
                    Type
                  </p>
  
                  <div className="mt-1">
                    <CustomerTypeBadge
                      type={customer.customerType}
                    />
                  </div>
                </div>
              </div>
  
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() =>
                    onView(customer)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
  
                <button
                  onClick={() =>
                    onEdit(customer)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }