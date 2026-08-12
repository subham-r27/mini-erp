import {
  Plus,
  Search,
  ShieldCheck,
  Users as UsersIcon,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import PageHeader from "../components/common/PageHeader";

import UserTable from "../components/users/UserTable";

import {
  users as initialUsers,
} from "../data/mockData";

import type {
  User,
} from "../types";

export default function Users() {
  const [userList] =
    useState<User[]>(
      initialUsers,
    );

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const filteredUsers =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return userList.filter(
        (user) => {
          const matchesSearch =
            !query ||
            user.name
              .toLowerCase()
              .includes(query) ||
            user.email
              .toLowerCase()
              .includes(query);

          const matchesRole =
            roleFilter === "ALL" ||
            user.role === roleFilter;

          return (
            matchesSearch &&
            matchesRole
          );
        },
      );
    }, [
      userList,
      search,
      roleFilter,
    ]);

  const activeUsers =
    userList.filter(
      (user) =>
        user.status ===
        "ACTIVE",
    ).length;

  const adminUsers =
    userList.filter(
      (user) =>
        user.role ===
        "ADMIN",
    ).length;

  const handleView = (
    user: User,
  ) => {
    console.log(
      "Selected user:",
      user,
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage users, roles and access to the ERP."
        action={
          <button
            type="button"
            className="
              inline-flex items-center
              justify-center gap-2
              rounded-xl
              bg-violet-600
              px-4 py-2.5
              text-sm font-semibold
              text-white
              shadow-lg
              shadow-violet-500/15
              transition
              hover:bg-violet-500
              active:scale-[0.98]
            "
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        }
      />

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-[#15151A] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400">
              <UsersIcon className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Total Users
              </p>

              <p className="mt-1 text-2xl font-semibold text-white">
                {userList.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#15151A] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Active Users
              </p>

              <p className="mt-1 text-2xl font-semibold text-white">
                {activeUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#15151A] p-5">
          <p className="text-sm text-zinc-500">
            Administrators
          </p>

          <p className="mt-2 text-2xl font-semibold text-violet-400">
            {adminUsers}
          </p>
        </div>
      </div>

      {/* User list */}

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#15151A]">
        <div className="flex flex-col gap-3 border-b border-zinc-800 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search users..."
              className="
                h-10 w-full
                rounded-xl
                border border-zinc-800
                bg-[#101014]
                pl-10 pr-3
                text-sm text-white
                placeholder:text-zinc-600
                outline-none
                transition
                focus:border-violet-500
                focus:ring-4
                focus:ring-violet-500/10
                sm:w-80
              "
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(
                event.target.value,
              )
            }
            className="
              h-10
              rounded-xl
              border border-zinc-800
              bg-[#101014]
              px-3
              text-sm text-zinc-300
              outline-none
              focus:border-violet-500
            "
          >
            <option value="ALL">
              All roles
            </option>

            <option value="ADMIN">
              Admin
            </option>

            <option value="SALES">
              Sales
            </option>

            <option value="WAREHOUSE">
              Warehouse
            </option>

            <option value="ACCOUNTS">
              Accounts
            </option>
          </select>
        </div>

        <div className="border-b border-zinc-800 px-5 py-3">
          <p className="text-xs text-zinc-600">
            Showing{" "}
            <span className="font-semibold text-zinc-400">
              {
                filteredUsers.length
              }
            </span>{" "}
            users
          </p>
        </div>

        {filteredUsers.length > 0 ? (
          <UserTable
            users={
              filteredUsers
            }
            onView={handleView}
          />
        ) : (
          <div className="px-5 py-16 text-center">
            <p className="text-sm font-semibold text-zinc-200">
              No users found
            </p>

            <p className="mt-1 text-sm text-zinc-600">
              Try changing your search or role filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}