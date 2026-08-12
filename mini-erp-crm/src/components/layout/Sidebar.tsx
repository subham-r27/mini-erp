import {
    BarChart3,
    Boxes,
    ClipboardList,
    FileText,
    LayoutDashboard,
    Package,
    Settings,
    Users,
    UserRoundCog,
    X,
  } from "lucide-react";
  
  import { NavLink } from "react-router";
  
  interface SidebarProps {
    open: boolean;
    onClose: () => void;
  }
  
  const navigation = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
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
        },
        {
          label: "Inventory",
          path: "/inventory",
          icon: Boxes,
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
        },
        {
          label: "Invoices",
          path: "/invoices",
          icon: FileText,
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
        },
        {
          label: "Settings",
          path: "/settings",
          icon: Settings,
        },
      ],
    },
  ];
  
  export default function Sidebar({
    open,
    onClose,
  }: SidebarProps) {
    return (
      <>
        {/* Mobile overlay */}
        {open && (
          <button
            aria-label="Close sidebar"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          />
        )}
  
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
          {/* Logo */}
  
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
  
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
  
          {/* Navigation */}
  
          <nav className="flex-1 overflow-y-auto px-4 py-5">
            <div className="space-y-6">
              {navigation.map((section) => (
                <div key={section.title}>
                  <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {section.title}
                  </p>
  
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
  
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={onClose}
                          className={({ isActive }) =>
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
                          {({ isActive }) => (
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
  
                              <span>{item.label}</span>
  
                              {isActive && (
                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                              )}
                            </>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>
  
          {/* Bottom workspace card */}
  
          <div className="border-t border-slate-100 p-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-blue-700">
                  AM
                </div>
  
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    Arjun Mehta
                  </p>
  
                  <p className="text-xs text-slate-400">
                    Administrator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </>
    );
  }