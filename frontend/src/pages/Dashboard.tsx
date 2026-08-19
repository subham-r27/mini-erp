import {
  AlertTriangle,
  ClipboardList,
  Package,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiRequestError } from "../api/client";
import {
  fetchDashboardSummary,
  fetchLowStockProducts,
  fetchRecentChallans,
  fetchSalesSeries,
} from "../api/dashboard";
import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import DashboardFilters from "../components/dashboard/DashboardFilters";
import LowStockAlerts from "../components/dashboard/LowStockAlerts";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import RecentChallans from "../components/dashboard/RecentChallans";
import SalesChart from "../components/dashboard/SalesChart";
import StatCard from "../components/dashboard/StatCard";
import { useAuth } from "../context/AuthContext";
import type { Challan, Product } from "../types";

export default function Dashboard() {
  const { user } = useAuth();
  const [range, setRange] = useState("30");
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof fetchDashboardSummary>> | null>(null);
  const [recentChallans, setRecentChallans] = useState<Challan[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [salesSeries, setSalesSeries] = useState<Awaited<ReturnType<typeof fetchSalesSeries>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [summaryResult, challansResult, lowStockResult, salesSeriesResult] = await Promise.all([
        fetchDashboardSummary(),
        fetchRecentChallans(),
        fetchLowStockProducts(),
        fetchSalesSeries(Number(range)),
      ]);
      setSummary(summaryResult);
      setRecentChallans(challansResult);
      setLowStockProducts(lowStockResult);
      setSalesSeries(salesSeriesResult);
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Failed to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (loading && !summary) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (error && !summary) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        description={error}
        onRetry={() => void loadDashboard()}
      />
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Operations overview</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Good morning, {user?.name || "there"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Monitor customers, inventory, sales challans and business activity from one place.
          </p>
        </div>
        <DashboardFilters value={range} onChange={setRange} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Customers" value={summary.customers.total} description="all customers" icon={Users} />
        <StatCard title="Products" value={summary.products.active} description={`${summary.products.total} total products`} icon={Package} />
        <StatCard title="Confirmed Challans" value={summary.challans.confirmed} description={`${summary.challans.total} total challans`} icon={ClipboardList} />
        <StatCard title="Low Stock" value={summary.products.lowStock} description="need attention" icon={AlertTriangle} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Sales Overview</h2>
              <p className="mt-1 text-sm text-slate-500">Revenue performance over time</p>
            </div>
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-600" /><span className="text-xs font-medium text-slate-500">Sales</span></div>
          </div>
          <div className="p-5">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold tracking-tight text-slate-900">₹{Number(summary.sales.total).toLocaleString("en-IN")}</p>
                <p className="mt-1 text-xs text-slate-500">Issued and paid invoices</p>
              </div>
              <p className="text-xs text-slate-400">Last {range} days</p>
            </div>
            <SalesChart data={salesSeries} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-5"><h2 className="font-semibold text-slate-900">Quick Actions</h2><p className="mt-1 text-sm text-slate-500">Frequently used operations</p></div>
          <div className="p-5"><QuickActions /></div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <RecentChallans challans={recentChallans} />
        <LowStockAlerts products={lowStockProducts} />
      </div>

      <RecentActivity />

      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-sm font-semibold text-blue-900">System status</p><p className="mt-1 text-xs text-blue-700">{error || "All core operations are currently functioning normally."}</p></div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />Operational</div>
        </div>
      </div>
    </div>
  );
}
