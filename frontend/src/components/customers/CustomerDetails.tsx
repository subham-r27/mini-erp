import {
    CalendarDays,
    Mail,
    MapPin,
    Phone,
    Plus,
  } from "lucide-react";
  
  import type {
    Customer,
  } from "../../types";
  
  import Modal from "../ui/Modal";
  import Button from "../ui/Button";
  import CustomerStatusBadge from "./CustomerStatusBadge";
  import CustomerTypeBadge from "./CustomerTypeBadge";
  
  interface CustomerDetailsProps {
    customer: Customer | null;
    open: boolean;
    onClose: () => void;
    onAddFollowUp?: () => void;
  }
  
  export default function CustomerDetails({
    customer,
    open,
    onClose,
    onAddFollowUp,
  }: CustomerDetailsProps) {
    if (!customer) {
      return null;
    }
  
    return (
      <Modal
        open={open}
        onClose={onClose}
        title="Customer Details"
        description="View customer information and follow-up history."
        size="xl"
      >
        <div className="space-y-6">
          {/* Profile */}
  
          <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">
              {customer.businessName
                .slice(0, 2)
                .toUpperCase()}
            </div>
  
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  {customer.businessName}
                </h3>
  
                <CustomerStatusBadge
                  status={customer.status}
                />
  
                <CustomerTypeBadge
                  type={customer.customerType}
                />
              </div>
  
              <p className="mt-1 text-sm text-slate-500">
                {customer.customerName}
              </p>
            </div>
  
            {customer.followUpDate && (
              <div className="rounded-xl border border-blue-100 bg-white px-4 py-3">
                <p className="text-xs text-slate-400">
                  Next follow-up
                </p>
  
                <p className="mt-1 text-sm font-semibold text-blue-700">
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
                </p>
              </div>
            )}
          </div>
  
          {/* Contact */}
  
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Contact Information
            </h3>
  
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="h-4 w-4" />
  
                  <span className="text-xs">
                    Mobile
                  </span>
                </div>
  
                <p className="mt-2 text-sm font-medium text-slate-800">
                  {customer.mobile}
                </p>
              </div>
  
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="h-4 w-4" />
  
                  <span className="text-xs">
                    Email
                  </span>
                </div>
  
                <p className="mt-2 break-all text-sm font-medium text-slate-800">
                  {customer.email}
                </p>
              </div>
  
              <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-4 w-4" />
  
                  <span className="text-xs">
                    Address
                  </span>
                </div>
  
                <p className="mt-2 text-sm font-medium text-slate-800">
                  {customer.address}
                </p>
              </div>
            </div>
          </div>
  
          {/* Business */}
  
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Business Information
            </h3>
  
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-400">
                  GST Number
                </p>
  
                <p className="mt-2 text-sm font-medium text-slate-800">
                  {customer.gstNumber || "Not provided"}
                </p>
              </div>
  
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-400">
                  Customer Type
                </p>
  
                <div className="mt-2">
                  <CustomerTypeBadge
                    type={customer.customerType}
                  />
                </div>
              </div>
            </div>
          </div>
  
          {/* Notes */}
  
          {customer.notes && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Notes
              </h3>
  
              <div className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                {customer.notes}
              </div>
            </div>
          )}
  
          {/* Follow-ups */}
  
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Follow-up History
                </h3>
  
                <p className="mt-1 text-xs text-slate-500">
                  Notes and previous customer interactions.
                </p>
              </div>
  
              {onAddFollowUp && (
                <Button onClick={onAddFollowUp}>
                  <Plus className="h-4 w-4" />
                  Add Follow-up
                </Button>
              )}
            </div>
  
            <div className="mt-4 space-y-3">
              {customer.followUps &&
              customer.followUps.length > 0 ? (
                customer.followUps.map(
                  (followUp) => (
                    <div
                      key={followUp.id}
                      className="relative border-l-2 border-blue-100 pl-4"
                    >
                      <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-blue-600" />
  
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-medium text-slate-800">
                          {followUp.note}
                        </p>
  
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <CalendarDays className="h-3.5 w-3.5" />
  
                          {followUp.followUpDate}
                        </div>
                      </div>
  
                      <p className="mt-1 text-xs text-slate-400">
                        Added by {followUp.createdBy} ·{" "}
                        {followUp.createdAt}
                      </p>
                    </div>
                  ),
                )
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                  <p className="text-sm text-slate-500">
                    No follow-ups recorded yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    );
  }