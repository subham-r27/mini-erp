import {
    ClipboardList,
    Package,
    Users,
    AlertTriangle,
  } from "lucide-react";
  
  import { useState } from "react";
  
  import StatCard from "../components/dashboard/StatCard";
  import SalesChart from "../components/dashboard/SalesChart";
  import QuickActions from "../components/dashboard/QuickActions";
  import RecentChallans from "../components/dashboard/RecentChallans";
  import LowStockAlerts from "../components/dashboard/LowStockAlerts";
  import RecentActivity from "../components/dashboard/RecentActivity";
  import DashboardFilters from "../components/dashboard/DashboardFilters";
  
  import {
    challans,
    customers,
    products,
  } from "../data/mockData";
  
  export default function Dashboard() {
    const [range, setRange] = useState("30");
  
    const lowStockCount = products.filter(
      (product) =>
        product.currentStock <= product.minimumStock,
    ).length;
  
    const confirmedChallans = challans.filter(
      (challan) =>
        challan.status === "CONFIRMED",
    );
  
    const totalSales = confirmedChallans.reduce(
      (sum, challan) =>
        sum + challan.grandTotal,
      0,
    );
  
    return (
      <div className="space-y-6">
        {/* Header */}
  
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Operations overview
            </p>
  
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Good morning, Arjun 👋
            </h1>
  
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Monitor customers, inventory, sales
              challans and business activity from one
              place.
            </p>
          </div>
  
          <DashboardFilters
            value={range}
            onChange={setRange}
          />
        </div>
  
        {/* Stats */}
  
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Customers"
            value={customers.length}
            description="vs last month"
            trend={12.5}
            icon={Users}
          />
  
          <StatCard
            title="Products"
            value={products.length}
            description="active products"
            trend={4.2}
            icon={Package}
          />
  
          <StatCard
            title="Confirmed Challans"
            value={confirmedChallans.length}
            description="in selected period"
            trend={8.4}
            icon={ClipboardList}
          />
  
          <StatCard
            title="Low Stock"
            value={lowStockCount}
            description="need attention"
            trend={-2.1}
            icon={AlertTriangle}
          />
        </div>
  
        {/* Sales + Quick Actions */}
  
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          {/* Sales */}
  
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Sales Overview
                </h2>
  
                <p className="mt-1 text-sm text-slate-500">
                  Revenue performance over time
                </p>
              </div>
  
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
  
                <span className="text-xs font-medium text-slate-500">
                  Sales
                </span>
              </div>
            </div>
  
            <div className="p-5">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-slate-900">
                    ₹
                    {totalSales.toLocaleString(
                      "en-IN",
                    )}
                  </p>
  
                  <p className="mt-1 text-xs text-emerald-600">
                    +8.4% compared to previous period
                  </p>
                </div>
  
                <p className="text-xs text-slate-400">
                  Last {range} days
                </p>
              </div>
  
              <SalesChart />
            </div>
          </div>
  
          {/* Quick Actions */}
  
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-semibold text-slate-900">
                Quick Actions
              </h2>
  
              <p className="mt-1 text-sm text-slate-500">
                Frequently used operations
              </p>
            </div>
  
            <div className="p-5">
              <QuickActions />
            </div>
          </div>
        </div>
  
        {/* Challans + Low Stock */}
  
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <RecentChallans />
  
          <LowStockAlerts />
        </div>
  
        {/* Activity */}
  
        <RecentActivity />
  
        {/* Bottom status */}
  
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-900">
                System status
              </p>
  
              <p className="mt-1 text-xs text-blue-700">
                All core operations are currently
                functioning normally.
              </p>
            </div>
  
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Operational
            </div>
          </div>
        </div>
      </div>
    );
  }