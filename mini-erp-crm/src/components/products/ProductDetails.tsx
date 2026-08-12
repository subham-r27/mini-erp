import {
    Boxes,
    MapPin,
    Package,
    Tag,
  } from "lucide-react";
  
  import type {
    Product,
  } from "../../types";
  
  import Modal from "../ui/Modal";
  import ProductStockBadge from "./ProductStockBadge";
  
  interface ProductDetailsProps {
    product: Product | null;
    open: boolean;
    onClose: () => void;
  }
  
  export default function ProductDetails({
    product,
    open,
    onClose,
  }: ProductDetailsProps) {
    if (!product) {
      return null;
    }
  
    return (
      <Modal
        open={open}
        onClose={onClose}
        title="Product Details"
        description="View product and inventory information."
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-700">
              {product.name
                .slice(0, 2)
                .toUpperCase()}
            </div>
  
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-slate-900">
                {product.name}
              </h3>
  
              <p className="mt-1 text-sm text-slate-400">
                SKU: {product.sku}
              </p>
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
  
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Tag className="h-4 w-4" />
  
                <span className="text-xs">
                  Category
                </span>
              </div>
  
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {product.category}
              </p>
            </div>
  
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Package className="h-4 w-4" />
  
                <span className="text-xs">
                  Unit Price
                </span>
              </div>
  
              <p className="mt-2 text-sm font-semibold text-slate-800">
                ₹
                {product.unitPrice.toLocaleString(
                  "en-IN",
                )}
              </p>
            </div>
  
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Boxes className="h-4 w-4" />
  
                <span className="text-xs">
                  Current Stock
                </span>
              </div>
  
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {product.currentStock} units
              </p>
            </div>
  
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="h-4 w-4" />
  
                <span className="text-xs">
                  Warehouse
                </span>
              </div>
  
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {product.warehouse}
              </p>
            </div>
          </div>
  
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-400">
              Minimum Stock Level
            </p>
  
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {product.minimumStock} units
            </p>
  
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${
                  product.currentStock <=
                  product.minimumStock
                    ? "bg-red-500"
                    : "bg-emerald-500"
                }`}
                style={{
                  width: `${Math.min(
                    (product.currentStock /
                      Math.max(
                        product.minimumStock,
                        1,
                      )) *
                      100,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>
  
          {product.description && (
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Description
              </p>
  
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </Modal>
    );
  }