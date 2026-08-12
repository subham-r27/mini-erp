import {
  ChevronDown,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router";

import {
  useAuth,
} from "../../context/AuthContext";

export default function UserMenu() {
  const {
    user,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const [open, setOpen] =
    useState(false);

  /* =====================================================
     USER INITIALS
     ===================================================== */

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

  /* =====================================================
     ROLE LABEL
     ===================================================== */

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

  /* =====================================================
     LOGOUT
     ===================================================== */

  const handleLogout = () => {
    setOpen(false);

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  /* =====================================================
     NO USER
     ===================================================== */

  if (!user) {
    return (
      <button
        type="button"
        onClick={() =>
          navigate("/login")
        }
        className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative">
      {/* =================================================
          USER BUTTON
          ================================================= */}

      <button
        type="button"
        onClick={() =>
          setOpen(
            (value) => !value,
          )
        }
        className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50 sm:gap-3"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {/* Avatar */}

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xs font-bold text-blue-700">
          {initials}
        </div>

        {/* User info */}

        <div className="hidden text-left sm:block">
          <p className="max-w-[140px] truncate text-xs font-semibold text-slate-800">
            {user.name}
          </p>

          <p className="text-[10px] text-slate-400">
            {roleLabel}
          </p>
        </div>

        <ChevronDown
          className={`
            hidden h-4 w-4 text-slate-400
            transition-transform
            sm:block
            ${
              open
                ? "rotate-180"
                : ""
            }
          `}
        />
      </button>

      {/* =================================================
          DROPDOWN
          ================================================= */}

      {open && (
        <>
          {/* Invisible mobile click area */}

          <button
            type="button"
            aria-label="Close user menu"
            onClick={() =>
              setOpen(false)
            }
            className="fixed inset-0 z-40 cursor-default lg:hidden"
          />

          <div
            className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
            role="menu"
          >
            {/* ===========================================
                USER HEADER
                =========================================== */}

            <div className="border-b border-slate-100 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                  {initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {user.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {user.email}
                  </p>

                  <span className="mt-1.5 inline-flex rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    {roleLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* ===========================================
                MENU ITEMS
                =========================================== */}

            <div className="p-1.5">
              {/* My Profile */}

              <Link
                to="/profile"
                role="menuitem"
                onClick={() =>
                  setOpen(false)
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <UserRound className="h-4 w-4 text-slate-400" />

                <span>
                  My Profile
                </span>
              </Link>

              {/* Settings */}

              <Link
                to="/settings"
                role="menuitem"
                onClick={() =>
                  setOpen(false)
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <Settings className="h-4 w-4 text-slate-400" />

                <span>
                  Settings
                </span>
              </Link>
            </div>

            {/* ===========================================
                LOGOUT
                =========================================== */}

            <div className="border-t border-slate-100 p-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={
                  handleLogout
                }
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />

                <span>
                  Sign Out
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}