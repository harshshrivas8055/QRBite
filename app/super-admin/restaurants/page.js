import connectDB from "@/lib/db"
import Restaurant from "@/models/Restaurant"
import Order from "@/models/Order"
import PageHeader from "@/components/shared/PageHeader"
import RestaurantsClient from "@/components/super-admin/RestaurantsClient"

export default async function SuperAdminRestaurantsPage() {
  await connectDB()

  const restaurants = await Restaurant.find({})
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 })

  // Get order counts per restaurant
  const orderCounts = await Order.aggregate([
    { $group: { _id: "$restaurantId", count: { $sum: 1 } } },
  ])

  const orderCountMap = {}
  orderCounts.forEach((o) => {
    orderCountMap[o._id.toString()] = o.count
  })

  const restaurantsWithStats = restaurants.map((r) => ({
    ...r.toObject(),
    orderCount: orderCountMap[r._id.toString()] || 0,
  }))

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="All Restaurants"
        description={`${restaurants.length} restaurants on the platform`}
      />
      <RestaurantsClient
        restaurants={JSON.parse(JSON.stringify(restaurantsWithStats))}
      />
    </div>
  )
}