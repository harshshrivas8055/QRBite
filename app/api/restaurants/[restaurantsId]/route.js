import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Restaurant from "@/models/Restaurant"
import { auth } from "@/lib/auth"

export const runtime = "nodejs"
// GET - get restaurant by id (public, used by menu page)
export async function GET(req, { params }) {
  try {
    await connectDB()
    const { restaurantsId } = await params

    const restaurant = await Restaurant.findById(restaurantsId)
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    return NextResponse.json({ restaurant })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH - update restaurant settings
export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { restaurantsId } = await params
    const body = await req.json()

    const restaurant = await Restaurant.findById(restaurantsId)
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    // Only owner or super admin can update
    if (
      restaurant.ownerId.toString() !== session.user.id &&
      session.user.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const allowedFields = [
      "name", "description", "address", "phone",
      "logo", "coverImage", "currency", "settings",
      "location", "theme"
    ]

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        restaurant[field] = body[field]
      }
    })

    await restaurant.save()

    return NextResponse.json({
      message: "Restaurant updated successfully",
      restaurant,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
