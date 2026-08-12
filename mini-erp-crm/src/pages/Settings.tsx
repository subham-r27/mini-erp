import PageHeader from "../components/common/PageHeader";

export default function Settings() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your ERP application."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">
          Settings module coming next.
        </p>
      </div>
    </div>
  );
}