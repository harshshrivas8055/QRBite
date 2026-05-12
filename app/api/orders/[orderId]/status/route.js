import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Order from "@/models/Order"
import { auth } from "@/lib/auth"
import { sendSSEEvent } from "@/lib/sse"
import { SSE_EVENTS, ORDER_STATUS_FLOW } from "@/lib/constants"

export const runtime = "nodejs"

// PATCH - update order status
export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { orderId } = await params
    const { status } = await req.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Validate status value
    if (!ORDER_STATUS_FLOW.includes(status) && status !== "CANCELLED") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Verify order belongs to this restaurant
    if (order.restaurantId.toString() !== session.user.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    order.status = status
    await order.save()

    // Send SSE event to customer and kitchen
    sendSSEEvent(order.restaurantId.toString(), SSE_EVENTS.ORDER_STATUS_UPDATE, {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      status: order.status,
      tableNumber: order.tableNumber,
    })

    return NextResponse.json({
      message: "Order status updated",
      order,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}