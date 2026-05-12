import { cn } from "@/lib/utils"
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/constants"

export default function OrderStatusBadge({ status, size = "sm" }) {
  const sizeClass = size === "sm"
    ? "text-xs px-2.5 py-1"
    : "text-sm px-3 py-1.5"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeClass,
        ORDER_STATUS_COLORS[status]
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  )
}