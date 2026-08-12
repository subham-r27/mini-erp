import Modal from "../ui/Modal";

import type {
  Challan,
} from "../../types";

import ChallanStatusBadge from "./ChallanStatusBadge";

interface ChallanDetailsProps {
  challan: Challan | null;
  open: boolean;
  onClose: () => void;
}

export default function ChallanDetails({
  challan,
  open,
  onClose,
}: ChallanDetailsProps) {
  if (!challan) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={challan.challanNumber}
      description="Sales challan details"
      size="lg"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-slate-400">
              Customer
            </p>

            <p className="mt-1 text-lg font-semibold text-slate-900">
              {
                challan.customerName
              }
            </p>

            {challan.businessName && (
              <p className="mt-1 text-sm text-slate-500">
                {
                  challan.businessName
                }
              </p>
            )}
          </div>

          <ChallanStatusBadge
            status={challan.status}
          />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Products
          </h3>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="hidden grid-cols-5 gap-4 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-400 sm:grid">
              <span className="col-span-2">
                Product
              </span>

              <span>Qty</span>

              <span>Price</span>

              <span className="text-right">
                Total
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {challan.items.map(
                (item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 px-4 py-4 sm:grid-cols-5 sm:gap-4"
                  >
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-slate-800">
                        {
                          item.productName
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.sku}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 sm:hidden">
                        Quantity
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {
                          item.quantity
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 sm:hidden">
                        Unit Price
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        ₹
                        {item.unitPrice.toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs text-slate-400 sm:hidden">
                        Total
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        ₹
                        {item.lineTotal.toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="ml-auto max-w-sm space-y-3 rounded-xl bg-slate-50 p-5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              Quantity
            </span>

            <span className="font-medium text-slate-800">
              {
                challan.totalQuantity
              }
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              Subtotal
            </span>

            <span className="font-medium text-slate-800">
              ₹
              {challan.subtotal.toLocaleString(
                "en-IN",
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              Tax ({challan.taxRate}%)
            </span>

            <span className="font-medium text-slate-800">
              ₹
              {challan.taxAmount.toLocaleString(
                "en-IN",
              )}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-900">
                Grand Total
              </span>

              <span className="text-lg font-bold text-slate-900">
                ₹
                {challan.grandTotal.toLocaleString(
                  "en-IN",
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-400">
              Created By
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {challan.createdBy}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Created At
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {challan.createdAt}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}