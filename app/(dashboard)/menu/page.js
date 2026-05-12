import { auth } from "@/lib/auth"
import connectDB from "@/lib/db"
import Category from "@/models/Category"
import MenuItem from "@/models/MenuItem"
import Header from "@/components/dashboard/Header"
import MenuClient from "@/components/menu/MenuClient"

export default async function MenuPage() {
  const session = await auth()
  await connectDB()

  const [categories, items] = await Promise.all([
    Category.find({ restaurantId: session.user.restaurantId }).sort({
      sortOrder: 1,
    }),
    MenuItem.find({ restaurantId: session.user.restaurantId }).sort({
      sortOrder: 1,
    }),
  ])

  return (
    <div className="flex flex-col h-full">
      <Header title="Menu Management" />
      <div className="flex-1 p-6">
        <MenuClient
          categories={JSON.parse(JSON.stringify(categories))}
          items={JSON.parse(JSON.stringify(items))}
        />
      </div>
    </div>
  )
}