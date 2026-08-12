import PageHeader from "../components/common/PageHeader";

export default function Invoices() {
  return (
    <div>
      <PageHeader
        title="Invoices"
        description="View and download generated invoices."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">
          Invoice module coming next.
        </p>
      </div>
    </div>
  );
}