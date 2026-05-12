import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Order from "@/models/Order"
import Restaurant from "@/models/Restaurant"
import { auth } from "@/lib/auth"
import { sendEmail } from "@/lib/gmail"

export const runtime = "nodejs"

export async function GET(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const month = parseInt(searchParams.get("month") || new Date().getMonth() + 1)
    const year = parseInt(searchParams.get("year") || new Date().getFullYear())

    const restaurantId = session.user.restaurantId

    // Date range for the month
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    // Get all orders for the month
    const orders = await Order.find({
      restaurantId,
      createdAt: { $gte: startDate, $lte: endDate },
    })

    // Calculate stats
    const nonCancelledOrders = orders.filter((o) => o.status !== "CANCELLED")

    const totalOrders = nonCancelledOrders.length
    const totalRevenue = nonCancelledOrders.reduce(
      (sum, o) => sum + o.totalAmount,
      0
    )
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Total items sold
    const totalItemsSold = nonCancelledOrders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
      0
    )

    // Daily breakdown
    const dailyMap = {}
    nonCancelledOrders.forEach((order) => {
      const day = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      if (!dailyMap[day]) {
        dailyMap[day] = { date: day, orders: 0, revenue: 0 }
      }
      dailyMap[day].orders += 1
      dailyMap[day].revenue += order.totalAmount
    })
    const dailyData = Object.values(dailyMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    )

    // Top selling items
    const itemMap = {}
    nonCancelledOrders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.name
        if (!itemMap[key]) {
          itemMap[key] = { name: key, quantity: 0, revenue: 0 }
        }
        itemMap[key].quantity += item.quantity
        itemMap[key].revenue += item.price * item.quantity
      })
    })
    const topItems = Object.values(itemMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)

    // Status breakdown
    const statusMap = {}
    orders.forEach((order) => {
      if (!statusMap[order.status]) {
        statusMap[order.status] = 0
      }
      statusMap[order.status] += 1
    })
    const statusBreakdown = Object.entries(statusMap).map(
      ([status, count]) => ({
        status,
        count,
        percentage:
          orders.length > 0
            ? ((count / orders.length) * 100).toFixed(1)
            : "0.0",
      })
    )

    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue,
        avgOrderValue,
        totalItemsSold,
        dailyData,
        topItems,
        statusBreakdown,
        totalOrdersIncCancelled: orders.length,
        cancelledOrders: orders.length - totalOrders,
      },
      month,
      year,
    })
  } catch (error) {
    console.error("Monthly report error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - email report to restaurant owner
export async function POST(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { month, year, email } = await req.json()

    if (!month || !year || !email) {
      return NextResponse.json(
        { error: "Month, year and email are required" },
        { status: 400 }
      )
    }

    const restaurant = await Restaurant.findById(session.user.restaurantId)
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      )
    }

    const monthName = new Date(2000, month - 1, 1).toLocaleString("en-IN", {
      month: "long",
    })

    await sendEmail({
      to: email,
      subject: `${restaurant.name} — Monthly Report for ${monthName} ${year}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
          <div style="background: #141414; padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">
              📊 Monthly Report Ready
            </h1>
            <p style="color: #999; margin: 8px 0 0;">
              ${restaurant.name} — ${monthName} ${year}
            </p>
          </div>
          <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 15px;">
              Your monthly performance report for
              <strong>${monthName} ${year}</strong> has been generated.
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              Please download the report from your QRBite dashboard
              under <strong>Statistics → Monthly Report</strong>.
            </p>
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 24px;">
              <p style="color: #374151; font-size: 13px; margin: 0;">
                Log in to your dashboard to view and download the full PDF report
                with daily breakdowns, top items, and revenue analytics.
              </p>
            </div>
          </div>
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
            Powered by QRBite
          </p>
        </div>
      `,
    })

    return NextResponse.json({
      message: `Report notification sent to ${email}`,
    })
  } catch (error) {
    console.error("Email report error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}