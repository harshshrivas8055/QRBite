import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { auth } from "@/lib/auth"

export const runtime = "nodejs"
// PATCH - update staff member
export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { staffId } = await params
    const body = await req.json()

    const staff = await User.findOneAndUpdate(
      {
        _id: staffId,
        restaurantId: session.user.restaurantId,
        role: "STAFF",
      },
      { $set: { name: body.name, isActive: body.isActive } },
      { new: true }
    ).select("-password")

    if (!staff) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Staff updated", staff })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - remove staff member
export async function DELETE(req, { params }) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { staffId } = await params

    const staff = await User.findOneAndDelete({
      _id: staffId,
      restaurantId: session.user.restaurantId,
      role: "STAFF",
    })

    if (!staff) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Staff member removed successfully" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}