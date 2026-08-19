import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Package,
  Search,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createStockMovement,
  fetchProductsForInventory,
  fetchStockMovements,
} from "../api/inventory";
import { ApiRequestError } from "../api/client";

import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

import StockMovementForm from "../components/inventory/StockMovementForm";
import MovementTable from "../components/inventory/MovementTable";

import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/permissions";

import type {
  Product,
  StockMovement,
  StockMovementType,
} from "../types";

const PAGE_SIZE = 20;

export default function Inventory() {
  const { user } = useAuth();
  const canManage =
    user &&
    hasPermission(user.role, "MANAGE_INVENTORY");

  const [productList, setProductList] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [statsMovements, setStatsMovements] =
    useState<StockMovement[]>([]);
  const [movementTotal, setMovementTotal] = useState(0);
  const [movementPage, setMovementPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [movementError, setMovementError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [movementFilter, setMovementFilter] = useState("ALL");

  const [movementModalOpen, setMovementModalOpen] =
    useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const loadProducts = useCallback(async () => {
    try {
      const products = await fetchProductsForInventory();
      setProductList(products);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "Failed to load inventory products.";

      setError(message);
    }
  }, []);

  const loadMovements = useCallback(async () => {
    try {
      const result = await fetchStockMovements({
        page: movementPage,
        limit: PAGE_SIZE,
        type:
          movementFilter === "ALL"
            ? undefined
            : (movementFilter as StockMovementType),
      });

      setMovements(result.movements);
      setMovementTotal(result.pagination.total);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "Failed to load stock movements.";

      setError(message);
    }
  }, [movementPage, movementFilter]);

  const loadStatsMovements = useCallback(async () => {
    try {
      const result = await fetchStockMovements({
        page: 1,
        limit: 100,
      });

      setStatsMovements(result.movements);
    } catch {
      // Stats are supplementary; ignore failures here.
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");

    await loadProducts();
    await loadMovements();
    await loadStatsMovements();

    setLoading(false);
  }, [loadProducts, loadMovements, loadStatsMovements]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const filteredMovements = useMemo(() => {
    const query = debouncedSearch.toLowerCase();

    if (!query) {
      return movements;
    }

    return movements.filter((movement) => {
      return (
        movement.productName
          .toLowerCase()
          .includes(query) ||
        movement.sku.toLowerCase().includes(query) ||
        movement.reason.toLowerCase().includes(query)
      );
    });
  }, [movements, debouncedSearch]);

  const totalUnits = useMemo(
    () =>
      productList.reduce(
        (sum, product) => sum + product.currentStock,
        0,
      ),
    [productList],
  );

  const lowStock = useMemo(
    () =>
      productList.filter(
        (product) =>
          product.currentStock <= product.minimumStock,
      ).length,
    [productList],
  );

  const totalStockIn = useMemo(
    () =>
      statsMovements
        .filter((movement) => movement.movementType === "IN")
        .reduce((sum, movement) => sum + movement.quantity, 0),
    [statsMovements],
  );

  const totalStockOut = useMemo(
    () =>
      statsMovements
        .filter((movement) => movement.movementType === "OUT")
        .reduce((sum, movement) => sum + movement.quantity, 0),
    [statsMovements],
  );

  const handleMovement = async (
    productId: string,
    movementType: StockMovementType,
    quantity: number,
    reason: string,
  ) => {
    setMovementError("");

    try {
      await createStockMovement({
        productId,
        type: movementType,
        quantity,
        reason,
      });

      setMovementModalOpen(false);
      await loadProducts();
      await loadMovements();
      await loadStatsMovements();
    } catch (err) {
      setMovementError(
        err instanceof ApiRequestError
          ? err.message
          : "Failed to record stock movement.",
      );
    }
  };

  const movementTotalPages = Math.max(
    1,
    Math.ceil(movementTotal / PAGE_SIZE),
  );

  if (loading && productList.length === 0 && movements.length === 0) {
    return <LoadingState message="Loading inventory..." />;
  }

  if (error && productList.length === 0 && movements.length === 0) {
    return (
      <ErrorState
        title="Unable to load inventory"
        description={error}
        onRetry={() => void loadAll()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Monitor stock levels and record inventory movements."
        action={
          canManage ? (
            <Button
              onClick={() => {
                setMovementError("");
                setMovementModalOpen(true);
              }}
            >
              <Boxes className="h-4 w-4" />
              Stock Movement
            </Button>
          ) : undefined
        }
      />

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Current Units
              </p>

              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {totalUnits}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <ArrowDownToLine className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Stock In
              </p>

              <p className="mt-1 text-2xl font-semibold text-slate-900">
                +{totalStockIn}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
              <ArrowUpFromLine className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Stock Out
              </p>

              <p className="mt-1 text-2xl font-semibold text-slate-900">
                -{totalStockOut}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Low Stock Products
          </p>

          <p className="mt-2 text-2xl font-semibold text-red-600">
            {lowStock}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Need attention
          </p>
        </div>
      </div>

      {/* Movement history */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Stock Movement History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Every stock-in and stock-out transaction.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search movements..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 sm:w-64"
              />
            </div>

            <select
              value={movementFilter}
              onChange={(event) => {
                setMovementFilter(event.target.value);
                setMovementPage(1);
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
            >
              <option value="ALL">
                All movements
              </option>

              <option value="IN">
                Stock In
              </option>

              <option value="OUT">
                Stock Out
              </option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">
              {filteredMovements.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-600">
              {movementTotal}
            </span>{" "}
            movements
          </p>

          {loading && (
            <span className="text-xs text-slate-400">
              Updating...
            </span>
          )}
        </div>

        {filteredMovements.length > 0 ? (
          <MovementTable movements={filteredMovements} />
        ) : (
          <div className="px-5 py-16 text-center">
            <p className="text-sm font-semibold text-slate-800">
              No movements found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        )}

        {movementTotalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <Button
              variant="secondary"
              disabled={movementPage <= 1}
              onClick={() =>
                setMovementPage((current) =>
                  Math.max(1, current - 1),
                )
              }
            >
              Previous
            </Button>

            <p className="text-sm text-slate-500">
              Page {movementPage} of {movementTotalPages}
            </p>

            <Button
              variant="secondary"
              disabled={movementPage >= movementTotalPages}
              onClick={() =>
                setMovementPage((current) =>
                  Math.min(movementTotalPages, current + 1),
                )
              }
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Movement Modal */}

      <Modal
        open={movementModalOpen}
        onClose={() => {
          setMovementModalOpen(false);
          setMovementError("");
        }}
        title="Record Stock Movement"
        description="Record stock entering or leaving the warehouse."
        size="md"
      >
        {movementError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {movementError}
          </div>
        )}

        <StockMovementForm
          products={productList}
          onSubmit={(productId, movementType, quantity, reason) => {
            void handleMovement(
              productId,
              movementType,
              quantity,
              reason,
            );
          }}
          onCancel={() => {
            setMovementModalOpen(false);
            setMovementError("");
          }}
        />
      </Modal>
    </div>
  );
}
