import type {
    UserStatus,
  } from "../../types";
  
  interface UserStatusBadgeProps {
    status: UserStatus;
  }
  
  export default function UserStatusBadge({
    status,
  }: UserStatusBadgeProps) {
    const active =
      status === "ACTIVE";
  
    return (
      <span
        className={`
          inline-flex items-center gap-1.5
          rounded-lg
          px-2.5 py-1
          text-xs font-medium
          ring-1
          ${
            active
              ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20"
              : "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20"
          }
        `}
      >
        <span
          className={`
            h-1.5 w-1.5 rounded-full
            ${
              active
                ? "bg-emerald-400"
                : "bg-zinc-500"
            }
          `}
        />
  
        {active
          ? "Active"
          : "Inactive"}
      </span>
    );
  }