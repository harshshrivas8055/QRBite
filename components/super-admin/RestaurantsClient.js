"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import RestaurantCard from "./RestaurantCard"
import EmptyState from "@/components/shared/EmptyState"
import { Store } from "lucide-react"
import toast from "react-hot-toast"

export default function RestaurantsClient({ restaurants: initialRestaurants }) {
  const [restaurants, setRestaurants] = useState(initialRestaurants)
  const [search, setSearch] = useState("")

  async function handleToggleActive(restaurantId, isActive) {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === restaurantId ? { ...r, isActive } : r
        )
      )
      toast.success(`Restaurant ${isActive ? "activated" : "deactivated"}`)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerId?.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search restaurants..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No restaurants found"
          description="Try a different search term"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((restaurant) => (
            <RestaurantCard
              key={restaurant._id}
              restaurant={restaurant}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}
    </div>
  )
}