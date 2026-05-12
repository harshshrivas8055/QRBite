import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar"

export default async function SuperAdminLayout({ children }) {
  const session = await auth()

  if (!session) redirect("/login")
  if (session.user.role !== "SUPER_ADMIN") redirect("/dashboard")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}