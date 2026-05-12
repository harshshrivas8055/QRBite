import { auth } from "@/lib/auth"
import connectDB from "@/lib/db"
import Table from "@/models/Table"
import Restaurant from "@/models/Restaurant"
import Header from "@/components/dashboard/Header"
import TablesClient from "@/components/tables/TableClient"

export default async function TablesPage() {
  const session = await auth()
  await connectDB()

  const [tables, restaurant] = await Promise.all([
    Table.find({ restaurantId: session.user.restaurantId }).sort({ tableNumber: 1 }),
    Restaurant.findById(session.user.restaurantId),
  ])

  return (
    <div className="flex flex-col h-full">
      <Header title="Tables & QR Codes" />
      <div className="flex-1 p-6">
        <TablesClient
          tables={JSON.parse(JSON.stringify(tables))}
          restaurantId={session.user.restaurantId.toString()}
          restaurant={JSON.parse(JSON.stringify(restaurant))}
        />
      </div>
    </div>
  )
}
