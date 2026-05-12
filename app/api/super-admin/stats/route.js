import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Restaurant from "@/models/Restaurant"
import User from "@/models/User"
import Order from "@/models/Order"
import { auth } from "@/lib/auth"

export const runtime = "nodejs"
export async function GET(req) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const [totalRestaurants, activeRestaurants, totalUsers, totalOrders] =
      await Promise.all([
        Restaurant.countDocuments(),
        Restaurant.countDocuments({ isActive: true }),
        User.countDocuments({ role: { $ne: "SUPER_ADMIN" } }),
        Order.countDocuments(),
      ])

    return NextResponse.json({
      stats: {
        totalRestaurants,
        activeRestaurants,
        totalUsers,
        totalOrders,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}