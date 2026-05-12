"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

export default function MenuItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailable,
}) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <div
        className={cn(
          "rounded-xl border bg-card overflow-hidden transition-all",
          !item.isAvailable && "opacity-60"
        )}
      >
        {/* Image */}
        <div className="h-36 bg-muted relative">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <span className="text-3xl">🍽️</span>
            </div>
          )}

          {/* Veg / Non-veg indicator */}
          <div className="absolute top-2 left-2">
            <div
              className={cn(
                "h-5 w-5 rounded border-2 flex items-center justify-center bg-white",
                item.isVeg ? "border-green-600" : "border-red-600"
              )}
            >
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  item.isVeg ? "bg-green-600" : "bg-red-600"
                )}
              />
            </div>
          </div>

          {/* Variants badge */}
          {item.hasVariants && item.variants?.length > 0 && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="text-xs bg-black/60 text-white border-0"
              >
                {item.variants.length} variants
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{item.name}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>

            {/* Price — show range if variants exist */}
            <div className="text-right flex-shrink-0">
              {item.hasVariants && item.variants?.length > 0 ? (
                <div>
                  <p className="font-bold text-sm">
                    {formatCurrency(
                      Math.min(...item.variants.map((v) => v.price))
                    )}
                    {" — "}
                    {formatCurrency(
                      Math.max(...item.variants.map((v) => v.price))
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.variants.map((v) => v.label).join(" / ")}
                  </p>
                </div>
              ) : (
                <p className="font-bold text-sm">
                  {formatCurrency(item.price)}
                </p>
              )}
            </div>
          </div>

          {/* Variants pills */}
          {item.hasVariants && item.variants?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.variants.map((variant) => (
                <div
                  key={variant.label}
                  className="flex items-center gap-1 bg-muted rounded-full px-2.5 py-1"
                >
                  <span className="text-xs font-medium">{variant.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(variant.price)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Available toggle + actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={item.isAvailable}
                onCheckedChange={(checked) =>
                  onToggleAvailable(item._id, checked)
                }
              />
              <span className="text-xs text-muted-foreground">
                {item.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={onEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => setShowConfirm(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Delete Menu Item?"
        description={`"${item.name}" will be permanently deleted.`}
        confirmText="Delete"
        onConfirm={() => {
          onDelete(item._id)
          setShowConfirm(false)
        }}
      />
    </>
  )
}