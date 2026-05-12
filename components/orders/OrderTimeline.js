import { cn } from "@/lib/utils"
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
} from "@/lib/constants"
import { CheckCircle2, Circle } from "lucide-react"

export default function OrderTimeline({ currentStatus }) {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus)

  return (
    <div className="space-y-0">
      {ORDER_STATUS_FLOW.map((status, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const isPending = index > currentIndex
        const isLast = index === ORDER_STATUS_FLOW.length - 1

        return (
          <div key={status} className="flex items-start gap-3">
            {/* Icon + connector */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary/20 border-2 border-primary",
                  isPending && "bg-muted border-2 border-muted-foreground/20"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle
                    className={cn(
                      "h-3 w-3",
                      isCurrent
                        ? "text-primary fill-primary"
                        : "text-muted-foreground/30"
                    )}
                  />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 h-8 mt-1",
                    index < currentIndex ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className="pb-8 pt-0.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  isCurrent && "text-primary",
                  isPending && "text-muted-foreground"
                )}
              >
                {ORDER_STATUS_LABELS[status]}
              </p>
              {isCurrent && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Current status
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}