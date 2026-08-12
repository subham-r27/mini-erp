import {
    Bell,
    Menu,
    Search,
  } from "lucide-react";
  
  import UserMenu from "./UserMenu";
  
  interface TopbarProps {
    onMenuClick: () => void;
  }
  
  export default function Topbar({
    onMenuClick,
  }: TopbarProps) {
    return (
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
        {/* Left */}
  
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
  
          {/* Search */}
  
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
  
              <input
                type="search"
                placeholder="Search anything..."
                className="h-10 w-64 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 lg:w-80"
              />
  
              <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400 lg:block">
                /
              </span>
            </div>
          </div>
  
          {/* Mobile title */}
  
          <div className="md:hidden">
            <p className="text-sm font-bold text-slate-900">
              ERP Portal
            </p>
  
            <p className="text-[11px] text-slate-400">
              Operations Suite
            </p>
          </div>
        </div>
  
        {/* Right */}
  
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search */}
  
          <button
            className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
  
          {/* Notifications */}
  
          <button
            className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
  
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
  
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />
  
          <UserMenu />
        </div>
      </header>
    );
  }