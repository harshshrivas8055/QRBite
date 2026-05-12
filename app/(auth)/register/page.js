import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import RegisterForm from "@/components/auth/RegisterForm"
import { ChefHat } from "lucide-react"
import { APP_NAME } from "@/lib/constants"
import Link from "next/link"

export default async function RegisterPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <ChefHat className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">{APP_NAME}</h1>
          <p className="text-muted-foreground text-sm">
            Register your restaurant and get started
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <RegisterForm />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}