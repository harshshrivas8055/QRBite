import { auth } from "@/lib/auth"
import connectDB from "@/lib/db"
import User from "@/models/User"
import Header from "@/components/dashboard/Header"
import StaffClient from "@/components/staff/StaffClient"

export default async function StaffPage() {
  const session = await auth()
  await connectDB()

  const staff = await User.find({
    restaurantId: session.user.restaurantId,
    role: "STAFF",
  })
    .select("-password")
    .sort({ createdAt: -1 })

  return (
    <div className="flex flex-col h-full">
      <Header title="Staff Management" />
      <div className="flex-1 p-6">
        <StaffClient staff={JSON.parse(JSON.stringify(staff))} />
      </div>
    </div>
  )
}