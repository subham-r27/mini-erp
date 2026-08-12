import {
    Trash2,
  } from "lucide-react";
  
  import type {
    Product,
  } from "../../types";
  
  export interface ChallanDraftItem {
    productId: string;
    productName: string;
    sku: string;
    unitPrice: number;
    availableStock: number;
    quantity: number;
  }
  
  interface ChallanItemRowProps {
    item: ChallanDraftItem;
    products: Product[];
    onQuantityChange: (
      productId: string,
      quantity: number,
    ) => void;
    onRemove: (
      productId: string,
    ) => void;
  }
  
  export default function ChallanItemRow({
    item,
    onQuantityChange,
    onRemove,
  }: ChallanItemRowProps) {
    const lineTotal =
      item.unitPrice * item.quantity;
  
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {item.productName}
            </p>
  
            <p className="mt-1 text-xs text-slate-400">
              {item.sku}
            </p>
          </div>
  
          <button
            type="button"
            onClick={() =>
              onRemove(item.productId)
            }
            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
  
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-400">
              Unit Price
            </p>
  
            <p className="mt-1 text-sm font-semibold text-slate-800">
              ₹
              {item.unitPrice.toLocaleString(
                "en-IN",
              )}
            </p>
          </div>
  
          <div>
            <p className="text-xs text-slate-400">
              Available
            </p>
  
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {item.availableStock}
            </p>
          </div>
  
          <div>
            <label
              htmlFor={`quantity-${item.productId}`}
              className="text-xs text-slate-400"
            >
              Quantity
            </label>
  
            <input
              id={`quantity-${item.productId}`}
              type="number"
              min="1"
              max={item.availableStock}
              value={item.quantity}
              onChange={(event) =>
                onQuantityChange(
                  item.productId,
                  Number(event.target.value),
                )
              }
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
            />
          </div>
  
          <div>
            <p className="text-xs text-slate-400">
              Total
            </p>
  
            <p className="mt-1 text-sm font-semibold text-slate-800">
              ₹
              {lineTotal.toLocaleString(
                "en-IN",
              )}
            </p>
          </div>
        </div>
  
        {item.quantity >
          item.availableStock && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            Quantity exceeds available stock.
          </p>
        )}
      </div>
    );
  }