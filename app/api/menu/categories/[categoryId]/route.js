import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Category from "@/models/Category"
import MenuItem from "@/models/MenuItem"
import { auth } from "@/lib/auth"

export const runtime = "nodejs"
// PATCH - update category
export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { categoryId } = await params
    const body = await req.json()

    const category = await Category.findOneAndUpdate(
      { _id: categoryId, restaurantId: session.user.restaurantId },
      { $set: body },
      { new: true }
    )

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Category updated", category })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - delete category and its items
export async function DELETE(req, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { categoryId } = await params

    const category = await Category.findOneAndDelete({
      _id: categoryId,
      restaurantId: session.user.restaurantId,
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Delete all menu items in this category
    await MenuItem.deleteMany({ categoryId })

    return NextResponse.json({
      message: "Category and its items deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}