"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Minus, Plus, ShoppingCart, Loader2 } from "lucide-react"
import useCartStore from "@/store/cartStore"
import { formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"

export default function CartDrawer({
  open,
  onClose,
  restaurant,
  table,
  onOrderSuccess,
}) {
  const [note, setNote] = useState("")
  const [placing, setPlacing] = useState(false)

  const { items, addItem, removeItem, clearCart, getSubtotal } = useCartStore()

  const subtotal = getSubtotal()
  const tax = (subtotal * (restaurant.settings?.taxPercentage || 0)) / 100
  const serviceCharge =
    (subtotal * (restaurant.settings?.serviceCharge || 0)) / 100
  const total = subtotal + tax + serviceCharge

  async function handlePlaceOrder() {
    if (items.length === 0) return

    setPlacing(true)
    try {
      const payload = {
        restaurantId: restaurant._id,
        tableId: table._id,
        tableNumber: table.tableNumber,
        items: items.map((i) => ({
          // For variant items send originalItemId as menuItemId
          // so the API can look up the real menu item
          menuItemId: i.originalItemId || i.menuItemId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image || null,
          isVeg: i.isVeg,
          variantLabel: i.variantLabel || null,
        })),
        customerNote: note,
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      clearCart()
      setNote("")
      onOrderSuccess(result.order)
      toast.success("Order placed successfully!")
    } catch (error) {
      toast.error(error.message || "Failed to place order")
    } finally {
      setPlacing(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-3">
            <ShoppingCart className="h-12 w-12" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="flex flex-col h-full pb-4">
            {/* Items List */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {items.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex items-center gap-3 rounded-xl border p-3"
                >
                  {/* Image */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                    />
                  )}

                  {/* Name + variant label + price */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    {item.variantLabel && (
                      <span className="inline-block text-xs bg-primary/10 text-primary
                        font-medium px-2 py-0.5 rounded-full mt-0.5">
                        {item.variantLabel}
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>

                  {/* Quantity controls + line total */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="h-7 w-7 rounded-full border flex items-center
                        justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        addItem({
                          ...item,
                          quantity: 1,
                        })
                      }
                      className="h-7 w-7 rounded-full border flex items-center
                        justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <p className="text-sm font-semibold w-16 text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Special note */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Special Instructions</p>
                <Textarea
                  placeholder="Any special requests? (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Bill Summary */}
            <div className="border rounded-xl p-4 space-y-2 mb-4">
              {/* Item wise summary */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Order Summary
              </p>
              {items.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex justify-between text-xs text-muted-foreground"
                >
                  <span>
                    {item.quantity}× {item.name}
                    {item.variantLabel && (
                      <span className="ml-1 text-primary">
                        ({item.variantLabel})
                      </span>
                    )}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}

              <div className="border-t pt-2 mt-2 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Tax ({restaurant.settings?.taxPercentage}%)
                    </span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                )}
                {serviceCharge > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Service Charge ({restaurant.settings?.serviceCharge}%)
                    </span>
                    <span>{formatCurrency(serviceCharge)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              className="w-full h-12 text-base"
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Place Order • {formatCurrency(total)}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}