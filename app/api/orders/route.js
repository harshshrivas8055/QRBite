import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Order from "@/models/Order"
import Restaurant from "@/models/Restaurant"
import Table from "@/models/Table"
import MenuItem from "@/models/MenuItem"
import { auth } from "@/lib/auth"
import { sendSSEEvent } from "@/lib/sse"
import { SSE_EVENTS } from "@/lib/constants"
import mongoose from "mongoose"

export const runtime = "nodejs"

// GET - get orders for restaurant
export async function GET(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "50")

    const filter = { restaurantId: session.user.restaurantId }
    if (status) filter.status = status

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("GET /api/orders error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - place a new order (public, no auth needed)
export async function POST(req) {
  try {
    await connectDB()

    const body = await req.json()
    const { restaurantId, tableId, tableNumber, items, customerNote } = body

    // Basic validation
    if (!restaurantId || !tableId || !tableNumber || !items?.length) {
      return NextResponse.json(
        { error: "Restaurant, table and items are required" },
        { status: 400 }
      )
    }

    // Validate ObjectIds
    if (!mongoose.isValidObjectId(restaurantId)) {
      return NextResponse.json(
        { error: "Invalid restaurantId" },
        { status: 400 }
      )
    }
    if (!mongoose.isValidObjectId(tableId)) {
      return NextResponse.json(
        { error: "Invalid tableId" },
        { status: 400 }
      )
    }

    // Each item must have a menuItemId
    const itemIds = items.map((item) => item.menuItemId).filter(Boolean)
    if (itemIds.length !== items.length) {
      return NextResponse.json(
        { error: "Every order item must include a menu item ID" },
        { status: 400 }
      )
    }

    // Validate all menuItemIds are valid ObjectIds
    if (itemIds.some((id) => !mongoose.isValidObjectId(id))) {
      return NextResponse.json(
        { error: "Invalid menu item ID" },
        { status: 400 }
      )
    }

    // Validate quantities
    const invalidQuantity = items.some((item) => {
      const q = Number(item.quantity)
      return !Number.isInteger(q) || q < 1
    })
    if (invalidQuantity) {
      return NextResponse.json(
        { error: "Item quantity must be at least 1" },
        { status: 400 }
      )
    }

    // Verify restaurant exists and is accepting orders
    const restaurant = await Restaurant.findById(restaurantId)
    if (!restaurant || !restaurant.isActive) {
      return NextResponse.json(
        { error: "Restaurant not found or not active" },
        { status: 404 }
      )
    }

    if (restaurant.settings?.acceptingOrders === false) {
      return NextResponse.json(
        { error: "Restaurant is not accepting orders right now" },
        { status: 400 }
      )
    }

    // Verify table
    const table = await Table.findOne({
      _id: tableId,
      restaurantId,
      tableNumber: String(tableNumber),
      isActive: true,
    })

    if (!table) {
      return NextResponse.json(
        { error: "Table not found or not active" },
        { status: 404 }
      )
    }

    // Verify menu items exist and are available
    const uniqueItemIds = [...new Set(itemIds)]
    const menuItems = await MenuItem.find({
      _id: { $in: uniqueItemIds },
      restaurantId,
      isAvailable: true,
    })

    if (menuItems.length !== uniqueItemIds.length) {
      return NextResponse.json(
        { error: "One or more menu items are unavailable" },
        { status: 400 }
      )
    }

    const menuItemsById = new Map(
      menuItems.map((item) => [item._id.toString(), item])
    )

    // Build order items — support variants
    const orderItems = items.map((item) => {
      const menuItem = menuItemsById.get(item.menuItemId)

      // If item has a variantLabel, validate it exists on the menu item
      let price = menuItem.price
      if (item.variantLabel && menuItem.hasVariants && menuItem.variants?.length > 0) {
        const variant = menuItem.variants.find(
          (v) => v.label === item.variantLabel
        )
        if (variant) {
          // Use variant price — trust what customer selected
          price = variant.price
        }
      }

      // Build item name — include variant label for kitchen clarity
      const displayName = item.variantLabel
        ? `${menuItem.name} (${item.variantLabel})`
        : menuItem.name

      return {
        menuItemId: menuItem._id,
        name: displayName,
        price,
        quantity: Number(item.quantity),
        image: menuItem.image || null,
        isVeg: menuItem.isVeg,
        variantLabel: item.variantLabel || null,
      }
    })

    // Calculate totals
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const taxAmount =
      (subtotal * (restaurant.settings?.taxPercentage || 0)) / 100
    const serviceChargeAmount =
      (subtotal * (restaurant.settings?.serviceCharge || 0)) / 100
    const totalAmount = subtotal + taxAmount + serviceChargeAmount

    const order = await Order.create({
      restaurantId,
      tableId,
      tableNumber: String(tableNumber),
      items: orderItems,
      subtotal,
      taxAmount,
      serviceChargeAmount,
      totalAmount,
      customerNote: customerNote || "",
    })

    // Notify kitchen via SSE
    sendSSEEvent(restaurantId.toString(), SSE_EVENTS.NEW_ORDER, {
      order: order.toObject(),
    })

    return NextResponse.json(
      { message: "Order placed successfully", order },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST /api/orders error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
