import {
    AlertTriangle,
    ArrowRight,
  } from "lucide-react";
  
  import { products } from "../../data/mockData";
  import Button from "../ui/Button";
  
  export default function LowStockAlerts() {
    const lowStockProducts = products.filter(
      (product) =>
        product.currentStock <= product.minimumStock,
    );
  
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
  
            <div>
              <h2 className="font-semibold text-slate-900">
                Low Stock
              </h2>
  
              <p className="mt-1 text-sm text-slate-500">
                Products requiring attention
              </p>
            </div>
          </div>
  
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
            {lowStockProducts.length}
          </span>
        </div>
  
        <div className="divide-y divide-slate-100">
          {lowStockProducts.map((product) => {
            const percentage =
              (product.currentStock /
                product.minimumStock) *
              100;
  
            return (
              <div
                key={product.id}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {product.name}
                    </p>
  
                    <p className="mt-1 text-xs text-slate-400">
                      {product.sku}
                    </p>
                  </div>
  
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-red-600">
                      {product.currentStock}
                    </p>
  
                    <p className="text-xs text-slate-400">
                      min {product.minimumStock}
                    </p>
                  </div>
                </div>
  
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-red-500 transition-all"
                    style={{
                      width: `${Math.min(
                        percentage,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
  
        <div className="border-t border-slate-100 p-4">
          <Button
            variant="ghost"
            className="w-full"
          >
            Manage Inventory
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }