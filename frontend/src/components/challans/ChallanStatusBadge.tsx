import Badge from "../ui/Badge";

import type {
  ChallanStatus,
} from "../../types";

interface ChallanStatusBadgeProps {
  status: ChallanStatus;
}

export default function ChallanStatusBadge({
  status,
}: ChallanStatusBadgeProps) {
  if (status === "CONFIRMED") {
    return (
      <Badge variant="success">
        Confirmed
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