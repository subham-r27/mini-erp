import {
    Plus,
    UserRound,
  } from "lucide-react";
  
  import {
    useMemo,
    useState,
  } from "react";
  
  import type {
    Customer,
    Product,
    Challan,
  } from "../../types";
  
  import Button from "../ui/Button";
  import SelectField from "../ui/SelectField";
  
  import ChallanItemRow, {
    type ChallanDraftItem,
  } from "./ChallanItemRow";
  
  interface ChallanFormProps {
    customers: Customer[];
    products: Product[];
  
    onSaveDraft: (
      challan: Challan,
    ) => void;
  
    onConfirm: (
      challan: Challan,
    ) => void;
  
    onCancel: () => void;
  }
  
  export default function ChallanForm({
    customers,
    products,
    onSaveDraft,
    onConfirm,
    onCancel,
  }: ChallanFormProps) {
    const [customerId, setCustomerId] =
      useState("");
  
    const [items, setItems] =
      useState<ChallanDraftItem[]>(
        [],
      );
  
    const [selectedProductId, setSelectedProductId] =
      useState("");
  
    const [taxRate, setTaxRate] =
      useState(18);
  
    const [error, setError] =
      useState("");
  
    const selectedCustomer =
      customers.find(
        (customer) =>
          customer.id === customerId,
      );
  
    const subtotal = useMemo(
      () =>
        items.reduce(
          (sum, item) =>
            sum +
            item.unitPrice *
              item.quantity,
          0,
        ),
      [items],
    );
  
    const totalQuantity = useMemo(
      () =>
        items.reduce(
          (sum, item) =>
            sum + item.quantity,
          0,
        ),
      [items],
    );
  
    const taxAmount =
      subtotal * (taxRate / 100);
  
    const grandTotal =
      subtotal + taxAmount;
  
    const addProduct = () => {
      setError("");
  
      if (!selectedProductId) {
        setError(
          "Please select a product.",
        );
        return;
      }
  
      const product =
        products.find(
          (item) =>
            item.id ===
            selectedProductId,
        );
  
      if (!product) {
        return;
      }
  
      if (product.currentStock <= 0) {
        setError(
          `${product.name} is out of stock.`,
        );
        return;
      }
  
      const alreadyAdded =
        items.some(
          (item) =>
            item.productId ===
            product.id,
        );
  
      if (alreadyAdded) {
        setError(
          "This product has already been added.",
        );
        return;
      }
  
      setItems((previous) => [
        ...previous,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          unitPrice:
            product.unitPrice,
          availableStock:
            product.currentStock,
          quantity: 1,
        },
      ]);
  
      setSelectedProductId("");
    };
  
    const updateQuantity = (
      productId: string,
      quantity: number,
    ) => {
      setError("");
  
      setItems((previous) =>
        previous.map((item) =>
          item.productId ===
          productId
            ? {
                ...item,
                quantity:
                  Math.max(
                    1,
                    quantity,
                  ),
              }
            : item,
        ),
      );
    };
  
    const removeProduct = (
      productId: string,
    ) => {
      setItems((previous) =>
        previous.filter(
          (item) =>
            item.productId !==
            productId,
        ),
      );
    };
  
    const buildChallan = (
      status:
        | "DRAFT"
        | "CONFIRMED",
    ): Challan | null => {
      if (!customerId) {
        setError(
          "Please select a customer.",
        );
        return null;
      }
  
      if (items.length === 0) {
        setError(
          "Please add at least one product.",
        );
        return null;
      }
  
      const invalidStock =
        items.some(
          (item) =>
            item.quantity >
            item.availableStock,
        );
  
      if (invalidStock) {
        setError(
          "One or more products have insufficient stock.",
        );
        return null;
      }
  
      if (!selectedCustomer) {
        return null;
      }
  
      const challanItems =
        items.map(
          (item, index) => ({
            id: `ITEM-${Date.now()}-${index}`,
            productId:
              item.productId,
  
            // Snapshot
            productName:
              item.productName,
            sku: item.sku,
            unitPrice:
              item.unitPrice,
  
            quantity:
              item.quantity,
  
            lineTotal:
              item.unitPrice *
              item.quantity,
          }),
        );
  
      const now =
        new Date();
  
      return {
        id: `CHL-${Date.now()}`,
  
        challanNumber:
          `SC-${now.getFullYear()}-${String(
            now.getTime(),
          ).slice(-6)}`,
  
        customerId:
          selectedCustomer.id,
  
        customerName:
          selectedCustomer.customerName,
  
        businessName:
          selectedCustomer.businessName,
  
        items: challanItems,
  
        totalQuantity,
  
        subtotal,
  
        taxRate,
  
        taxAmount,
  
        grandTotal,
  
        status,
  
        createdBy:
          "Arjun Mehta",
  
        createdAt:
          now.toLocaleString(
            "en-IN",
          ),
      };
    };
  
    const handleDraft = () => {
      setError("");
  
      const challan =
        buildChallan("DRAFT");
  
      if (challan) {
        onSaveDraft(challan);
      }
    };
  
    const handleConfirm = () => {
      setError("");
  
      const challan =
        buildChallan("CONFIRMED");
  
      if (challan) {
        onConfirm(challan);
      }
    };
  
    return (
      <div className="space-y-6">
        {/* Customer */}
  
        <div>
          <div className="mb-3 flex items-center gap-2">
            <UserRound className="h-4 w-4 text-slate-500" />
  
            <h3 className="text-sm font-semibold text-slate-900">
              Customer
            </h3>
          </div>
  
          <SelectField
            id="challan-customer"
            label="Select Customer"
            value={customerId}
            onChange={(event) =>
              setCustomerId(
                event.target.value,
              )
            }
            options={customers.map(
              (customer) => ({
                label: `${customer.customerName} — ${customer.businessName}`,
                value: customer.id,
              }),
            )}
            required
          />
        </div>
  
        {/* Products */}
  
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-900">
            Products
          </h3>
  
          <p className="mt-1 text-xs text-slate-500">
            Add products and specify quantities.
          </p>
  
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <select
              value={selectedProductId}
              onChange={(event) =>
                setSelectedProductId(
                  event.target.value,
                )
              }
              className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            >
              <option value="">
                Select product
              </option>
  
              {products
                .filter(
                  (product) =>
                    product.currentStock >
                    0,
                )
                .map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name} —{" "}
                    {product.sku} — Stock:{" "}
                    {
                      product.currentStock
                    }
                  </option>
                ))}
            </select>
  
            <Button
              type="button"
              variant="secondary"
              onClick={addProduct}
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>
  
        {/* Items */}
  
        {items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => (
              <ChallanItemRow
                key={item.productId}
                item={item}
                products={products}
                onQuantityChange={
                  updateQuantity
                }
                onRemove={
                  removeProduct
                }
              />
            ))}
          </div>
        )}
  
        {/* Tax */}
  
        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                GST / Tax
              </p>
  
              <p className="mt-1 text-xs text-slate-500">
                Applied to the subtotal.
              </p>
            </div>
  
            <select
              value={taxRate}
              onChange={(event) =>
                setTaxRate(
                  Number(
                    event.target.value,
                  ),
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="0">
                0%
              </option>
  
              <option value="5">
                5%
              </option>
  
              <option value="12">
                12%
              </option>
  
              <option value="18">
                18%
              </option>
  
              <option value="28">
                28%
              </option>
            </select>
          </div>
        </div>
  
        {/* Summary */}
  
        <div className="rounded-2xl bg-slate-50 p-5">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Total Quantity
              </span>
  
              <span className="font-medium text-slate-800">
                {totalQuantity}
              </span>
            </div>
  
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Subtotal
              </span>
  
              <span className="font-medium text-slate-800">
                ₹
                {subtotal.toLocaleString(
                  "en-IN",
                )}
              </span>
            </div>
  
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Tax ({taxRate}%)
              </span>
  
              <span className="font-medium text-slate-800">
                ₹
                {taxAmount.toLocaleString(
                  "en-IN",
                )}
              </span>
            </div>
  
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">
                  Grand Total
                </span>
  
                <span className="text-xl font-bold text-slate-900">
                  ₹
                  {grandTotal.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
  
        {/* Error */}
  
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
  
        {/* Actions */}
  
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
  
          <Button
            type="button"
            variant="secondary"
            onClick={handleDraft}
          >
            Save Draft
          </Button>
  
          <Button
            type="button"
            onClick={handleConfirm}
          >
            Confirm Challan
          </Button>
        </div>
      </div>
    );
  }