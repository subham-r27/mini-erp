import { Search, ShieldCheck, Users as UsersIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiRequestError } from "../api/client";
import { fetchUsers } from "../api/users";
import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import PageHeader from "../components/common/PageHeader";
import UserTable from "../components/users/UserTable";
import type { User } from "../types";

const PAGE_SIZE = 20;

export default function Users() {
  const [userList, setUserList] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchUsers({
        page,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        role: roleFilter === "ALL" ? undefined : roleFilter,
      });
      setUserList(result.users);
      setTotalCount(result.pagination.total);
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Failed to load users.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const activeUsers = userList.filter((user) => user.status === "ACTIVE").length;
  const adminUsers = userList.filter((user) => user.role === "ADMIN").length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  if (loading && userList.length === 0) {
    return <LoadingState message="Loading users..." />;
  }

  if (error && userList.length === 0) {
    return <ErrorState title="Unable to load users" description={error} onRetry={() => void loadUsers()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage users, roles and access to the ERP." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-[#15151A] p-5"><div className="flex items-center gap-3"><div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400"><UsersIcon className="h-5 w-5" /></div><div><p className="text-sm text-zinc-500">Total Users</p><p className="mt-1 text-2xl font-semibold text-white">{totalCount}</p></div></div></div>
        <div className="rounded-2xl border border-zinc-800 bg-[#15151A] p-5"><div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400"><ShieldCheck className="h-5 w-5" /></div><div><p className="text-sm text-zinc-500">Active Users</p><p className="mt-1 text-2xl font-semibold text-white">{activeUsers}</p></div></div></div>
        <div className="rounded-2xl border border-zinc-800 bg-[#15151A] p-5"><p className="text-sm text-zinc-500">Administrators</p><p className="mt-2 text-2xl font-semibold text-violet-400">{adminUsers}</p></div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#15151A]">
        <div className="flex flex-col gap-3 border-b border-zinc-800 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search users..." className="h-10 w-full rounded-xl border border-zinc-800 bg-[#101014] pl-10 pr-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 sm:w-80" /></div>
          <select value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }} className="h-10 rounded-xl border border-zinc-800 bg-[#101014] px-3 text-sm text-zinc-300 outline-none focus:border-violet-500"><option value="ALL">All roles</option><option value="ADMIN">Admin</option><option value="SALES">Sales</option><option value="WAREHOUSE">Warehouse</option><option value="ACCOUNTS">Accounts</option></select>
        </div>
        {error && <p className="border-b border-zinc-800 px-5 py-3 text-sm text-red-400">{error}</p>}
        <div className="border-b border-zinc-800 px-5 py-3"><p className="text-xs text-zinc-600">Showing <span className="font-semibold text-zinc-400">{userList.length}</span> of <span className="font-semibold text-zinc-400">{totalCount}</span> users</p></div>
        {userList.length > 0 ? <UserTable users={userList} onView={() => undefined} /> : <div className="px-5 py-16 text-center"><p className="text-sm font-semibold text-zinc-200">No users found</p><p className="mt-1 text-sm text-zinc-600">Try changing your search or role filter.</p></div>}
        {totalPages > 1 && <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-4"><button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 disabled:opacity-40">Previous</button><span className="text-sm text-zinc-500">Page {page} of {totalPages}</span><button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 disabled:opacity-40">Next</button></div>}
      </div>
    </div>
  );
}
