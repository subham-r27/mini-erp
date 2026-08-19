import {
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createProduct,
  fetchProducts,
  updateProduct,
} from "../api/products";
import { ApiRequestError } from "../api/client";

import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";
import ProductDetails from "../components/products/ProductDetails";

import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/permissions";

import type { Product } from "../types";

const PAGE_SIZE = 20;

export default function Products() {
  const { user } = useAuth();
  const canManage =
    user &&
    hasPermission(user.role, "MANAGE_PRODUCTS");

  const [productList, setProductList] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [warehouse, setWarehouse] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchProducts({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        category:
          category === "ALL" ? undefined : category,
        location:
          warehouse === "ALL" ? undefined : warehouse,
        lowStock:
          stockFilter === "LOW" ? true : undefined,
      });

      setProductList(result.products);
      setTotalCount(result.pagination.total);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "Failed to load products.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    debouncedSearch,
    category,
    warehouse,
    stockFilter,
  ]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const displayProducts = useMemo(() => {
    if (stockFilter === "OUT") {
      return productList.filter(
        (product) => product.currentStock === 0,
      );
    }

    if (stockFilter === "HEALTHY") {
      return productList.filter(
        (product) =>
          product.currentStock > product.minimumStock,
      );
    }

    return productList;
  }, [productList, stockFilter]);

  const lowStockCount = useMemo(
    () =>
      productList.filter(
        (product) =>
          product.currentStock <= product.minimumStock,
      ).length,
    [productList],
  );

  const totalUnits = useMemo(
    () =>
      productList.reduce(
        (sum, product) => sum + product.currentStock,
        0,
      ),
    [productList],
  );

  const inventoryValue = useMemo(
    () =>
      productList.reduce(
        (sum, product) =>
          sum + product.currentStock * product.unitPrice,
        0,
      ),
    [productList],
  );

  const handleAddProduct = async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ) => {
    const { currentStock: _, ...payload } = data;

    setActionError("");

    try {
      await createProduct(payload);
      setFormOpen(false);
      await loadProducts();
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError
          ? err.message
          : "Failed to create product.",
      );
    }
  };

  const handleEditProduct = async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (!editingProduct) {
      return;
    }

    const { currentStock: _, ...payload } = data;

    setActionError("");

    try {
      await updateProduct(editingProduct.id, payload);
      setEditingProduct(null);
      setFormOpen(false);
      await loadProducts();
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError
          ? err.message
          : "Failed to update product.",
      );
    }
  };

  const clearFilters = () => {
    setCategory("ALL");
    setWarehouse("ALL");
    setStockFilter("ALL");
    setPage(1);
  };

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / PAGE_SIZE),
  );

  if (loading && productList.length === 0) {
    return <LoadingState message="Loading products..." />;
  }

  if (error && productList.length === 0) {
    return (
      <ErrorState
        title="Unable to load products"
        description={error}
        onRetry={() => void loadProducts()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage products, pricing and inventory configuration."
        action={
          canManage ? (
            <Button
              onClick={() => {
                setEditingProduct(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          ) : undefined
        }
      />

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Summary */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Total Products
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {totalCount}
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
            {inventoryValue.toLocaleString("en-IN")}
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
                setSearch(event.target.value)
              }
              placeholder="Search by product or SKU..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                setFilterOpen((value) => !value)
              }
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>

            {(category !== "ALL" ||
              warehouse !== "ALL" ||
              stockFilter !== "ALL") && (
              <Button variant="ghost" onClick={clearFilters}>
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
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setPage(1);
                  }}
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
                  onChange={(event) => {
                    setWarehouse(event.target.value);
                    setPage(1);
                  }}
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
                  onChange={(event) => {
                    setStockFilter(event.target.value);
                    setPage(1);
                  }}
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

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">
              {displayProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-600">
              {totalCount}
            </span>{" "}
            products
          </p>

          {loading && (
            <span className="text-xs text-slate-400">
              Updating...
            </span>
          )}
        </div>

        {displayProducts.length > 0 ? (
          <ProductTable
            products={displayProducts}
            onView={(product) =>
              setSelectedProduct(product)
            }
            onEdit={
              canManage
                ? (product) => {
                    setEditingProduct(product);
                    setFormOpen(true);
                  }
                : undefined
            }
          />
        ) : (
          <div className="px-5 py-16 text-center">
            <p className="text-sm font-semibold text-slate-800">
              No products found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
            >
              Previous
            </Button>

            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>

            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) =>
                  Math.min(totalPages, current + 1),
                )
              }
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Add / Edit */}

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
          setActionError("");
        }}
        title={
          editingProduct ? "Edit Product" : "Add Product"
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
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
