import { formatCurrency, formatTime } from "@/lib/utils"
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function RecentOrders({ orders = [] }) {
  if (!orders.length) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-4">Recent Orders</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No orders yet today
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-4">Recent Orders</h3>
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-xs font-bold">T{order.tableNumber}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {order.items.length} items • {formatTime(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">
                {formatCurrency(order.totalAmount)}
              </span>
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  ORDER_STATUS_COLORS[order.status]
                )}
              >
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}