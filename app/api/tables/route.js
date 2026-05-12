import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Table from "@/models/Table"
import { auth } from "@/lib/auth"
import QRCode from "qrcode"

export const runtime = "nodejs"
// GET - get all tables for a restaurant
export async function GET(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const tables = await Table.find({
      restaurantId: session.user.restaurantId,
    }).sort({ tableNumber: 1 })

    return NextResponse.json({ tables })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - create a new table
export async function POST(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const body = await req.json()
    const { tableNumber, capacity } = body

    if (!tableNumber) {
      return NextResponse.json(
        { error: "Table number is required" },
        { status: 400 }
      )
    }

    // Check if table number already exists
    const existing = await Table.findOne({
      restaurantId: session.user.restaurantId,
      tableNumber,
    })

    if (existing) {
      return NextResponse.json(
        { error: "Table number already exists" },
        { status: 400 }
      )
    }

    // Generate QR code URL
    const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL}/menu/${session.user.restaurantId}/${tableNumber}`

    // Generate QR code as base64 image
    const qrCode = await QRCode.toDataURL(menuUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })

    const table = await Table.create({
      restaurantId: session.user.restaurantId,
      tableNumber,
      capacity: capacity || 4,
      qrCode,
    })

    return NextResponse.json(
      { message: "Table created successfully", table },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}