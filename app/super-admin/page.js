import connectDB from "@/lib/db"
import Restaurant from "@/models/Restaurant"
import User from "@/models/User"
import Order from "@/models/Order"
import StatsCard from "@/components/dashboard/StatsCard"
import PlatformStats from "@/components/super-admin/PlatformStats"
import PageHeader from "@/components/shared/PageHeader"
import {
  Store,
  Users,
  ShoppingBag,
  TrendingUp,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default async function SuperAdminPage() {
  await connectDB()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalRestaurants,
    activeRestaurants,
    totalUsers,
    totalOrders,
    todayOrders,
    recentRestaurants,
  ] = await Promise.all([
    Restaurant.countDocuments(),
    Restaurant.countDocuments({ isActive: true }),
    User.countDocuments({ role: { $ne: "SUPER_ADMIN" } }),
    Order.countDocuments(),
    Order.find({ createdAt: { $gte: today } }),
    Restaurant.find({})
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 })
      .limit(5),
  ])

  const todayRevenue = todayOrders.reduce(
    (sum, o) => (o.status !== "CANCELLED" ? sum + o.totalAmount : sum),
    0
  )

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Platform Overview"
        description="Monitor all restaurants on the platform"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Restaurants"
          value={totalRestaurants}
          subtitle={`${activeRestaurants} active`}
          icon={Store}
        />
        <StatsCard
          title="Total Users"
          value={totalUsers}
          subtitle="admins & staff"
          icon={Users}
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          subtitle="all time"
          icon={ShoppingBag}
        />
        <StatsCard
          title="Today's Revenue"
          value={formatCurrency(todayRevenue)}
          subtitle="across all restaurants"
          icon={TrendingUp}
        />
      </div>

      {/* Recent Restaurants */}
      <PlatformStats
        restaurants={JSON.parse(JSON.stringify(recentRestaurants))}
      />
    </div>
  )
}