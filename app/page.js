import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function HomePage() {
  const session = await auth()

  if (session) {
    if (session.user.role === "SUPER_ADMIN") {
      redirect("/super-admin")
    }
    redirect("/dashboard")
  }

  redirect("/login")
}