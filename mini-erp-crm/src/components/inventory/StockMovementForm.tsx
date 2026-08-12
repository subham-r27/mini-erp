import {
    useState,
  } from "react";
  
  import type {
    Product,
    StockMovementType,
  } from "../../types";
  
  import Button from "../ui/Button";
  import SelectField from "../ui/SelectField";
  import FormField from "../ui/FormField";
  import TextAreaField from "../ui/TextAreaField";
  
  interface StockMovementFormProps {
    products: Product[];
    onSubmit: (
      productId: string,
      movementType: StockMovementType,
      quantity: number,
      reason: string,
    ) => void;
    onCancel: () => void;
  }
  
  export default function StockMovementForm({
    products,
    onSubmit,
    onCancel,
  }: StockMovementFormProps) {
    const [productId, setProductId] =
      useState(
        products[0]?.id || "",
      );
  
    const [movementType, setMovementType] =
      useState<StockMovementType>("IN");
  
    const [quantity, setQuantity] =
      useState("");
  
    const [reason, setReason] =
      useState("");
  
    const [error, setError] =
      useState("");
  
    const selectedProduct =
      products.find(
        (product) =>
          product.id === productId,
      );
  
    const handleSubmit = (
      event: React.FormEvent,
    ) => {
      event.preventDefault();
  
      const amount = Number(quantity);
  
      if (!productId) {
        setError(
          "Please select a product.",
        );
        return;
      }
  
      if (!amount || amount <= 0) {
        setError(
          "Quantity must be greater than zero.",
        );
        return;
      }
  
      if (
        movementType === "OUT" &&
        selectedProduct &&
        amount >
          selectedProduct.currentStock
      ) {
        setError(
          `Only ${selectedProduct.currentStock} units are available.`,
        );
        return;
      }
  
      if (!reason.trim()) {
        setError(
          "Please provide a reason.",
        );
        return;
      }
  
      onSubmit(
        productId,
        movementType,
        amount,
        reason.trim(),
      );
    };
  
    return (
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <SelectField
          id="movement-product"
          label="Product"
          value={productId}
          onChange={(event) =>
            setProductId(
              event.target.value,
            )
          }
          options={products.map(
            (product) => ({
              label: `${product.name} (${product.sku})`,
              value: product.id,
            }),
          )}
          required
        />
  
        {selectedProduct && (
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-400">
              Current Stock
            </p>
  
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {selectedProduct.currentStock} units
            </p>
          </div>
        )}
  
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="movement-type"
            label="Movement Type"
            value={movementType}
            onChange={(event) =>
              setMovementType(
                event.target
                  .value as StockMovementType,
              )
            }
            options={[
              {
                label: "Stock In",
                value: "IN",
              },
              {
                label: "Stock Out",
                value: "OUT",
              },
            ]}
            required
          />
  
          <FormField
            id="movement-quantity"
            label="Quantity"
            type="number"
            min="1"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(event) => {
              setQuantity(
                event.target.value,
              );
              setError("");
            }}
            required
          />
        </div>
  
        <TextAreaField
          id="movement-reason"
          label="Reason"
          placeholder="e.g. Supplier shipment, Sales Challan..."
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);
            setError("");
          }}
          required
        />
  
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
  
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
  
          <Button type="submit">
            Record Movement
          </Button>
        </div>
      </form>
    );
  }