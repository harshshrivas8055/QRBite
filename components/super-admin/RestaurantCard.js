"use client"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { formatDate } from "@/lib/utils"
import { ShoppingBag, Users, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RestaurantCard({ restaurant, onToggleActive }) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        {restaurant.logo ? (
          <img
            src={restaurant.logo}
            alt={restaurant.name}
            className="h-12 w-12 rounded-xl object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-lg">
              {restaurant.name[0]}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{restaurant.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {restaurant.ownerId?.email || "No owner"}
          </p>
        </div>
        <Badge variant={restaurant.isActive ? "default" : "secondary"}>
          {restaurant.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="text-xs">Orders</span>
          </div>
          <p className="font-bold text-lg">{restaurant.orderCount || 0}</p>
        </div>
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <Users className="h-3.5 w-3.5" />
            <span className="text-xs">Owner</span>
          </div>
          <p className="font-bold text-sm truncate">
            {restaurant.ownerId?.name || "N/A"}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1 text-xs text-muted-foreground">
        {restaurant.address && <p>📍 {restaurant.address}</p>}
        {restaurant.phone && <p>📞 {restaurant.phone}</p>}
        <p>🗓 Joined {formatDate(restaurant.createdAt)}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Switch
            checked={restaurant.isActive}
            onCheckedChange={(v) => onToggleActive(restaurant._id, v)}
          />
          <span className="text-xs text-muted-foreground">
            {restaurant.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`/menu/${restaurant._id}/1`}
            target="_blank"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Preview
          </Link>
        </Button>
      </div>
    </div>
  )
}