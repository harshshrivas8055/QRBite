import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Category from "@/models/Category"
import { auth } from "@/lib/auth"

export const runtime = "nodejs"
// GET - get all categories
export async function GET(req) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const restaurantId = searchParams.get("restaurantId")

    // Allow public access for menu page
    const session = await auth()
    const id = restaurantId || session?.user?.restaurantId

    if (!id) {
      return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 })
    }

    const categories = await Category.find({
      restaurantId: id,
      isActive: true,
    }).sort({ sortOrder: 1, createdAt: 1 })

    return NextResponse.json({ categories })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - create category
export async function POST(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const body = await req.json()
    const { name, description, sortOrder } = body

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      )
    }

    const category = await Category.create({
      restaurantId: session.user.restaurantId,
      name,
      description: description || "",
      sortOrder: sortOrder || 0,
    })

    return NextResponse.json(
      { message: "Category created successfully", category },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}