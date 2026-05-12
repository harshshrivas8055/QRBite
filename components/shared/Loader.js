import { cn } from "@/lib/utils"

export default function Loader({ size = "md", className }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-muted border-t-primary",
          sizes[size]
        )}
      />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader size="lg" />
    </div>
  )
}