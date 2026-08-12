import {
    Eye,
    Pencil,
  } from "lucide-react";
  
  import type {
    Product,
  } from "../../types";
  
  import ProductStockBadge from "./ProductStockBadge";
  
  interface ProductTableProps {
    products: Product[];
    onView: (product: Product) => void;
    onEdit: (product: Product) => void;
  }
  
  export default function ProductTable({
    products,
    onView,
    onEdit,
  }: ProductTableProps) {
    return (
      <>
        {/* Desktop */}
  
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Product
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Category
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Price
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Stock
                </th>
  
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Warehouse
                </th>
  
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
  
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
                        {product.name
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
  
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {product.name}
                        </p>
  
                        <p className="mt-0.5 text-xs text-slate-400">
                          {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>
  
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {product.category}
                    </span>
                  </td>
  
                  <td className="px-5 py-4 text-sm font-medium text-slate-800">
                    ₹
                    {product.unitPrice.toLocaleString(
                      "en-IN",
                    )}
                  </td>
  
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {product.currentStock}
                      </p>
  
                      <p className="text-xs text-slate-400">
                        min {product.minimumStock}
                      </p>
                    </div>
  
                    <div className="mt-2">
                      <ProductStockBadge
                        currentStock={
                          product.currentStock
                        }
                        minimumStock={
                          product.minimumStock
                        }
                      />
                    </div>
                  </td>
  
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {product.warehouse}
                  </td>
  
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() =>
                          onView(product)
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
  
                      <button
                        onClick={() =>
                          onEdit(product)
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Mobile */}
  
        <div className="divide-y divide-slate-100 lg:hidden">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
                    {product.name
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
  
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {product.name}
                    </p>
  
                    <p className="mt-0.5 text-xs text-slate-400">
                      {product.sku}
                    </p>
                  </div>
                </div>
  
                <ProductStockBadge
                  currentStock={
                    product.currentStock
                  }
                  minimumStock={
                    product.minimumStock
                  }
                />
              </div>
  
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Price
                  </p>
  
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    ₹
                    {product.unitPrice.toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>
  
                <div>
                  <p className="text-xs text-slate-400">
                    Stock
                  </p>
  
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {product.currentStock}
                  </p>
                </div>
              </div>
  
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() =>
                    onView(product)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
  
                <button
                  onClick={() =>
                    onEdit(product)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }