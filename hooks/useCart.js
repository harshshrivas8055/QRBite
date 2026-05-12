"use client"

import useCartStore from "@/store/cartStore"
import { useMemo } from "react"

export function useCart() {
  const {
    items,
    addItem,
    removeItem,
    clearCart,
    getItemQuantity,
    getTotalItems,
    getSubtotal,
    restaurantId,
    tableId,
    tableNumber,
    setTableInfo,
  } = useCartStore()

  const totalItems = getTotalItems()
  const subtotal = getSubtotal()

  const isEmpty = useMemo(() => items.length === 0, [items])

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    getItemQuantity,
    totalItems,
    subtotal,
    isEmpty,
    restaurantId,
    tableId,
    tableNumber,
    setTableInfo,
  }
}