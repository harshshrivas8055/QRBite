import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Table from "@/models/Table"
import { auth } from "@/lib/auth"

export const runtime = "nodejs"
// GET - get single table
export async function GET(req, { params }) {
  try {
    await connectDB()
    const { tableId } = await params

    const table = await Table.findById(tableId)
    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    return NextResponse.json({ table })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH - update table
export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { tableId } = await params
    const body = await req.json()

    const table = await Table.findOneAndUpdate(
      { _id: tableId, restaurantId: session.user.restaurantId },
      { $set: body },
      { new: true }
    )

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Table updated successfully", table })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - delete table
export async function DELETE(req, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { tableId } = await params

    const table = await Table.findOneAndDelete({
      _id: tableId,
      restaurantId: session.user.restaurantId,
    })

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Table deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}