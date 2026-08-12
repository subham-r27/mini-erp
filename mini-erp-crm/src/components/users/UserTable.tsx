import {
    MoreHorizontal,
  } from "lucide-react";
  
  import type {
    User,
  } from "../../types";
  
  import UserRoleBadge from "./UserRoleBadge";
  import UserStatusBadge from "./UserStatusBadge";
  
  interface UserTableProps {
    users: User[];
  
    onView: (
      user: User,
    ) => void;
  }
  
  export default function UserTable({
    users,
    onView,
  }: UserTableProps) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#111114]">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                User
              </th>
  
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Role
              </th>
  
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Status
              </th>
  
              <th className="hidden px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500 md:table-cell">
                Last Login
              </th>
  
              <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Action
              </th>
            </tr>
          </thead>
  
          <tbody className="divide-y divide-zinc-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="transition hover:bg-violet-500/[0.03]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 text-xs font-bold text-white">
                      {user.name
                        .split(" ")
                        .map(
                          (part) =>
                            part[0],
                        )
                        .slice(0, 2)
                        .join("")}
                    </div>
  
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">
                        {user.name}
                      </p>
  
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
  
                <td className="px-5 py-4">
                  <UserRoleBadge
                    role={user.role}
                  />
                </td>
  
                <td className="px-5 py-4">
                  <UserStatusBadge
                    status={user.status}
                  />
                </td>
  
                <td className="hidden px-5 py-4 text-sm text-zinc-500 md:table-cell">
                  {user.lastLogin ||
                    "Never"}
                </td>
  
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      onView(user)
                    }
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-violet-500/10 hover:text-violet-300"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }