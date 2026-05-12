import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import LoginForm from "@/components/auth/LoginForm"
import { ChefHat } from "lucide-react"
import { APP_NAME } from "@/lib/constants"
import Link from "next/link"
import { Suspense } from "react"
import Loader from "@/components/shared/Loader"

export default async function LoginPage() {
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
            Sign in to manage your restaurant
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
           <Suspense fallback={<Loader />}>
    <LoginForm />
  </Suspense>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline"
          >
            Register your restaurant
          </Link>
        </p>
      </div>
    </div>
  )
}