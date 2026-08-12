import Badge from "../ui/Badge";

interface ProductStockBadgeProps {
  currentStock: number;
  minimumStock: number;
}

export default function ProductStockBadge({
  currentStock,
  minimumStock,
}: ProductStockBadgeProps) {
  if (currentStock === 0) {
    return (
      <Badge variant="danger">
        Out of Stock
      </Badge>
    );
  }

  if (currentStock <= minimumStock) {
    return (
      <Badge variant="warning">
        Low Stock
      </Badge>
    );
  }

  return (
    <Badge variant="success">
      In Stock
    </Badge>
  );
}