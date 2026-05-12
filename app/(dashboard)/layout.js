import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/Sidebar"

export default async function DashboardLayout({ children }) {
  const session = await auth()

  if (!session) redirect("/login")

  if (session.user.role === "SUPER_ADMIN") {
    redirect("/super-admin")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}