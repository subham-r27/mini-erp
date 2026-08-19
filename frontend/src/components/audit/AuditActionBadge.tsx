import type {
    AuditAction,
  } from "../../types";
  
  interface AuditActionBadgeProps {
    action: AuditAction;
  }
  
  const actionConfig: Record<
    AuditAction,
    {
      label: string;
      className: string;
    }
  > = {
    CREATE: {
      label: "Create",
      className:
        "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
  
    UPDATE: {
      label: "Update",
      className:
        "bg-blue-50 text-blue-700 ring-blue-200",
    },
  
    DELETE: {
      label: "Delete",
      className:
        "bg-red-50 text-red-700 ring-red-200",
    },
  
    LOGIN: {
      label: "Login",
      className:
        "bg-indigo-50 text-indigo-700 ring-indigo-200",
    },
  
    LOGOUT: {
      label: "Logout",
      className:
        "bg-slate-100 text-slate-600 ring-slate-200",
    },
  
    VIEW: {
      label: "View",
      className:
        "bg-amber-50 text-amber-700 ring-amber-200",
    },
  };
  
  export default function AuditActionBadge({
    action,
  }: AuditActionBadgeProps) {
    const config =
      actionConfig[action];
  
    return (
      <span
        className={`
          inline-flex items-center
          rounded-lg px-2.5 py-1
          text-xs font-medium
          ring-1
          ${config.className}
        `}
      >
        {config.label}
      </span>
    );
  }