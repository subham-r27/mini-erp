import Badge from "../ui/Badge";

import type {
  InvoiceStatus,
} from "../../types";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export default function InvoiceStatusBadge({
  status,
}: InvoiceStatusBadgeProps) {
  if (status === "ISSUED") {
    return (
      <Badge variant="success">
        Issued
      </Badge>
    );
  }

  if (status === "PAID") {
    return (
      <Badge variant="success">
        Paid
      </Badge>
    );
  }

  if (status === "CANCELLED") {
    return (
      <Badge variant="danger">
        Cancelled
      </Badge>
    );
  }

  return (
    <Badge variant="warning">
      Draft
    </Badge>
  );
}