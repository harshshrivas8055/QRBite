"use client"

import { useState, useEffect } from "react"
import useCartStore from "@/store/cartStore"
import MenuHeader from "./MenuHeader"
import MenuCategoryTabs from "./MenuCategoryTabs"
import MenuItemCard from "./MenuItemCard"
import CartDrawer from "./CartDrawer"
import OrderSuccessSheet from "./OrderSuccessSheet"
import LocationGate from "./LocationGate"
import { getTheme } from "./themes/index"
import { Toaster } from "react-hot-toast"
import { ShoppingCart } from "lucide-react"

export default function PublicMenuClient({
  restaurant,
  table,
  categories,
  items,
}) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?._id || ""
  )
  const [cartOpen, setCartOpen] = useState(false)
  const [successOrder, setSuccessOrder] = useState(null)
  const [locationAllowed, setLocationAllowed] = useState(
    !restaurant.location?.enforceLocation
  )
  const [locationDenied, setLocationDenied] = useState(false)

  const { setTableInfo, getTotalItems } = useCartStore()

  // Get theme based on restaurant setting
  const theme = getTheme(restaurant.theme || "classic")

  useEffect(() => {
    setTableInfo(restaurant._id, table._id, table.tableNumber)
  }, [restaurant._id, table._id, table.tableNumber])

  const totalItems = getTotalItems()
  const activeItems = items.filter(
    (i) => (i.categoryId?._id || i.categoryId) === activeCategory
  )

  // Not accepting orders
  if (!restaurant.settings?.acceptingOrders) {
    return (
      <div className={`${theme.wrapper} flex items-center justify-center p-6`}>
        <div className="text-center space-y-3">
          <div className="text-5xl">😴</div>
          <h2 className="text-xl font-bold">{restaurant.name}</h2>
          <p className="text-muted-foreground">
            We are not accepting orders right now. Please check back later.
          </p>
        </div>
      </div>
    )
  }

  // Location denied
  if (locationDenied) {
    return (
      <div className={`${theme.wrapper} flex items-center justify-center p-6`}>
        <div className="text-center space-y-4 max-w-sm">
          <div className="text-6xl">📍</div>
          <h2 className="text-xl font-bold">{restaurant.name}</h2>
          <p className="text-muted-foreground leading-relaxed">
            You must be inside the restaurant to place an order.
          </p>
          <div className="bg-muted rounded-xl p-4 text-sm text-muted-foreground">
            <p>📍 {restaurant.address || "Check our location"}</p>
            {restaurant.phone && <p className="mt-1">📞 {restaurant.phone}</p>}
          </div>
          <button
            className="w-full py-3 rounded-xl border text-sm font-medium"
            onClick={() => {
              setLocationDenied(false)
              setLocationAllowed(false)
            }}
          >
            Try Location Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${theme.wrapper} pb-24`}>
      <Toaster position="top-center" />

      {/* Location Gate overlay */}
      {!locationAllowed && restaurant.location?.enforceLocation && (
        <LocationGate
          restaurant={restaurant}
          onAllowed={() => {
            setLocationAllowed(true)
            setLocationDenied(false)
          }}
          onDenied={() => {
            setLocationAllowed(false)
            setLocationDenied(true)
          }}
        />
      )}

      {/* Header — themed */}
      <MenuHeader restaurant={restaurant} table={table} theme={theme} />

      {/* Category tabs — themed */}
      <MenuCategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
        theme={theme}
      />

      {/* Menu items */}
      <div className="px-4 py-4 space-y-3 max-w-lg mx-auto">
        {activeItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No items in this category</p>
          </div>
        ) : (
          activeItems.map((item) => (
            <MenuItemCard key={item._id} item={item} theme={theme} />
          ))
        )}
      </div>

      {/* Floating cart button — themed */}
      {totalItems > 0 && locationAllowed && (
        <div className="fixed bottom-6 left-0 right-0 px-4 max-w-lg mx-auto">
          <button
            className={`w-full h-14 rounded-2xl text-base font-semibold shadow-2xl
              flex items-center px-5 transition-all ${theme.cartBtn}`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5 mr-3" />
            View Cart
            <span className="ml-auto bg-white/20 rounded-full px-2.5 py-0.5 text-sm font-bold">
              {totalItems}
            </span>
          </button>
        </div>
      )}

      {/* Cart + Order success */}
      {locationAllowed && (
        <>
          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            restaurant={restaurant}
            table={table}
            onOrderSuccess={(order) => {
              setCartOpen(false)
              setSuccessOrder(order)
            }}
          />
          {successOrder && (
            <OrderSuccessSheet
              order={successOrder}
              open={!!successOrder}
              onClose={() => setSuccessOrder(null)}
              restaurantId={restaurant._id}
            />
          )}
        </>
      )}
    </div>
  )
}