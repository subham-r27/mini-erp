import {
    ArrowDownLeft,
    ArrowUpRight,
  } from "lucide-react";
  
  import type {
    StockMovement,
  } from "../../types";
  
  interface MovementTableProps {
    movements: StockMovement[];
  }
  
  export default function MovementTable({
    movements,
  }: MovementTableProps) {
    return (
      <>
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Product
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Movement
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Quantity
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Reason
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Created By
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Timestamp
                </th>
              </tr>
            </thead>
  
            <tbody className="divide-y divide-slate-100">
              {movements.map((movement) => {
                const isIn =
                  movement.movementType ===
                  "IN";
  
                return (
                  <tr
                    key={movement.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {movement.productName}
                      </p>
  
                      <p className="mt-0.5 text-xs text-slate-400">
                        {movement.sku}
                      </p>
                    </td>
  
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          isIn
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {isIn ? (
                          <ArrowDownLeft className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        )}
  
                        {isIn
                          ? "STOCK IN"
                          : "STOCK OUT"}
                      </span>
                    </td>
  
                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                      {isIn ? "+" : "-"}
                      {movement.quantity}
                    </td>
  
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {movement.reason}
                    </td>
  
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {movement.createdBy}
                    </td>
  
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {movement.createdAt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
  
        {/* Mobile */}
  
        <div className="divide-y divide-slate-100 lg:hidden">
          {movements.map((movement) => {
            const isIn =
              movement.movementType ===
              "IN";
  
            return (
              <div
                key={movement.id}
                className="space-y-3 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {movement.productName}
                    </p>
  
                    <p className="mt-1 text-xs text-slate-400">
                      {movement.sku}
                    </p>
                  </div>
  
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      isIn
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {isIn
                      ? "STOCK IN"
                      : "STOCK OUT"}
                  </span>
                </div>
  
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-400">
                      Quantity
                    </p>
  
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {isIn ? "+" : "-"}
                      {movement.quantity}
                    </p>
                  </div>
  
                  <div>
                    <p className="text-xs text-slate-400">
                      Created By
                    </p>
  
                    <p className="mt-1 text-sm text-slate-700">
                      {movement.createdBy}
                    </p>
                  </div>
                </div>
  
                <div>
                  <p className="text-xs text-slate-400">
                    Reason
                  </p>
  
                  <p className="mt-1 text-sm text-slate-700">
                    {movement.reason}
                  </p>
                </div>
  
                <p className="text-xs text-slate-400">
                  {movement.createdAt}
                </p>
              </div>
            );
          })}
        </div>
      </>
    );
  }