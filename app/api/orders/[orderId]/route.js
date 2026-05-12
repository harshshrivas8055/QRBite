import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Order from "@/models/Order"
import { auth } from "@/lib/auth"

export const runtime = "nodejs"
// GET - get single order (public for order tracking)
export async function GET(req, { params }) {
  try {
    await connectDB()
    const { orderId } = await params

    const order = await Order.findById(orderId)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}