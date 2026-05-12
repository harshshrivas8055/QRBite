"use client"

import { formatCurrency, formatTime } from "@/lib/utils"
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_FLOW,
} from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import BillButton from "@/components/bill/BillButton"
import { useSession } from "next-auth/react"

export default function OrderCard({ order, onStatusUpdate }) {
  const { data: session } = useSession()
  const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status)
  const nextStatus = ORDER_STATUS_FLOW[currentIndex + 1]
  const isCompleted =
    order.status === "SERVED" || order.status === "CANCELLED"

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">{order.orderNumber}</p>
          <p className="text-xs text-muted-foreground">
            Table {order.tableNumber} • {formatTime(order.createdAt)}
          </p>
        </div>
        <span
          className={cn(
            "text-xs px-2.5 py-1 rounded-full font-medium",
            ORDER_STATUS_COLORS[order.status]
          )}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-1.5 border-t border-b py-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.quantity}× {item.name}
              {item.variantLabel && (
                <span className="ml-1 text-xs text-primary">
                  ({item.variantLabel})
                </span>
              )}
            </span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Customer note */}
      {order.customerNote && (
        <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
          📝 {order.customerNote}
        </p>
      )}

      {/* Bill breakdown */}
      <div className="space-y-1">
        {order.taxAmount > 0 && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Tax</span>
            <span>{formatCurrency(order.taxAmount)}</span>
          </div>
        )}
        {order.serviceChargeAmount > 0 && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Service Charge</span>
            <span>{formatCurrency(order.serviceChargeAmount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-bold">{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      {/* Action Button — move to next status */}
      {!isCompleted && nextStatus && (
        <Button
          className="w-full"
          onClick={() => onStatusUpdate(order._id, nextStatus)}
        >
          Mark as {ORDER_STATUS_LABELS[nextStatus]}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}

      {/* Served — show bill download */}
      {order.status === "SERVED" && (
        <div className="space-y-2">
          <div className="text-center text-sm text-green-600 font-medium">
            ✅ Order Complete
          </div>
          {session?.user?.restaurantId && (
            <BillButton
              order={order}
              restaurantId={session.user.restaurantId}
              variant="outline"
              size="sm"
              className="w-full"
            />
          )}
        </div>
      )}
    </div>
  )
}