import {
    Activity,
    CalendarDays,
    Eye,
    Search,
    ShieldCheck,
    Trash2,
  } from "lucide-react";
  
  import {
    useMemo,
    useState,
  } from "react";
  
  import {
    auditLogs as initialAuditLogs,
  } from "../data/mockData";
  
  import type {
    AuditAction,
    AuditLog,
  } from "../types";
  
  import AuditActionBadge from "../components/audit/AuditActionBadge";
  import AuditLogDetails from "../components/audit/AuditLogDetails";
  import AuditStatusBadge from "../components/audit/AuditStatusBadge";
  
  export default function AuditLogs() {
    const [logs] =
      useState<AuditLog[]>(
        initialAuditLogs,
      );
  
    const [search, setSearch] =
      useState("");
  
    const [actionFilter, setActionFilter] =
      useState<
        AuditAction | "ALL"
      >("ALL");
  
    const [moduleFilter, setModuleFilter] =
      useState("ALL");
  
    const [selectedLog, setSelectedLog] =
      useState<AuditLog | null>(
        null,
      );
  
    const filteredLogs =
      useMemo(() => {
        const query =
          search
            .trim()
            .toLowerCase();
  
        return logs.filter(
          (log) => {
            const matchesSearch =
              !query ||
              log.userName
                .toLowerCase()
                .includes(query) ||
              log.description
                .toLowerCase()
                .includes(query) ||
              log.id
                .toLowerCase()
                .includes(query);
  
            const matchesAction =
              actionFilter === "ALL" ||
              log.action ===
                actionFilter;
  
            const matchesModule =
              moduleFilter === "ALL" ||
              log.module ===
                moduleFilter;
  
            return (
              matchesSearch &&
              matchesAction &&
              matchesModule
            );
          },
        );
      }, [
        logs,
        search,
        actionFilter,
        moduleFilter,
      ]);
  
    const todayLogs =
      logs.filter((log) =>
        log.timestamp.startsWith(
          "2026-08-13",
        ),
      ).length;
  
    const createLogs =
      logs.filter(
        (log) =>
          log.action ===
          "CREATE",
      ).length;
  
    const changeLogs =
      logs.filter(
        (log) =>
          log.action ===
            "UPDATE" ||
          log.action === "DELETE",
      ).length;
  
    return (
      <div className="space-y-6">
        {/* Header */}
  
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Audit Logs
          </h1>
  
          <p className="mt-1 text-sm text-slate-500">
            Track important activity
            performed across the ERP.
          </p>
        </div>
  
        {/* Statistics */}
  
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Activity}
            label="Total Activities"
            value={logs.length}
            iconClass="bg-indigo-50 text-indigo-600"
          />
  
          <StatCard
            icon={CalendarDays}
            label="Today's Activities"
            value={todayLogs}
            iconClass="bg-blue-50 text-blue-600"
          />
  
          <StatCard
            icon={ShieldCheck}
            label="Create Actions"
            value={createLogs}
            iconClass="bg-emerald-50 text-emerald-600"
          />
  
          <StatCard
            icon={Trash2}
            label="Updates / Deletes"
            value={changeLogs}
            iconClass="bg-amber-50 text-amber-600"
          />
        </div>
  
        {/* Main card */}
  
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Filters */}
  
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
            {/* Search */}
  
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
  
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search activity..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 sm:w-72"
              />
            </div>
  
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Action */}
  
              <select
                value={actionFilter}
                onChange={(event) =>
                  setActionFilter(
                    event.target
                      .value as
                      | AuditAction
                      | "ALL",
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="ALL">
                  All actions
                </option>
  
                <option value="CREATE">
                  Create
                </option>
  
                <option value="UPDATE">
                  Update
                </option>
  
                <option value="DELETE">
                  Delete
                </option>
  
                <option value="LOGIN">
                  Login
                </option>
  
                <option value="LOGOUT">
                  Logout
                </option>
  
                <option value="VIEW">
                  View
                </option>
              </select>
  
              {/* Module */}
  
              <select
                value={moduleFilter}
                onChange={(event) =>
                  setModuleFilter(
                    event.target.value,
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="ALL">
                  All modules
                </option>
  
                <option value="AUTH">
                  Authentication
                </option>
  
                <option value="CUSTOMERS">
                  Customers
                </option>
  
                <option value="PRODUCTS">
                  Products
                </option>
  
                <option value="INVENTORY">
                  Inventory
                </option>
  
                <option value="CHALLANS">
                  Challans
                </option>
  
                <option value="INVOICES">
                  Invoices
                </option>
  
                <option value="USERS">
                  Users
                </option>
  
                <option value="SETTINGS">
                  Settings
                </option>
              </select>
            </div>
          </div>
  
          {/* Result count */}
  
          <div className="border-b border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600">
                {filteredLogs.length}
              </span>{" "}
              activities
            </p>
          </div>
  
          {/* Desktop table */}
  
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Time
                  </th>
  
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    User
                  </th>
  
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Action
                  </th>
  
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Module
                  </th>
  
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Description
                  </th>
  
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>
  
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>
  
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map(
                  (log) => (
                    <tr
                      key={log.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                        {log.timestamp}
                      </td>
  
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-800">
                          {log.userName}
                        </p>
  
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {log.userId}
                        </p>
                      </td>
  
                      <td className="px-5 py-4">
                        <AuditActionBadge
                          action={
                            log.action
                          }
                        />
                      </td>
  
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-slate-600">
                          {log.module}
                        </span>
                      </td>
  
                      <td className="max-w-xs px-5 py-4">
                        <p className="truncate text-sm text-slate-600">
                          {log.description}
                        </p>
                      </td>
  
                      <td className="px-5 py-4">
                        <AuditStatusBadge
                          status={
                            log.status
                          }
                        />
                      </td>
  
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedLog(
                              log,
                            )
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
  
          {/* Mobile */}
  
          <div className="divide-y divide-slate-100 lg:hidden">
            {filteredLogs.map(
              (log) => (
                <button
                  type="button"
                  key={log.id}
                  onClick={() =>
                    setSelectedLog(
                      log,
                    )
                  }
                  className="block w-full p-4 text-left transition hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {log.userName}
                      </p>
  
                      <p className="mt-1 text-xs text-slate-500">
                        {log.description}
                      </p>
                    </div>
  
                    <AuditActionBadge
                      action={
                        log.action
                      }
                    />
                  </div>
  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        {log.module}
                      </span>
  
                      <span className="text-slate-300">
                        •
                      </span>
  
                      <span className="text-[11px] text-slate-400">
                        {log.timestamp}
                      </span>
                    </div>
  
                    <AuditStatusBadge
                      status={
                        log.status
                      }
                    />
                  </div>
                </button>
              ),
            )}
          </div>
  
          {/* Empty */}
  
          {filteredLogs.length ===
            0 && (
            <div className="px-5 py-16 text-center">
              <p className="text-sm font-semibold text-slate-800">
                No audit activity found
              </p>
  
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search
                or filters.
              </p>
            </div>
          )}
        </div>
  
        {/* Details modal */}
  
        <AuditLogDetails
          log={selectedLog}
          onClose={() =>
            setSelectedLog(null)
          }
        />
      </div>
    );
  }
  
  /* =========================================================
     STAT CARD
     ========================================================= */
  
  interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: number;
    iconClass: string;
  }
  
  function StatCard({
    icon: Icon,
    label,
    value,
    iconClass,
  }: StatCardProps) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-xl p-2.5 ${iconClass}`}
          >
            <Icon className="h-5 w-5" />
          </div>
  
          <div>
            <p className="text-sm text-slate-500">
              {label}
            </p>
  
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {value}
            </p>
          </div>
        </div>
      </div>
    );
  }