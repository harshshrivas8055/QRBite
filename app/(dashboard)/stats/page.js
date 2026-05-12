import { auth } from "@/lib/auth"
import connectDB from "@/lib/db"
import Order from "@/models/Order"
import Header from "@/components/dashboard/Header"
import StatsClient from "@/components/dashboard/StatsClient"

export default async function StatsPage() {
  const session = await auth()
  await connectDB()

  const restaurantId = session.user.restaurantId

  // Last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const orders = await Order.find({
    restaurantId,
    createdAt: { $gte: sevenDaysAgo },
    status: { $ne: "CANCELLED" },
  }).sort({ createdAt: 1 })

  // Total revenue last 7 days
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  // Group by day for charts
  const dailyData = {}
  orders.forEach((order) => {
    const day = new Date(order.createdAt).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    if (!dailyData[day]) {
      dailyData[day] = { day, orders: 0, revenue: 0 }
    }
    dailyData[day].orders += 1
    dailyData[day].revenue += order.totalAmount
  })

  const chartData = Object.values(dailyData)

  // Top items last 7 days
  const itemMap = {}
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!itemMap[item.name]) {
        itemMap[item.name] = { name: item.name, quantity: 0, revenue: 0 }
      }
      itemMap[item.name].quantity += item.quantity
      itemMap[item.name].revenue += item.price * item.quantity
    })
  })
  const topItems = Object.values(itemMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  return (
    <div className="flex flex-col h-full">
      <Header title="Statistics" />
      <div className="flex-1 p-6 overflow-y-auto">
        <StatsClient
          chartData={chartData}
          totalOrders={orders.length}
          totalRevenue={totalRevenue}
          topItems={topItems}
        />
      </div>
    </div>
  )
}