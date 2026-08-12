import {
    Download,
    Printer,
  } from "lucide-react";
  
  import type {
    Invoice,
  } from "../../types";
  
  import Modal from "../ui/Modal";
  import Button from "../ui/Button";
  
  import InvoiceStatusBadge from "./InvoiceStatusBadge";
  
  interface InvoiceDetailsProps {
    invoice: Invoice | null;
    open: boolean;
    onClose: () => void;
  }
  
  export default function InvoiceDetails({
    invoice,
    open,
    onClose,
  }: InvoiceDetailsProps) {
    if (!invoice) {
      return null;
    }
  
    return (
      <Modal
        open={open}
        onClose={onClose}
        title={invoice.invoiceNumber}
        description="Invoice details"
        size="lg"
      >
        <div className="space-y-6">
          {/* Header */}
  
          <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Invoice
              </p>
  
              <h3 className="mt-1 text-xl font-bold text-slate-900">
                {invoice.invoiceNumber}
              </h3>
  
              <p className="mt-2 text-sm text-slate-500">
                Challan:{" "}
                <span className="font-medium text-slate-700">
                  {invoice.challanNumber}
                </span>
              </p>
            </div>
  
            <InvoiceStatusBadge
              status={invoice.status}
            />
          </div>
  
          {/* Customer */}
  
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Bill To
              </p>
  
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {invoice.customerName}
              </p>
  
              {invoice.businessName && (
                <p className="mt-1 text-sm text-slate-500">
                  {invoice.businessName}
                </p>
              )}
            </div>
  
            <div className="sm:text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Invoice Date
              </p>
  
              <p className="mt-2 text-sm font-medium text-slate-700">
                {invoice.createdAt}
              </p>
  
              {invoice.dueDate && (
                <>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                    Due Date
                  </p>
  
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {invoice.dueDate}
                  </p>
                </>
              )}
            </div>
          </div>
  
          {/* Items */}
  
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Invoice Items
            </h3>
  
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="hidden grid-cols-6 gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:grid">
                <span className="col-span-2">
                  Product
                </span>
  
                <span>SKU</span>
  
                <span>Qty</span>
  
                <span>Price</span>
  
                <span className="text-right">
                  Total
                </span>
              </div>
  
              <div className="divide-y divide-slate-100">
                {invoice.items.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="grid gap-3 px-4 py-4 sm:grid-cols-6 sm:gap-3"
                    >
                      <div className="sm:col-span-2">
                        <p className="text-sm font-medium text-slate-800">
                          {item.productName}
                        </p>
                      </div>
  
                      <div>
                        <p className="text-xs text-slate-400 sm:hidden">
                          SKU
                        </p>
  
                        <p className="mt-1 text-sm text-slate-600">
                          {item.sku}
                        </p>
                      </div>
  
                      <div>
                        <p className="text-xs text-slate-400 sm:hidden">
                          Quantity
                        </p>
  
                        <p className="mt-1 text-sm text-slate-600">
                          {item.quantity}
                        </p>
                      </div>
  
                      <div>
                        <p className="text-xs text-slate-400 sm:hidden">
                          Unit Price
                        </p>
  
                        <p className="mt-1 text-sm text-slate-600">
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
  
          {/* Totals */}
  
          <div className="ml-auto max-w-sm rounded-2xl bg-slate-50 p-5">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Subtotal
                </span>
  
                <span className="font-medium text-slate-800">
                  ₹
                  {invoice.subtotal.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
  
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  GST ({invoice.taxRate}%)
                </span>
  
                <span className="font-medium text-slate-800">
                  ₹
                  {invoice.taxAmount.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
  
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">
                    Grand Total
                  </span>
  
                  <span className="text-xl font-bold text-slate-900">
                    ₹
                    {invoice.grandTotal.toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
  
          {/* Actions */}
  
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                window.print()
              }
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
  
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                window.print()
              }
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </Modal>
    );
  }