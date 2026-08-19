import {
  BarChart3,
  Boxes,
  ClipboardList,
  History,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  UserRoundCog,
  Users,
  X,
} from "lucide-react";

import {
  NavLink,
} from "react-router";

import {
  useMemo,
} from "react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  hasPermission,
  type Permission,
} from "../../utils/permissions";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

/* =========================================================
   NAVIGATION CONFIGURATION
   ========================================================= */

const navigation = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        permission:
          "VIEW_DASHBOARD" as Permission,
      },
    ],
  },

  {
    title: "CRM",
    items: [
      {
        label: "Customers",
        path: "/customers",
        icon: Users,
        permission:
          "VIEW_CUSTOMERS" as Permission,
      },
    ],
  },

  {
    title: "Inventory",
    items: [
      {
        label: "Products",
        path: "/products",
        icon: Package,
        permission:
          "VIEW_PRODUCTS" as Permission,
      },

      {
        label: "Inventory",
        path: "/inventory",
        icon: Boxes,
        permission:
          "VIEW_INVENTORY" as Permission,
      },
    ],
  },

  {
    title: "Sales",
    items: [
      {
        label: "Sales Challans",
        path: "/challans",
        icon: ClipboardList,
        permission:
          "VIEW_CHALLANS" as Permission,
      },

      {
        label: "Invoices",
        path: "/invoices",
        icon: FileText,
        permission:
          "VIEW_INVOICES" as Permission,
      },
    ],
  },

  {
    title: "Administration",
    items: [
      {
        label: "Users",
        path: "/users",
        icon: UserRoundCog,
        permission:
          "MANAGE_USERS" as Permission,
      },

      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
        permission:
          "MANAGE_SETTINGS" as Permission,
      },
      {
        label: "Audit Logs",
        path: "/audit-logs",
        icon: History,
        permission:
          "VIEW_AUDIT_LOGS" as Permission,
      },
    ],
  },
];

/* =========================================================
   SIDEBAR
   ========================================================= */

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const {
    user,
  } = useAuth();

  /* =======================================================
     FILTER NAVIGATION BASED ON CURRENT USER ROLE
     ======================================================= */

  const visibleNavigation =
    useMemo(() => {
      if (!user) {
        return [];
      }

      return navigation
        .map((section) => ({
          ...section,

          items:
            section.items.filter(
              (item) =>
                hasPermission(
                  user.role,
                  item.permission,
                ),
            ),
        }))
        .filter(
          (section) =>
            section.items.length > 0,
        );
    }, [user]);

  /* =======================================================
     USER INITIALS
     ======================================================= */

  const initials =
    user?.name
      ? user.name
          .split(" ")
          .map(
            (part) =>
              part[0],
          )
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "U";

  /* =======================================================
     USER ROLE LABEL
     ======================================================= */

  const roleLabel =
    user?.role === "ADMIN"
      ? "Administrator"
      : user?.role === "SALES"
      ? "Sales"
      : user?.role ===
        "WAREHOUSE"
      ? "Warehouse"
      : user?.role ===
        "ACCOUNTS"
      ? "Accounts"
      : "User";

  return (
    <>
      {/* ===================================================
          MOBILE OVERLAY
          =================================================== */}

      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ===================================================
          SIDEBAR
          =================================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[270px] flex-col
          border-r border-slate-200
          bg-white
          transition-transform duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =================================================
            LOGO
            ================================================= */}

        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold tracking-tight text-slate-900">
                ERP Portal
              </p>

              <p className="text-xs text-slate-400">
                Operations Suite
              </p>
            </div>
          </div>

          {/* Mobile close */}

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
            ================================================= */}

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-6">
            {visibleNavigation.map(
              (section) => (
                <div
                  key={
                    section.title
                  }
                >
                  <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {section.title}
                  </p>

                  <div className="space-y-1">
                    {section.items.map(
                      (item) => {
                        const Icon =
                          item.icon;

                        return (
                          <NavLink
                            key={
                              item.path
                            }
                            to={
                              item.path
                            }
                            onClick={
                              onClose
                            }
                            className={({
                              isActive,
                            }) =>
                              `
                              group flex items-center gap-3
                              rounded-xl px-3 py-2.5
                              text-sm font-medium
                              transition-all
                              ${
                                isActive
                                  ? "bg-blue-50 text-blue-700"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                              }
                              `
                            }
                          >
                            {({
                              isActive,
                            }) => (
                              <>
                                <Icon
                                  className={`
                                    h-[18px] w-[18px]
                                    ${
                                      isActive
                                        ? "text-blue-600"
                                        : "text-slate-400 group-hover:text-slate-600"
                                    }
                                  `}
                                />

                                <span>
                                  {
                                    item.label
                                  }
                                </span>

                                {isActive && (
                                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                                )}
                              </>
                            )}
                          </NavLink>
                        );
                      },
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </nav>

        {/* =================================================
            BOTTOM USER CARD
            ================================================= */}

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-blue-700">
                {initials}
              </div>

              {/* User information */}

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">
                  {user?.name ||
                    "User"}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {roleLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}