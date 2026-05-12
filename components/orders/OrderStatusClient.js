"use client"

import { useState } from "react"
import { useSSE } from "@/hooks/useSSE"
import {
  SSE_EVENTS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "@/lib/constants"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import { CheckCircle2, Clock, ChefHat } from "lucide-react"
import BillButton from "@/components/bill/BillButton"

const STATUS_STEPS = ["PLACED", "ACCEPTED", "PREPARING", "READY", "SERVED"]

export default function OrderStatusClient({ order: initialOrder, restaurantId }) {
  const [order, setOrder] = useState(initialOrder)

  useSSE(restaurantId, {
    [SSE_EVENTS.ORDER_STATUS_UPDATE]: (data) => {
      if (data.orderId === initialOrder._id) {
        setOrder((prev) => ({ ...prev, status: data.status }))
      }
    },
  })

  const currentStep = STATUS_STEPS.indexOf(order.status)
  const isServed = order.status === "SERVED"

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ChefHat className="h-9 w-9 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Order Status</h1>
          <p className="text-muted-foreground text-sm">
            {order.orderNumber} • Table {order.tableNumber}
          </p>
        </div>

        {/* Current Status */}
        <div className="rounded-2xl border bg-card p-5 text-center space-y-2">
          <span
            className={cn(
              "inline-block px-4 py-1.5 rounded-full text-sm font-semibold",
              ORDER_STATUS_COLORS[order.status]
            )}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
          {!isServed ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Clock className="h-4 w-4 animate-pulse" />
              <span>Updating live...</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Your order has been served!</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Thank you for dining with us 😊
              </p>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStep
              const isCurrent = index === currentStep
              const isLast = index === STATUS_STEPS.length - 1
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    <span
                      className={cn(
                        "text-xs text-center",
                        isCurrent
                          ? "text-primary font-semibold"
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
        </div>

        {/* Order Summary */}
        <div className="rounded-2xl border bg-card p-5 space-y-3">
          <p className="font-semibold">Order Summary</p>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
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

          {/* Bill breakdown */}
          <div className="border-t pt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.taxAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(order.taxAmount)}</span>
              </div>
            )}
            {order.serviceChargeAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Charge</span>
                <span>{formatCurrency(order.serviceChargeAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Ordered at {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Download Bill — show when served */}
        {isServed && (
          <BillButton
            order={order}
            restaurantId={restaurantId}
            variant="default"
            size="default"
            className="w-full h-12"
          />
        )}
      </div>
    </div>
  )
}