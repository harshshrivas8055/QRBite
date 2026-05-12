"use client"

import { useEffect, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useSSE } from "@/hooks/useSSE"
import { SSE_EVENTS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants"
import { cn, formatCurrency } from "@/lib/utils"
import { CheckCircle2, Clock } from "lucide-react"

const STATUS_STEPS = ["PLACED", "ACCEPTED", "PREPARING", "READY", "SERVED"]

export default function OrderSuccessSheet({
  order: initialOrder,
  open,
  onClose,
  restaurantId,
}) {
  const [order, setOrder] = useState(initialOrder)

  useSSE(restaurantId, {
    [SSE_EVENTS.ORDER_STATUS_UPDATE]: (data) => {
      if (data.orderId === initialOrder._id) {
        setOrder((prev) => ({ ...prev, status: data.status }))
      }
    },
  })

  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl">
        <SheetHeader className="mb-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
            </div>
          </div>
          <SheetTitle>Order Placed! 🎉</SheetTitle>
          <p className="text-muted-foreground text-sm">
            {order.orderNumber} • Table {order.tableNumber}
          </p>
        </SheetHeader>

        {/* Live Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Order Status</p>
            <span
              className={cn(
                "text-xs px-2.5 py-1 rounded-full font-medium",
                ORDER_STATUS_COLORS[order.status]
              )}
            >
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-0 mt-4">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStep
              const isCurrent = index === currentStep
              const isLast = index === STATUS_STEPS.length - 1
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    <span
                      className={cn(
                        "text-xs whitespace-nowrap",
                        isCurrent
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {ORDER_STATUS_LABELS[step].split(" ")[0]}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-1 mb-5 transition-all",
                        index < currentStep ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {order.status !== "SERVED" && (
            <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground text-sm">
              <Clock className="h-4 w-4 animate-pulse" />
              <span>Live updates will appear automatically</span>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="rounded-xl border p-4 space-y-2 mb-4">
          <p className="text-sm font-semibold mb-3">Order Summary</p>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.quantity}× {item.name}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {order.status === "SERVED" ? (
          <Button className="w-full" onClick={onClose}>
            Thank you! Enjoy your meal 😊
          </Button>
        ) : (
          <Button variant="outline" className="w-full" onClick={onClose}>
            Back to Menu
          </Button>
        )}
      </SheetContent>
    </Sheet>
  )
}