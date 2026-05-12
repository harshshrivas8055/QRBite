import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import Restaurant from "@/models/Restaurant"
import { sendEmail } from "@/lib/gmail"
import { welcomeEmailTemplate } from "@/lib/email-templates"

export async function GET(req) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      )
    }

    const user = await User.findOne({
      emailVerifyToken: token,
      emailVerifyExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      )
    }

    // Mark email as verified
    user.emailVerified = true
    user.emailVerifyToken = null
    user.emailVerifyExpiry = null
    await user.save()

    // Send welcome email
    const restaurant = await Restaurant.findById(user.restaurantId)
    if (restaurant) {
      await sendEmail({
        to: user.email,
        subject: `Welcome to QRBite — ${restaurant.name} is ready! 🎉`,
        html: welcomeEmailTemplate({
          name: user.name,
          restaurantName: restaurant.name,
        }),
      })
    }

    // Redirect to login with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`
    )
  } catch (error) {
    console.error("Verify email error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}