import { auth } from "@/lib/auth"
import connectDB from "@/lib/db"
import Order from "@/models/Order"
import Header from "@/components/dashboard/Header"
import OrdersClient from "@/components/orders/OrdersClient"

export default async function OrdersPage() {
  const session = await auth()
  await connectDB()

  const orders = await Order.find({
    restaurantId: session.user.restaurantId,
  })
    .sort({ createdAt: -1 })
    .limit(100)

  return (
    <div className="flex flex-col h-full">
      <Header title="Orders" />
      <div className="flex-1 p-6">
        <OrdersClient
          orders={JSON.parse(JSON.stringify(orders))}
          restaurantId={session.user.restaurantId.toString()}
        />
      </div>
    </div>
  )
}