"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import useCartStore from "@/store/cartStore"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import VariantSelector from "./VariantSelector"

export default function MenuItemCard({ item, theme }) {
  const [showVariants, setShowVariants] = useState(false)
  const { addItem, removeItem, getItemQuantity } = useCartStore()

  const quantity = item.hasVariants
    ? useCartStore
        .getState()
        .items.filter((i) => i.originalItemId === item._id)
        .reduce((sum, i) => sum + i.quantity, 0)
    : getItemQuantity(item._id)

  function handleAdd() {
    if (item.hasVariants && item.variants?.length > 0) {
      setShowVariants(true)
      return
    }
    addItem({
      menuItemId: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      isVeg: item.isVeg,
    })
  }

  function handleRemove() {
    if (item.hasVariants) {
      setShowVariants(true)
      return
    }
    removeItem(item._id)
  }

  return (
    <>
      <div className={`flex gap-3 p-3 ${theme.card}`}>
        {/* Image */}
        {item.image && (
          <div className="h-24 w-24 rounded-lg overflow-hidden flex-shrink-0 relative">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
            {item.hasVariants && item.variants?.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-0.5">
                <span className="text-xs">{item.variants.length} sizes</span>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Name + veg indicator */}
            <div className="flex items-center gap-1.5 mb-1">
              <div
                className={cn(
                  "h-4 w-4 rounded border-2 flex items-center justify-center flex-shrink-0",
                  item.isVeg ? "border-green-600" : "border-red-600"
                )}
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    item.isVeg ? "bg-green-600" : "bg-red-600"
                  )}
                />
              </div>
              <p className={`font-semibold text-sm truncate ${theme.cardTitle}`}>
                {item.name}
              </p>
            </div>

            {item.description && (
              <p className={`text-xs line-clamp-2 ${theme.cardDesc}`}>
                {item.description}
              </p>
            )}

            {/* Variant pills */}
            {item.hasVariants && item.variants?.length > 0 && (
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {item.variants.map((v) => (
                  <span
                    key={v.label}
                    className="text-xs bg-black/10 px-2 py-0.5 rounded-full opacity-70"
                  >
                    {v.label} {formatCurrency(v.price)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            {/* Price */}
            <div>
              {item.hasVariants && item.variants?.length > 0 ? (
                <p className={`font-bold text-sm ${theme.cardPrice}`}>
                  {formatCurrency(Math.min(...item.variants.map((v) => v.price)))}
                  <span className="text-xs font-normal ml-1 opacity-60">
                    onwards
                  </span>
                </p>
              ) : (
                <p className={`font-bold text-sm ${theme.cardPrice}`}>
                  {formatCurrency(item.price)}
                </p>
              )}
            </div>

            {/* Add / Remove controls */}
            {quantity === 0 ? (
              <button
                onClick={handleAdd}
                className={`text-xs font-semibold px-4 py-1.5 rounded-lg
                  transition-all active:scale-95 ${theme.addBtn}`}
              >
                ADD
              </button>
            ) : item.hasVariants ? (
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 rounded-lg px-2 py-1 ${theme.quantityBtn}`}>
                  <span className="text-sm font-bold">{quantity}</span>
                </div>
                <button
                  onClick={() => setShowVariants(true)}
                  className={`text-xs font-medium underline underline-offset-2 ${theme.cardPrice}`}
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className={`flex items-center gap-2 rounded-lg px-2 py-1 ${theme.quantityBtn}`}>
                <button
                  onClick={handleRemove}
                  className="h-5 w-5 flex items-center justify-center opacity-90"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-sm font-bold w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleAdd}
                  className="h-5 w-5 flex items-center justify-center opacity-90"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Variant Selector */}
      {item.hasVariants && (
        <VariantSelector
          item={item}
          open={showVariants}
          onClose={() => setShowVariants(false)}
        />
      )}
    </>
  )
}
