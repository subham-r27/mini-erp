import {
    ChevronDown,
    LogOut,
    Settings,
    User,
  } from "lucide-react";
  
  import { useState } from "react";
  
  export default function UserMenu() {
    const [open, setOpen] = useState(false);
  
    return (
      <div className="relative">
        <button
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
        >
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">
              Arjun Mehta
            </p>
  
            <p className="text-xs text-slate-400">
              Administrator
            </p>
          </div>
  
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            AM
          </div>
  
          <ChevronDown
            className={`
              hidden h-4 w-4 text-slate-400 transition
              sm:block
              ${open ? "rotate-180" : ""}
            `}
          />
        </button>
  
        {open && (
          <>
            <button
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            />
  
            <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-medium text-slate-900">
                  Arjun Mehta
                </p>
  
                <p className="mt-0.5 text-xs text-slate-400">
                  admin@erp.local
                </p>
              </div>
  
              <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                <User className="h-4 w-4" />
                My Profile
              </button>
  
              <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                <Settings className="h-4 w-4" />
                Settings
              </button>
  
              <div className="my-1 border-t border-slate-100" />
  
              <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    );
  }