import PageHeader from "../components/common/PageHeader";

export default function Users() {
  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage employees and role permissions."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">
          User management module coming next.
        </p>
      </div>
    </div>
  );
}