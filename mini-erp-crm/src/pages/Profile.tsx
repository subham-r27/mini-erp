import {
    CalendarDays,
    Mail,
    Phone,
    ShieldCheck,
    UserRound,
  } from "lucide-react";
  
  import {
    useAuth,
  } from "../context/AuthContext";
  
  export default function Profile() {
    const {
      user,
    } = useAuth();
  
    if (!user) {
      return null;
    }
  
    const initials =
      user.name
        .split(" ")
        .map(
          (part) =>
            part[0],
        )
        .slice(0, 2)
        .join("");
  
    const roleLabel =
      user.role === "ADMIN"
        ? "Administrator"
        : user.role ===
          "SALES"
        ? "Sales"
        : user.role ===
          "WAREHOUSE"
        ? "Warehouse"
        : "Accounts";
  
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            My Profile
          </h1>
  
          <p className="mt-1 text-sm text-slate-500">
            View your account information
            and role details.
          </p>
        </div>
  
        {/* Profile header */}
  
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-600" />
  
          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-md">
                  {initials}
                </div>
  
                <div className="pb-1">
                  <h2 className="text-xl font-bold text-slate-900">
                    {user.name}
                  </h2>
  
                  <p className="text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>
  
              <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {user.status ===
                "ACTIVE"
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>
          </div>
        </div>
  
        {/* Information */}
  
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <UserRound className="h-5 w-5" />
              </div>
  
              <div>
                <h3 className="font-semibold text-slate-900">
                  Personal Information
                </h3>
  
                <p className="text-xs text-slate-500">
                  Your basic account details.
                </p>
              </div>
            </div>
  
            <div className="mt-6 space-y-5">
              <InfoRow
                icon={UserRound}
                label="Full Name"
                value={user.name}
              />
  
              <InfoRow
                icon={Mail}
                label="Email"
                value={user.email}
              />
  
              <InfoRow
                icon={Phone}
                label="Phone"
                value={
                  user.phone ||
                  "Not provided"
                }
              />
            </div>
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
  
              <div>
                <h3 className="font-semibold text-slate-900">
                  Access Information
                </h3>
  
                <p className="text-xs text-slate-500">
                  Your ERP access details.
                </p>
              </div>
            </div>
  
            <div className="mt-6 space-y-5">
              <InfoRow
                icon={ShieldCheck}
                label="Role"
                value={roleLabel}
              />
  
              <InfoRow
                icon={CalendarDays}
                label="Account Created"
                value={user.createdAt || "Not available"}
              />
  
              <InfoRow
                icon={CalendarDays}
                label="Last Login"
                value={
                  user.lastLogin ||
                  "Not available"
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  interface InfoRowProps {
    icon: React.ElementType;
    label: string;
    value: string;
  }
  
  function InfoRow({
    icon: Icon,
    label,
    value,
  }: InfoRowProps) {
    return (
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-slate-400" />
  
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>
  
          <p className="mt-0.5 text-sm font-medium text-slate-700">
            {value}
          </p>
        </div>
      </div>
    );
  }