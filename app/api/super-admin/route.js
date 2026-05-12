import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Restaurant from "@/models/Restaurant"
import { auth } from "@/lib/auth"

export const runtime = "nodejs"

// GET - get all restaurants (super admin only)
export async function GET(req) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const restaurants = await Restaurant.find({})
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 })

    return NextResponse.json({ restaurants })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}