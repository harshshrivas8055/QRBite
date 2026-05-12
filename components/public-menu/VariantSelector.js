"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn, formatCurrency } from "@/lib/utils"
import { Minus, Plus } from "lucide-react"
import useCartStore from "@/store/cartStore"
import toast from "react-hot-toast"

export default function VariantSelector({ item, open, onClose }) {
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()

  function handleAdd() {
    if (!selectedVariant) {
      toast.error("Please select a variant")
      return
    }

    addItem({
      menuItemId: `${item._id}_${selectedVariant.label}`,
      originalItemId: item._id,
      name: item.name,
      variantLabel: selectedVariant.label,
      price: selectedVariant.price,
      quantity,
      image: item.image,
      isVeg: item.isVeg,
    })

    toast.success(`${item.name} (${selectedVariant.label}) added!`)
    onClose()
    setSelectedVariant(null)
    setQuantity(1)
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="mb-4">
          <SheetTitle>{item?.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Item image + description */}
          {item?.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-xl"
            />
          )}

          {item?.description && (
            <p className="text-sm text-muted-foreground">{item.description}</p>
          )}

          {/* Variant Selection */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Select Size / Variant</p>
            <div className="grid grid-cols-2 gap-2">
              {item?.variants?.map((variant) => (
                <button
                  key={variant.label}
                  onClick={() => setSelectedVariant(variant)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border-2 p-3 transition-all",
                    selectedVariant?.label === variant.label
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  <span className="text-sm font-medium">{variant.label}</span>
                  <span className="text-sm font-bold text-primary">
                    {formatCurrency(variant.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Quantity</p>
            <div className="flex items-center gap-3 border rounded-xl px-3 py-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-6 w-6 flex items-center justify-center"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-bold w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="h-6 w-6 flex items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Total */}
          {selectedVariant && (
            <div className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
              <span className="text-sm font-medium">Total</span>
              <span className="font-bold">
                {formatCurrency(selectedVariant.price * quantity)}
              </span>
            </div>
          )}

          {/* Add Button */}
          <Button
            className="w-full h-12 text-base"
            onClick={handleAdd}
            disabled={!selectedVariant}
          >
            {selectedVariant
              ? `Add ${quantity} × ${selectedVariant.label} — ${formatCurrency(
                  selectedVariant.price * quantity
                )}`
              : "Select a variant to continue"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}