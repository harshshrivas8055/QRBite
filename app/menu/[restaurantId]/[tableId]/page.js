// app/menu/[restaurantId]/[tableId]/page.js
import connectDB from "@/lib/db"
import Restaurant from "@/models/Restaurant"
import Table from "@/models/Table"
import Category from "@/models/Category"
import MenuItem from "@/models/MenuItem"
import { notFound } from "next/navigation"
import PublicMenuClient from "@/components/public-menu/PublicMenuClient"

export default async function PublicMenuPage({ params }) {
  const { restaurantId, tableId } = await params
  // tableId here is the tableNumber from URL e.g. "1" or "A1"

  await connectDB()

  const [restaurant, table, categories, items] = await Promise.all([
    Restaurant.findById(restaurantId),
    Table.findOne({ restaurantId, tableNumber: tableId, isActive: true }),
    Category.find({ restaurantId, isActive: true }).sort({ sortOrder: 1 }),
    MenuItem.find({ restaurantId, isAvailable: true }).sort({ sortOrder: 1 }),
  ])

  if (!restaurant || !restaurant.isActive) notFound()
  if (!table) notFound()

  return (
    <PublicMenuClient
      restaurant={JSON.parse(JSON.stringify(restaurant))}
      table={JSON.parse(JSON.stringify(table))}
      categories={JSON.parse(JSON.stringify(categories))}
      items={JSON.parse(JSON.stringify(items))}
    />
  )
}