import { auth } from "@/lib/auth"
import connectDB from "@/lib/db"
import Restaurant from "@/models/Restaurant"
import Header from "@/components/dashboard/Header"
import SettingsClient from "@/components/dashboard/SettingsClient"

export default async function SettingsPage() {
  const session = await auth()
  await connectDB()

  const restaurant = await Restaurant.findById(session.user.restaurantId)

  if (!restaurant) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Settings" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-muted-foreground">Restaurant not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" />
      <div className="flex-1 p-6 overflow-y-auto">
        <SettingsClient
          restaurant={JSON.parse(JSON.stringify(restaurant))}
        />
      </div>
    </div>
  )
}