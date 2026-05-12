import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import MenuItem from "@/models/MenuItem"
import { auth } from "@/lib/auth"

export const runtime = "nodejs"

// PATCH - update menu item
export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { itemsId } = await params
    const body = await req.json()

    const item = await MenuItem.findOneAndUpdate(
      { _id: itemsId, restaurantId: session.user.restaurantId },
      { $set: body },
      { new: true }
    )

    if (!item) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Menu item updated", item })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - delete menu item
export async function DELETE(req, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { itemsId } = await params

    const item = await MenuItem.findOneAndDelete({
      _id: itemsId,
      restaurantId: session.user.restaurantId,
    })

    if (!item) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Menu item deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
