import {
    ClipboardPlus,
    PackagePlus,
    UserPlus,
  } from "lucide-react";
  
  import { useNavigate } from "react-router";
  
  const actions = [
    {
      label: "Add Customer",
      description: "Create a new CRM customer",
      icon: UserPlus,
      path: "/customers",
    },
    {
      label: "Add Product",
      description: "Add product to inventory",
      icon: PackagePlus,
      path: "/products",
    },
    {
      label: "Create Challan",
      description: "Start a new sales challan",
      icon: ClipboardPlus,
      path: "/challans",
    },
  ];
  
  export default function QuickActions() {
    const navigate = useNavigate();
  
    return (
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
  
          return (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
  
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  {action.label}
                </p>
  
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }