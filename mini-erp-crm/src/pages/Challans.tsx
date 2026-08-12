import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import { Plus } from "lucide-react";

export default function Challans() {
  return (
    <div>
      <PageHeader
        title="Sales Challans"
        description="Create, manage and confirm sales challans."
        action={
          <Button>
            <Plus className="h-4 w-4" />
            Create Challan
          </Button>
        }
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">
          Sales challan module coming next.
        </p>
      </div>
    </div>
  );
}