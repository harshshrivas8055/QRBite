import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import MenuItem from "@/models/MenuItem"
import { auth } from "@/lib/auth"

export const runtime = "nodejs"

// GET - get all menu items
export async function GET(req) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const restaurantId = searchParams.get("restaurantId")
    const categoryId = searchParams.get("categoryId")

    const session = await auth()
    const id = restaurantId || session?.user?.restaurantId

    if (!id) {
      return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 })
    }

    const filter = { restaurantId: id }
    if (categoryId) filter.categoryId = categoryId

    const items = await MenuItem.find(filter)
      .populate("categoryId", "name")
      .sort({ sortOrder: 1, createdAt: 1 })

    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - create menu item
export async function POST(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const body = await req.json()
    const { categoryId, name, description, price, image, isVeg, sortOrder, tags, variants,
  hasVariants, } = body

    if (!categoryId || !name || price === undefined) {
      return NextResponse.json(
        { error: "Category, name and price are required" },
        { status: 400 }
      )
    }

    const item = await MenuItem.create({
      restaurantId: session.user.restaurantId,
      categoryId,
      name,
      description: description || "",
      price,
      image: image || null,
      isVeg: isVeg !== undefined ? isVeg : true,
      sortOrder: sortOrder || 0,
      tags: tags || [],
      // ✅ ADD THESE
  hasVariants: hasVariants || false,
  variants: variants || [],
    })

    return NextResponse.json(
      { message: "Menu item created successfully", item },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}