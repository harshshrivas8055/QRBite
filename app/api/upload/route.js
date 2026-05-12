import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"

export const runtime = "nodejs"

export async function POST(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    const { url, publicId } = await uploadImage(
      base64,
      `restaurant-qr-saas/${session.user.restaurantId}`
    )

    return NextResponse.json({ url, publicId })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}