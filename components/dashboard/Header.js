"use client"

import { useSession } from "next-auth/react"
import { Bell, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Header({ title }) {
  const { data: session } = useSession()
  const [restaurantId, setRestaurantId] = useState(null)

  useEffect(() => {
    if (session?.user?.restaurantId) {
      setRestaurantId(session.user.restaurantId)
    }
  }, [session])

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-2">
        {restaurantId && (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/kitchen`}
              target="_blank"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Kitchen Screen
            </Link>
          </Button>
        )}
      </div>
    </header>
  )
}