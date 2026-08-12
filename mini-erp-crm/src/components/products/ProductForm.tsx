import {
    useEffect,
    useState,
  } from "react";
  
  import type {
    Product,
  } from "../../types";
  
  import Button from "../ui/Button";
  import FormField from "../ui/FormField";
  import SelectField from "../ui/SelectField";
  import TextAreaField from "../ui/TextAreaField";
  
  interface ProductFormProps {
    product?: Product | null;
    onSubmit: (
      product: Omit<
        Product,
        "id" | "createdAt" | "updatedAt"
      >,
    ) => void;
    onCancel: () => void;
  }
  
  interface ProductFormData {
    name: string;
    sku: string;
    category: string;
    unitPrice: string;
    currentStock: string;
    minimumStock: string;
    warehouse: string;
    description: string;
  }
  
  const emptyForm: ProductFormData = {
    name: "",
    sku: "",
    category: "Accessories",
    unitPrice: "",
    currentStock: "0",
    minimumStock: "5",
    warehouse: "Bangalore Central",
    description: "",
  };
  
  export default function ProductForm({
    product,
    onSubmit,
    onCancel,
  }: ProductFormProps) {
    const [form, setForm] =
      useState<ProductFormData>(
        emptyForm,
      );
  
    const [errors, setErrors] =
      useState<Record<string, string>>(
        {},
      );
  
    const [loading, setLoading] =
      useState(false);
  
    const isEditing = Boolean(product);
  
    useEffect(() => {
      if (product) {
        setForm({
          name: product.name,
          sku: product.sku,
          category: product.category,
          unitPrice: String(
            product.unitPrice,
          ),
          currentStock: String(
            product.currentStock,
          ),
          minimumStock: String(
            product.minimumStock,
          ),
          warehouse: product.warehouse,
          description:
            product.description || "",
        });
      } else {
        setForm(emptyForm);
      }
  
      setErrors({});
    }, [product]);
  
    const updateField = (
      field: keyof ProductFormData,
      value: string,
    ) => {
      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));
  
      setErrors((previous) => ({
        ...previous,
        [field]: "",
      }));
    };
  
    const validate = () => {
      const nextErrors: Record<
        string,
        string
      > = {};
  
      if (!form.name.trim()) {
        nextErrors.name =
          "Product name is required.";
      }
  
      if (!form.sku.trim()) {
        nextErrors.sku =
          "SKU is required.";
      }
  
      if (!form.unitPrice) {
        nextErrors.unitPrice =
          "Unit price is required.";
      } else if (
        Number(form.unitPrice) <= 0
      ) {
        nextErrors.unitPrice =
          "Price must be greater than zero.";
      }
  
      if (
        Number(form.currentStock) < 0
      ) {
        nextErrors.currentStock =
          "Stock cannot be negative.";
      }
  
      if (
        Number(form.minimumStock) < 0
      ) {
        nextErrors.minimumStock =
          "Minimum stock cannot be negative.";
      }
  
      if (!form.warehouse) {
        nextErrors.warehouse =
          "Warehouse is required.";
      }
  
      setErrors(nextErrors);
  
      return (
        Object.keys(nextErrors).length === 0
      );
    };
  
    const handleSubmit = async (
      event: React.FormEvent,
    ) => {
      event.preventDefault();
  
      if (!validate()) {
        return;
      }
  
      setLoading(true);
  
      await new Promise((resolve) =>
        setTimeout(resolve, 400),
      );
  
      onSubmit({
        name: form.name.trim(),
        sku: form.sku.trim().toUpperCase(),
        category: form.category,
        unitPrice: Number(
          form.unitPrice,
        ),
        currentStock: Number(
          form.currentStock,
        ),
        minimumStock: Number(
          form.minimumStock,
        ),
        warehouse: form.warehouse,
        description:
          form.description.trim() ||
          undefined,
      });
  
      setLoading(false);
    };
  
    return (
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Product Information
          </h3>
  
          <p className="mt-1 text-xs text-slate-500">
            Add the basic product details.
          </p>
        </div>
  
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="product-name"
            label="Product Name"
            placeholder="e.g. Wireless Mouse"
            value={form.name}
            onChange={(event) =>
              updateField(
                "name",
                event.target.value,
              )
            }
            error={errors.name}
            required
          />
  
          <FormField
            id="product-sku"
            label="SKU"
            placeholder="e.g. WM-1001"
            value={form.sku}
            onChange={(event) =>
              updateField(
                "sku",
                event.target.value,
              )
            }
            error={errors.sku}
            required
          />
  
          <SelectField
            id="product-category"
            label="Category"
            value={form.category}
            onChange={(event) =>
              updateField(
                "category",
                event.target.value,
              )
            }
            options={[
              {
                label: "Accessories",
                value: "Accessories",
              },
              {
                label: "Monitors",
                value: "Monitors",
              },
              {
                label: "Cables",
                value: "Cables",
              },
              {
                label: "Laptops",
                value: "Laptops",
              },
              {
                label: "Other",
                value: "Other",
              },
            ]}
            required
          />
  
          <FormField
            id="product-price"
            label="Unit Price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.unitPrice}
            onChange={(event) =>
              updateField(
                "unitPrice",
                event.target.value,
              )
            }
            error={errors.unitPrice}
            required
          />
        </div>
  
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-900">
            Inventory Configuration
          </h3>
        </div>
  
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            id="current-stock"
            label="Current Stock"
            type="number"
            min="0"
            value={form.currentStock}
            onChange={(event) =>
              updateField(
                "currentStock",
                event.target.value,
              )
            }
            error={errors.currentStock}
          />
  
          <FormField
            id="minimum-stock"
            label="Minimum Stock"
            type="number"
            min="0"
            value={form.minimumStock}
            onChange={(event) =>
              updateField(
                "minimumStock",
                event.target.value,
              )
            }
            error={errors.minimumStock}
          />
  
          <SelectField
            id="warehouse"
            label="Warehouse"
            value={form.warehouse}
            onChange={(event) =>
              updateField(
                "warehouse",
                event.target.value,
              )
            }
            options={[
              {
                label: "Bangalore Central",
                value: "Bangalore Central",
              },
              {
                label: "Bangalore East",
                value: "Bangalore East",
              },
              {
                label: "Bangalore North",
                value: "Bangalore North",
              },
            ]}
            required
          />
        </div>
  
        <TextAreaField
          id="product-description"
          label="Description"
          placeholder="Add product description..."
          value={form.description}
          onChange={(event) =>
            updateField(
              "description",
              event.target.value,
            )
          }
        />
  
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
  
          <Button
            type="submit"
            loading={loading}
          >
            {isEditing
              ? "Save Changes"
              : "Create Product"}
          </Button>
        </div>
      </form>
    );
  }