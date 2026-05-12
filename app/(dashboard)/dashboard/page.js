import { auth } from "@/lib/auth"
import connectDB from "@/lib/db"
import Order from "@/models/Order"
import Restaurant from "@/models/Restaurant"
import StatsCard from "@/components/dashboard/StatsCard"
import RecentOrders from "@/components/dashboard/RecentOrders"
import PageHeader from "@/components/shared/PageHeader"
import Header from "@/components/dashboard/Header"
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await auth()
  await connectDB()

  const restaurantId = session.user.restaurantId

  // Get today's date range
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [todayOrders, pendingOrders, restaurant, recentOrders] =
    await Promise.all([
      Order.find({
        restaurantId,
        createdAt: { $gte: today, $lt: tomorrow },
      }),
      Order.countDocuments({
        restaurantId,
        status: { $in: ["PLACED", "ACCEPTED", "PREPARING"] },
      }),
      Restaurant.findById(restaurantId),
      Order.find({ restaurantId })
        .sort({ createdAt: -1 })
        .limit(8),
    ])

  const todayRevenue = todayOrders.reduce(
    (sum, o) => sum + (o.status !== "CANCELLED" ? o.totalAmount : 0),
    0
  )
  const completedToday = todayOrders.filter(
    (o) => o.status === "SERVED"
  ).length

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title={`Welcome back! 👋`}
          description={restaurant?.name || "Your Restaurant"}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            title="Today's Orders"
            value={todayOrders.length}
            subtitle="orders today"
            icon={ShoppingBag}
          />
          <StatsCard
            title="Today's Revenue"
            value={formatCurrency(todayRevenue)}
            subtitle="from served orders"
            icon={DollarSign}
          />
          <StatsCard
            title="Pending Orders"
            value={pendingOrders}
            subtitle="need attention"
            icon={Clock}
          />
          <StatsCard
            title="Completed"
            value={completedToday}
            subtitle="served today"
            icon={CheckCircle}
          />
        </div>

        {/* Recent Orders */}
        <RecentOrders orders={JSON.parse(JSON.stringify(recentOrders))} />
      </div>
    </div>
  )
}