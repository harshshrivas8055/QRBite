import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <ChefHat className="h-9 w-9 text-primary-foreground" />
        </div>
        <h1 className="text-5xl font-bold">404</h1>
        <p className="text-xl font-semibold">Page not found</p>
        <p className="text-muted-foreground text-sm max-w-sm">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}