import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import connectDB from "@/lib/db"
import Order from "@/models/Order"
import KitchenClient from "@/components/kitchen/KitchenClient"

export default async function KitchenPage() {
  const session = await auth()

  if (!session) redirect("/login")
  if (!["ADMIN", "STAFF"].includes(session.user.role)) {
    redirect("/dashboard")
  }

  await connectDB()

  // Load active orders (not served/cancelled)
  const orders = await Order.find({
    restaurantId: session.user.restaurantId,
    status: { $in: ["PLACED", "ACCEPTED", "PREPARING", "READY"] },
  }).sort({ createdAt: 1 })

  return (
    <KitchenClient
      initialOrders={JSON.parse(JSON.stringify(orders))}
      restaurantId={session.user.restaurantId}
    />
  )
}