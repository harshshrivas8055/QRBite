import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function PlatformStats({ restaurants }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-4">Recently Joined Restaurants</h3>

      {restaurants.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No restaurants yet
        </p>
      ) : (
        <div className="space-y-3">
          {restaurants.map((r) => (
            <div
              key={r._id}
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div className="flex items-center gap-3">
                {r.logo ? (
                  <img
                    src={r.logo}
                    alt={r.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {r.name[0]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.ownerId?.email || "No owner"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {formatDate(r.createdAt)}
                </span>
                <Badge variant={r.isActive ? "default" : "secondary"}>
                  {r.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}