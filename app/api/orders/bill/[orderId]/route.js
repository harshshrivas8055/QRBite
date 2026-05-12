import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Order from "@/models/Order"
import { auth } from "@/lib/auth"

export const runtime = "nodejs"

// PATCH - mark bill as generated
export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { orderId } = await params

    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        restaurantId: session.user.restaurantId,
      },
      {
        $set: {
          billGenerated: true,
          billGeneratedAt: new Date(),
        },
      },
      { new: true }
    )

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Bill marked as generated",
      order,
    })
  } catch (error) {
    console.error("Bill PATCH error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}