"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { ChevronRight, Clock } from "lucide-react"
import BillButton from "@/components/bill/BillButton"

function useElapsedTime(createdAt) {
  const [elapsed, setElapsed] = useState("")

  useEffect(() => {
    function update() {
      const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000)
      if (diff < 60) setElapsed(`${diff}s ago`)
      else if (diff < 3600) setElapsed(`${Math.floor(diff / 60)}m ago`)
      else setElapsed(`${Math.floor(diff / 3600)}h ago`)
    }
    update()
    const timer = setInterval(update, 10000)
    return () => clearInterval(timer)
  }, [createdAt])

  return elapsed
}

export default function KitchenOrderCard({
  order,
  onStatusUpdate,
  restaurantId,
}) {
  const elapsed = useElapsedTime(order.createdAt)
  const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status)
  const nextStatus = ORDER_STATUS_FLOW[currentIndex + 1]

  const ageMinutes = (Date.now() - new Date(order.createdAt)) / 1000 / 60
  const urgencyClass =
    ageMinutes > 20
      ? "border-red-500"
      : ageMinutes > 10
      ? "border-yellow-500"
      : "border-gray-700"

  return (
    <div className={`rounded-xl border ${urgencyClass} bg-gray-800 p-4 space-y-3`}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-white text-sm">{order.orderNumber}</p>
          <p className="text-xs text-gray-400">Table {order.tableNumber}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          <span>{elapsed}</span>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1.5 border-t border-gray-700 pt-3">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-200">
              <span className="font-bold text-white mr-1">
                ×{item.quantity}
              </span>
              {item.name}
              {item.variantLabel && (
                <span className="ml-1 text-xs text-yellow-400">
                  ({item.variantLabel})
                </span>
              )}
            </span>
            <span className="text-gray-400">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Customer note */}
      {order.customerNote && (
        <p className="text-xs bg-gray-700 rounded-lg px-3 py-2 text-yellow-300">
          📝 {order.customerNote}
        </p>
      )}

      {/* Total */}
      <div className="flex justify-between text-sm border-t border-gray-700 pt-2">
        <span className="text-gray-400">Total</span>
        <span className="font-bold text-white">
          {formatCurrency(order.totalAmount)}
        </span>
      </div>

      {/* Next status button */}
      {nextStatus && order.status !== "READY" && (
        <Button
          className="w-full"
          size="sm"
          onClick={() => onStatusUpdate(order._id, nextStatus)}
        >
          {ORDER_STATUS_LABELS[nextStatus]}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      )}

      {/* Ready — mark served + generate bill */}
      {order.status === "READY" && (
        <div className="space-y-2">
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            size="sm"
            onClick={() => onStatusUpdate(order._id, "SERVED")}
          >
            ✅ Mark Served
          </Button>
          {restaurantId && (
            <BillButton
              order={order}
              restaurantId={restaurantId}
              variant="outline"
              size="sm"
              className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
            />
          )}
        </div>
      )}
    </div>
  )
}