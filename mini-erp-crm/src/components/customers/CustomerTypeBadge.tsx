import Badge from "../ui/Badge";

import type {
  CustomerType,
} from "../../types";

interface Props {
  type: CustomerType;
}

export default function CustomerTypeBadge({
  type,
}: Props) {
  return (
    <Badge variant="info">
      {type}
    </Badge>
  );
}