// app/error.js
"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground text-sm">
          {error?.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}