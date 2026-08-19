import Badge from "../ui/Badge";

import type {
  CustomerStatus,
} from "../../types";

interface Props {
  status: CustomerStatus;
}

export default function CustomerStatusBadge({
  status,
}: Props) {
  const variant =
    status === "ACTIVE"
      ? "success"
      : status === "LEAD"
        ? "warning"
        : "neutral";

  return (
    <Badge variant={variant}>
      {status}
    </Badge>
  );
}