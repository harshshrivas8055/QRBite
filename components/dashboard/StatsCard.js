import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className,
}) {
  const isPositive = trend === "up"

  return (
    <div className={cn("rounded-xl border bg-card p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && (
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold">{value}</p>
        <div className="flex items-center gap-2">
          {trendValue && (
            <span
              className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                isPositive ? "text-green-600" : "text-red-500"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trendValue}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  )
}