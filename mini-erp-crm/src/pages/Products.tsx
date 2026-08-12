import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import { Plus } from "lucide-react";

export default function Products() {
  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage products, pricing and stock thresholds."
        action={
          <Button>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        }
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">
          Product management module coming next.
        </p>
      </div>
    </div>
  );
}