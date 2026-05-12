import connectDB from "@/lib/db"
import Order from "@/models/Order"
import { notFound } from "next/navigation"
import OrderStatusClient from "@/components/orders/OrderStatusClient"

export default async function OrderStatusPage({ params }) {
  const { orderId } = await params
  await connectDB()

  const order = await Order.findById(orderId)
  if (!order) notFound()

  return (
    <OrderStatusClient
      order={JSON.parse(JSON.stringify(order))}
      restaurantId={order.restaurantId.toString()}
    />
  )
}