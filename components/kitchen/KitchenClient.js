"use client";

import { useState } from "react";
import { useSSE } from "@/hooks/useSSE";
import { SSE_EVENTS } from "@/lib/constants";
import KitchenHeader from "./KitchenHeader";
import KitchenOrderCard from "./KitchenOrderCard";
import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

function playNotification() {
  try {
    // Try MP3 first
    const audio = new Audio("/notification.mp3")
    audio.volume = 0.5

    audio.play().catch(() => {
      // Fallback beep if autoplay blocked or file missing
      try {
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext

        if (!AudioContextClass) return

        const ctx = new AudioContextClass()

        const oscillator = ctx.createOscillator()
        const gain = ctx.createGain()

        oscillator.connect(gain)
        gain.connect(ctx.destination)

        oscillator.frequency.value = 800
        oscillator.type = "sine"

        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + 0.3
        )

        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.3)
      } catch {}
    })
  } catch {}
}

const STATUS_COLUMNS = [
  { status: "PLACED", label: "🆕 New Orders", color: "border-blue-400" },
  { status: "ACCEPTED", label: "✅ Accepted", color: "border-yellow-400" },
  { status: "PREPARING", label: "👨‍🍳 Preparing", color: "border-orange-400" },
  { status: "READY", label: "🔔 Ready", color: "border-green-400" },
];

const ACTIVE_STATUSES = STATUS_COLUMNS.map((c) => c.status);

export default function KitchenClient({ initialOrders, restaurantId }) {
  const [orders, setOrders] = useState(initialOrders);

  useSSE(restaurantId, {
    [SSE_EVENTS.NEW_ORDER]: (data) => {
      if (!data?.order) return;
      setOrders((prev) => {
        const exists = prev.find((o) => o._id === data.order._id);
        if (exists) return prev;
        return [data.order, ...prev];
      });
      toast.success(`🆕 New order from Table ${data.order.tableNumber}!`, {
        duration: 5000,
      });
      playNotification();
    },
    [SSE_EVENTS.ORDER_STATUS_UPDATE]: (data) => {
      if (!data?.orderId) return;
      setOrders((prev) => {
        if (["SERVED", "CANCELLED"].includes(data.status)) {
          return prev.filter((o) => o._id !== data.orderId);
        }
        return prev.map((o) =>
          o._id === data.orderId ? { ...o, status: data.status } : o,
        );
      });
    },
  });

  async function handleStatusUpdate(orderId, status) {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      // Optimistic update immediately
      if (["SERVED", "CANCELLED"].includes(status)) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <KitchenHeader orderCount={activeOrders.length} />

      <div className="flex-1 p-4 overflow-x-auto">
        {activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4 text-gray-500">
            <ShoppingBag className="h-16 w-16" />
            <p className="text-xl font-medium">No active orders</p>
            <p className="text-sm">New orders will appear here in real time</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-w-max xl:min-w-0">
            {STATUS_COLUMNS.map(({ status, label, color }) => {
              const columnOrders = orders.filter((o) => o.status === status);
              return (
                <div key={status} className="min-w-72">
                  <div
                    className={`rounded-xl border-t-4 ${color} bg-gray-900 p-3 mb-3 flex items-center justify-between`}
                  >
                    <span className="font-semibold text-sm">{label}</span>
                    <span className="bg-gray-700 text-xs px-2 py-0.5 rounded-full">
                      {columnOrders.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {columnOrders.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-gray-700 p-6 text-center text-gray-600 text-sm">
                        No orders
                      </div>
                    ) : (
                      columnOrders.map((order) => (
                        <KitchenOrderCard
                          key={order._id}
                          order={order}
                          onStatusUpdate={handleStatusUpdate}
                          restaurantId={restaurantId}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
