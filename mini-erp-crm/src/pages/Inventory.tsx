import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Boxes,
    Package,
    Search,
  } from "lucide-react";
  
  import {
    useMemo,
    useState,
  } from "react";
  
  import PageHeader from "../components/common/PageHeader";
  import Button from "../components/ui/Button";
  import Modal from "../components/ui/Modal";
  
  import StockMovementForm from "../components/inventory/StockMovementForm";
  import MovementTable from "../components/inventory/MovementTable";
  
  import {
    products as initialProducts,
    stockMovements as initialMovements,
  } from "../data/mockData";
  
  import type {
    Product,
    StockMovement,
    StockMovementType,
  } from "../types";
  
  export default function Inventory() {
    const [productList, setProductList] =
      useState<Product[]>(
        initialProducts,
      );
  
    const [movements, setMovements] =
      useState<StockMovement[]>(
        initialMovements,
      );
  
    const [search, setSearch] =
      useState("");
  
    const [movementFilter, setMovementFilter] =
      useState("ALL");
  
    const [movementModalOpen, setMovementModalOpen] =
      useState(false);
  
    const filteredMovements =
      useMemo(() => {
        const query =
          search.trim().toLowerCase();
  
        return movements.filter(
          (movement) => {
            const matchesSearch =
              !query ||
              movement.productName
                .toLowerCase()
                .includes(query) ||
              movement.sku
                .toLowerCase()
                .includes(query) ||
              movement.reason
                .toLowerCase()
                .includes(query);
  
            const matchesType =
              movementFilter === "ALL" ||
              movement.movementType ===
                movementFilter;
  
            return (
              matchesSearch &&
              matchesType
            );
          },
        );
      }, [
        movements,
        search,
        movementFilter,
      ]);
  
    const totalUnits =
      productList.reduce(
        (sum, product) =>
          sum + product.currentStock,
        0,
      );
  
    const lowStock =
      productList.filter(
        (product) =>
          product.currentStock <=
          product.minimumStock,
      ).length;
  
    const totalStockIn =
      movements
        .filter(
          (movement) =>
            movement.movementType ===
            "IN",
        )
        .reduce(
          (sum, movement) =>
            sum + movement.quantity,
          0,
        );
  
    const totalStockOut =
      movements
        .filter(
          (movement) =>
            movement.movementType ===
            "OUT",
        )
        .reduce(
          (sum, movement) =>
            sum + movement.quantity,
          0,
        );
  
    const handleMovement = (
      productId: string,
      movementType: StockMovementType,
      quantity: number,
      reason: string,
    ) => {
      const product =
        productList.find(
          (item) =>
            item.id === productId,
        );
  
      if (!product) {
        return;
      }
  
      const newStock =
        movementType === "IN"
          ? product.currentStock +
            quantity
          : product.currentStock -
            quantity;
  
      setProductList((previous) =>
        previous.map((item) =>
          item.id === productId
            ? {
                ...item,
                currentStock: newStock,
                updatedAt:
                  new Date()
                    .toISOString()
                    .split("T")[0],
              }
            : item,
        ),
      );
  
      const newMovement: StockMovement = {
        id: `MOV-${String(
          movements.length + 1,
        ).padStart(3, "0")}`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity,
        movementType,
        reason,
        createdBy: "Arjun Mehta",
        createdAt:
          new Date().toLocaleString(
            "en-IN",
          ),
      };
  
      setMovements((previous) => [
        newMovement,
        ...previous,
      ]);
  
      setMovementModalOpen(false);
    };
  
    return (
      <div className="space-y-6">
        <PageHeader
          title="Inventory"
          description="Monitor stock levels and record inventory movements."
          action={
            <Button
              onClick={() =>
                setMovementModalOpen(true)
              }
            >
              <Boxes className="h-4 w-4" />
              Stock Movement
            </Button>
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
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search movements..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 sm:w-64"
                />
              </div>
  
              <select
                value={movementFilter}
                onChange={(event) =>
                  setMovementFilter(
                    event.target.value,
                  )
                }
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
  
          {filteredMovements.length > 0 ? (
            <MovementTable
              movements={
                filteredMovements
              }
            />
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
        </div>
  
        {/* Movement Modal */}
  
        <Modal
          open={movementModalOpen}
          onClose={() =>
            setMovementModalOpen(false)
          }
          title="Record Stock Movement"
          description="Record stock entering or leaving the warehouse."
          size="md"
        >
          <StockMovementForm
            products={productList}
            onSubmit={handleMovement}
            onCancel={() =>
              setMovementModalOpen(false)
            }
          />
        </Modal>
      </div>
    );
  }