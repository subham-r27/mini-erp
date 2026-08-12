import {
    Clock3,
    Globe,
    UserRound,
    X,
  } from "lucide-react";
  
  import type {
    AuditLog,
  } from "../../types";
  
  import AuditActionBadge from "./AuditActionBadge";
  import AuditStatusBadge from "./AuditStatusBadge";
  
  interface AuditLogDetailsProps {
    log: AuditLog | null;
    onClose: () => void;
  }
  
  export default function AuditLogDetails({
    log,
    onClose,
  }: AuditLogDetailsProps) {
    if (!log) {
      return null;
    }
  
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
  
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Activity Details
              </h2>
  
              <p className="mt-0.5 text-xs text-slate-400">
                {log.id}
              </p>
            </div>
  
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
  
          {/* Content */}
  
          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Description
              </p>
  
              <p className="mt-1 text-sm font-medium text-slate-800">
                {log.description}
              </p>
            </div>
  
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-slate-400">
                  Action
                </p>
  
                <AuditActionBadge
                  action={log.action}
                />
              </div>
  
              <div>
                <p className="mb-2 text-xs text-slate-400">
                  Status
                </p>
  
                <AuditStatusBadge
                  status={log.status}
                />
              </div>
            </div>
  
            <div className="space-y-4 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <UserRound className="h-4 w-4 text-slate-400" />
  
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    User
                  </p>
  
                  <p className="text-sm font-medium text-slate-700">
                    {log.userName}
                  </p>
                </div>
              </div>
  
              <div className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 text-slate-400" />
  
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Timestamp
                  </p>
  
                  <p className="text-sm font-medium text-slate-700">
                    {log.timestamp}
                  </p>
                </div>
              </div>
  
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-slate-400" />
  
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    IP Address
                  </p>
  
                  <p className="text-sm font-medium text-slate-700">
                    {log.ipAddress ||
                      "Not available"}
                  </p>
                </div>
              </div>
            </div>
  
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Module
                </p>
  
                <p className="mt-0.5 text-sm font-semibold text-slate-700">
                  {log.module}
                </p>
              </div>
  
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }