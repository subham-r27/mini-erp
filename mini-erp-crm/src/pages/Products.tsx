import {
    Plus,
    Search,
    SlidersHorizontal,
    X,
  } from "lucide-react";
  
  import {
    useMemo,
    useState,
  } from "react";
  
  import PageHeader from "../components/common/PageHeader";
  import Button from "../components/ui/Button";
  import Modal from "../components/ui/Modal";
  
  import ProductForm from "../components/products/ProductForm";
  import ProductTable from "../components/products/ProductTable";
  import ProductDetails from "../components/products/ProductDetails";
  
  import { products as initialProducts } from "../data/mockData";
  
  import type {
    Product,
  } from "../types";
  
  export default function Products() {
    const [productList, setProductList] =
      useState<Product[]>(
        initialProducts,
      );
  
    const [search, setSearch] =
      useState("");
  
    const [category, setCategory] =
      useState("ALL");
  
    const [warehouse, setWarehouse] =
      useState("ALL");
  
    const [stockFilter, setStockFilter] =
      useState("ALL");
  
    const [formOpen, setFormOpen] =
      useState(false);
  
    const [editingProduct, setEditingProduct] =
      useState<Product | null>(null);
  
    const [selectedProduct, setSelectedProduct] =
      useState<Product | null>(null);
  
    const [filterOpen, setFilterOpen] =
      useState(false);
  
    const filteredProducts =
      useMemo(() => {
        const query =
          search.trim().toLowerCase();
  
        return productList.filter(
          (product) => {
            const matchesSearch =
              !query ||
              product.name
                .toLowerCase()
                .includes(query) ||
              product.sku
                .toLowerCase()
                .includes(query);
  
            const matchesCategory =
              category === "ALL" ||
              product.category ===
                category;
  
            const matchesWarehouse =
              warehouse === "ALL" ||
              product.warehouse ===
                warehouse;
  
            let matchesStock = true;
  
            if (stockFilter === "LOW") {
              matchesStock =
                product.currentStock <=
                product.minimumStock;
            }
  
            if (stockFilter === "OUT") {
              matchesStock =
                product.currentStock === 0;
            }
  
            if (stockFilter === "HEALTHY") {
              matchesStock =
                product.currentStock >
                product.minimumStock;
            }
  
            return (
              matchesSearch &&
              matchesCategory &&
              matchesWarehouse &&
              matchesStock
            );
          },
        );
      }, [
        productList,
        search,
        category,
        warehouse,
        stockFilter,
      ]);
  
    const lowStockCount =
      productList.filter(
        (product) =>
          product.currentStock <=
          product.minimumStock,
      ).length;
  
    const totalUnits =
      productList.reduce(
        (sum, product) =>
          sum + product.currentStock,
        0,
      );
  
    const inventoryValue =
      productList.reduce(
        (sum, product) =>
          sum +
          product.currentStock *
            product.unitPrice,
        0,
      );
  
    const handleAddProduct = (
      data: Omit<
        Product,
        "id" | "createdAt" | "updatedAt"
      >,
    ) => {
      const newProduct: Product = {
        ...data,
        id: `PRD-${String(
          productList.length + 1,
        ).padStart(3, "0")}`,
        createdAt:
          new Date()
            .toISOString()
            .split("T")[0],
        updatedAt:
          new Date()
            .toISOString()
            .split("T")[0],
      };
  
      setProductList((previous) => [
        newProduct,
        ...previous,
      ]);
  
      setFormOpen(false);
    };
  
    const handleEditProduct = (
      data: Omit<
        Product,
        "id" | "createdAt" | "updatedAt"
      >,
    ) => {
      if (!editingProduct) {
        return;
      }
  
      setProductList((previous) =>
        previous.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...data,
                updatedAt:
                  new Date()
                    .toISOString()
                    .split("T")[0],
              }
            : product,
        ),
      );
  
      setEditingProduct(null);
      setFormOpen(false);
    };
  
    const clearFilters = () => {
      setCategory("ALL");
      setWarehouse("ALL");
      setStockFilter("ALL");
    };
  
    return (
      <div className="space-y-6">
        <PageHeader
          title="Products"
          description="Manage products, pricing and inventory configuration."
          action={
            <Button
              onClick={() => {
                setEditingProduct(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          }
        />
  
        {/* Summary */}
  
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Total Products
            </p>
  
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {productList.length}
            </p>
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Total Units
            </p>
  
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {totalUnits}
            </p>
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Low Stock
            </p>
  
            <p className="mt-2 text-2xl font-semibold text-red-600">
              {lowStockCount}
            </p>
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Inventory Value
            </p>
  
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              ₹
              {inventoryValue.toLocaleString(
                "en-IN",
              )}
            </p>
          </div>
        </div>
  
        {/* Product table */}
  
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative min-w-0 flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
  
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search by product or SKU..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
  
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
  
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() =>
                  setFilterOpen(
                    (value) => !value,
                  )
                }
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
  
              {(category !== "ALL" ||
                warehouse !== "ALL" ||
                stockFilter !== "ALL") && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
  
          {filterOpen && (
            <div className="border-b border-slate-100 bg-slate-50/60 p-4 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">
                    Category
                  </label>
  
                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                  >
                    <option value="ALL">
                      All categories
                    </option>
  
                    <option value="Accessories">
                      Accessories
                    </option>
  
                    <option value="Monitors">
                      Monitors
                    </option>
  
                    <option value="Cables">
                      Cables
                    </option>
  
                    <option value="Laptops">
                      Laptops
                    </option>
                  </select>
                </div>
  
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">
                    Warehouse
                  </label>
  
                  <select
                    value={warehouse}
                    onChange={(event) =>
                      setWarehouse(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                  >
                    <option value="ALL">
                      All warehouses
                    </option>
  
                    <option value="Bangalore Central">
                      Bangalore Central
                    </option>
  
                    <option value="Bangalore East">
                      Bangalore East
                    </option>
  
                    <option value="Bangalore North">
                      Bangalore North
                    </option>
                  </select>
                </div>
  
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">
                    Stock
                  </label>
  
                  <select
                    value={stockFilter}
                    onChange={(event) =>
                      setStockFilter(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                  >
                    <option value="ALL">
                      All stock
                    </option>
  
                    <option value="LOW">
                      Low stock
                    </option>
  
                    <option value="OUT">
                      Out of stock
                    </option>
  
                    <option value="HEALTHY">
                      Healthy stock
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}
  
          <div className="border-b border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>
          </div>
  
          {filteredProducts.length > 0 ? (
            <ProductTable
              products={
                filteredProducts
              }
              onView={(product) =>
                setSelectedProduct(
                  product,
                )
              }
              onEdit={(product) => {
                setEditingProduct(
                  product,
                );
                setFormOpen(true);
              }}
            />
          ) : (
            <div className="px-5 py-16 text-center">
              <p className="text-sm font-semibold text-slate-800">
                No products found
              </p>
  
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or
                filters.
              </p>
            </div>
          )}
        </div>
  
        {/* Add / Edit */}
  
        <Modal
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingProduct(null);
          }}
          title={
            editingProduct
              ? "Edit Product"
              : "Add Product"
          }
          description={
            editingProduct
              ? "Update product information."
              : "Add a new product to your inventory."
          }
          size="lg"
        >
          <ProductForm
            product={editingProduct}
            onSubmit={
              editingProduct
                ? handleEditProduct
                : handleAddProduct
            }
            onCancel={() => {
              setFormOpen(false);
              setEditingProduct(null);
            }}
          />
        </Modal>
  
        {/* Details */}
  
        <ProductDetails
          product={selectedProduct}
          open={Boolean(
            selectedProduct,
          )}
          onClose={() =>
            setSelectedProduct(null)
          }
        />
      </div>
    );
  }