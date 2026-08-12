import PageHeader from "../components/common/PageHeader";

export default function Inventory() {
  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Monitor stock levels and stock movements."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">
          Inventory module coming next.
        </p>
      </div>
    </div>
  );
}