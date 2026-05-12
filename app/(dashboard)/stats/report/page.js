import { auth } from "@/lib/auth"
import connectDB from "@/lib/db"
import Restaurant from "@/models/Restaurant"
import User from "@/models/User"
import Header from "@/components/dashboard/Header"
import ReportClient from "@/components/report/ReportClient"

export default async function ReportPage() {
  const session = await auth()
  await connectDB()

  const [restaurant, user] = await Promise.all([
    Restaurant.findById(session.user.restaurantId),
    User.findById(session.user.id).select("-password"),
  ])

  return (
    <div className="flex flex-col h-full">
      <Header title="Monthly Report" />
      <div className="flex-1 p-6 overflow-y-auto">
        <ReportClient
          restaurant={JSON.parse(JSON.stringify(restaurant))}
          userEmail={user.email}
        />
      </div>
    </div>
  )
}