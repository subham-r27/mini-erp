import type {
    UserRole,
  } from "../../types";
  
  interface UserRoleBadgeProps {
    role: UserRole;
  }
  
  const roleConfig: Record<
    UserRole,
    {
      label: string;
      className: string;
    }
  > = {
    ADMIN: {
      label: "Admin",
      className:
        "bg-violet-500/10 text-violet-300 ring-violet-500/20",
    },
  
    SALES: {
      label: "Sales",
      className:
        "bg-blue-500/10 text-blue-300 ring-blue-500/20",
    },
  
    WAREHOUSE: {
      label: "Warehouse",
      className:
        "bg-amber-500/10 text-amber-300 ring-amber-500/20",
    },
  
    ACCOUNTS: {
      label: "Accounts",
      className:
        "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
    },
  };
  
  export default function UserRoleBadge({
    role,
  }: UserRoleBadgeProps) {
    const config =
      roleConfig[role];
  
    return (
      <span
        className={`
          inline-flex items-center
          rounded-lg
          px-2.5 py-1
          text-xs font-medium
          ring-1
          ${config.className}
        `}
      >
        {config.label}
      </span>
    );
  }