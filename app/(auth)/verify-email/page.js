import { ChefHat } from "lucide-react"
import { APP_NAME } from "@/lib/constants"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <ChefHat className="h-9 w-9 text-primary-foreground" />
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm space-y-4">
          <div className="text-5xl">✉️</div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We sent a verification link to your email address.
            Please click the link to verify your account and
            activate your restaurant.
          </p>
          <div className="bg-muted rounded-xl p-4 text-sm text-muted-foreground">
            <p>The link will expire in <strong>24 hours</strong>.</p>
            <p className="mt-1">Check your spam folder if you don't see it.</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Already verified?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}