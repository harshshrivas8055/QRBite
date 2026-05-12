"use client"

import { useState } from "react"
import { ShoppingBag } from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import EmptyState from "@/components/shared/EmptyState"
import OrderCard from "./OrderCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSSE } from "@/hooks/useSSE"
import { SSE_EVENTS } from "@/lib/constants"
import toast from "react-hot-toast"

const TABS = [
  { label: "All", value: "ALL" },
  { label: "Placed", value: "PLACED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Ready", value: "READY" },
  { label: "Served", value: "SERVED" },
]

export default function OrdersClient({ orders: initialOrders, restaurantId }) {
  const [orders, setOrders] = useState(initialOrders)
  const [activeTab, setActiveTab] = useState("ALL")

  // Real-time SSE updates
  useSSE(restaurantId, {
    [SSE_EVENTS.NEW_ORDER]: (data) => {
      if (!data?.order) return
      setOrders((prev) => {
        const exists = prev.find((o) => o._id === data.order._id)
        if (exists) return prev
        return [data.order, ...prev]
      })
      toast.success(
        `🆕 New order from Table ${data.order.tableNumber}!`,
        { duration: 5000 }
      )
    },
    [SSE_EVENTS.ORDER_STATUS_UPDATE]: (data) => {
      if (!data?.orderId) return
      setOrders((prev) =>
        prev.map((o) =>
          o._id === data.orderId ? { ...o, status: data.status } : o
        )
      )
    },
  })

  async function handleStatusUpdate(orderId, status) {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      // Optimistic update immediately without waiting for SSE
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: result.order.status } : o
        )
      )
      toast.success(`Order marked as ${status}`)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const filteredOrders =
    activeTab === "ALL"
      ? orders
      : orders.filter((o) => o.status === activeTab)

  return (
    <div>
      <PageHeader
        title="Orders"
        description={`${orders.length} total orders`}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          {TABS.map((tab) => {
            const count =
              tab.value === "ALL"
                ? orders.length
                : orders.filter((o) => o.status === tab.value).length
            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                <span className="ml-1.5 text-xs opacity-60">({count})</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredOrders.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No orders"
              description="No orders in this category"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}