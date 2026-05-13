import { create } from "zustand"

const useCartStore = create((set, get) => ({
  items: [],
  restaurantId: null,
  tableId: null,
  tableNumber: null,

  setTableInfo: (restaurantId, tableId, tableNumber) => {
    // Only update if values actually changed
    const current = get()
    if (
      current.restaurantId === String(restaurantId) &&
      current.tableId === String(tableId) &&
      current.tableNumber === String(tableNumber)
    ) {
      return
    }
    set({
      restaurantId: String(restaurantId),
      tableId: String(tableId),
      tableNumber: String(tableNumber),
    })
  },

  addItem: (item) => {
    const menuItemId = String(item.menuItemId)
    const existing = get().items.find((i) => i.menuItemId === menuItemId)
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.menuItemId === menuItemId
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        ),
      })
    } else {
      set({
        items: [
          ...get().items,
          {
            menuItemId,
            originalItemId: item.originalItemId
              ? String(item.originalItemId)
              : menuItemId,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity || 1,
            image: item.image || null,
            isVeg: item.isVeg ?? true,
            variantLabel: item.variantLabel || null,
          },
        ],
      })
    }
  },

  removeItem: (menuItemId) => {
    const id = String(menuItemId)
    const existing = get().items.find((i) => i.menuItemId === id)
    if (!existing) return
    if (existing.quantity === 1) {
      set({ items: get().items.filter((i) => i.menuItemId !== id) })
    } else {
      set({
        items: get().items.map((i) =>
          i.menuItemId === id ? { ...i, quantity: i.quantity - 1 } : i
        ),
      })
    }
  },

  removeAllVariants: (originalItemId) => {
    const id = String(originalItemId)
    set({ items: get().items.filter((i) => i.originalItemId !== id) })
  },

  updateQuantity: (menuItemId, quantity) => {
    const id = String(menuItemId)
    if (quantity <= 0) {
      set({ items: get().items.filter((i) => i.menuItemId !== id) })
    } else {
      set({
        items: get().items.map((i) =>
          i.menuItemId === id ? { ...i, quantity } : i
        ),
      })
    }
  },

  clearCart: () => set({ items: [] }),

  getItemQuantity: (menuItemId) => {
    const item = get().items.find(
      (i) => i.menuItemId === String(menuItemId)
    )
    return item?.quantity || 0
  },

  getVariantsTotalQuantity: (originalItemId) => {
    const id = String(originalItemId)
    return get()
      .items.filter((i) => i.originalItemId === id)
      .reduce((sum, i) => sum + i.quantity, 0)
  },

  getVariantItems: (originalItemId) => {
    const id = String(originalItemId)
    return get().items.filter((i) => i.originalItemId === id)
  },

  getTotalItems: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),

  getSubtotal: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}))

export default useCartStore

// import { create } from "zustand"

// const useCartStore = create((set, get) => ({
//   items: [],
//   restaurantId: null,
//   tableId: null,
//   tableNumber: null,

//   setTableInfo: (restaurantId, tableId, tableNumber) =>
//     set({
//       restaurantId: String(restaurantId),
//       tableId: String(tableId),
//       tableNumber: String(tableNumber),
//     }),

//   addItem: (item) => {
//     // For variant items, menuItemId is like "itemId_Half" or "itemId_Full"
//     // For simple items, menuItemId is just the item._id
//     const menuItemId = String(item.menuItemId)
//     const existing = get().items.find((i) => i.menuItemId === menuItemId)

//     if (existing) {
//       // Item (or this specific variant) already in cart — increment
//       set({
//         items: get().items.map((i) =>
//           i.menuItemId === menuItemId
//             ? { ...i, quantity: i.quantity + (item.quantity || 1) }
//             : i
//         ),
//       })
//     } else {
//       // New item or new variant — add to cart
//       set({
//         items: [
//           ...get().items,
//           {
//             menuItemId,
//             // originalItemId links variant back to the base menu item
//             originalItemId: item.originalItemId
//               ? String(item.originalItemId)
//               : menuItemId,
//             name: item.name,
//             price: Number(item.price),
//             quantity: item.quantity || 1,
//             image: item.image || null,
//             isVeg: item.isVeg ?? true,
//             // variantLabel is null for simple items
//             variantLabel: item.variantLabel || null,
//           },
//         ],
//       })
//     }
//   },

//   removeItem: (menuItemId) => {
//     const id = String(menuItemId)
//     const existing = get().items.find((i) => i.menuItemId === id)
//     if (!existing) return

//     if (existing.quantity === 1) {
//       set({ items: get().items.filter((i) => i.menuItemId !== id) })
//     } else {
//       set({
//         items: get().items.map((i) =>
//           i.menuItemId === id ? { ...i, quantity: i.quantity - 1 } : i
//         ),
//       })
//     }
//   },

//   // Remove all variants of a specific original menu item
//   removeAllVariants: (originalItemId) => {
//     const id = String(originalItemId)
//     set({
//       items: get().items.filter((i) => i.originalItemId !== id),
//     })
//   },

//   // Update quantity directly (used in cart drawer)
//   updateQuantity: (menuItemId, quantity) => {
//     const id = String(menuItemId)
//     if (quantity <= 0) {
//       set({ items: get().items.filter((i) => i.menuItemId !== id) })
//     } else {
//       set({
//         items: get().items.map((i) =>
//           i.menuItemId === id ? { ...i, quantity } : i
//         ),
//       })
//     }
//   },

//   clearCart: () => set({ items: [] }),

//   // Get quantity for a simple item by its ID
//   getItemQuantity: (menuItemId) => {
//     const item = get().items.find((i) => i.menuItemId === String(menuItemId))
//     return item?.quantity || 0
//   },

//   // Get total quantity across all variants of an original item
//   getVariantsTotalQuantity: (originalItemId) => {
//     const id = String(originalItemId)
//     return get()
//       .items.filter((i) => i.originalItemId === id)
//       .reduce((sum, i) => sum + i.quantity, 0)
//   },

//   // Get all variant items for a specific original menu item
//   getVariantItems: (originalItemId) => {
//     const id = String(originalItemId)
//     return get().items.filter((i) => i.originalItemId === id)
//   },

//   getTotalItems: () =>
//     get().items.reduce((sum, i) => sum + i.quantity, 0),

//   getSubtotal: () =>
//     get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
// }))

// export default useCartStore