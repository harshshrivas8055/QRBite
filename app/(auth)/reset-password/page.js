import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import ResetPasswordForm from "@/components/auth/ResetPasswordForm"
import { ChefHat } from "lucide-react"
import Link from "next/link"
import Loader from "@/components/shared/Loader"

export default async function ResetPasswordPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <ChefHat className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Set new password</h1>
          <p className="text-muted-foreground text-sm">
            Choose a strong password for your account
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <Suspense fallback={<Loader />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary font-medium hover:underline">
            Back to Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}