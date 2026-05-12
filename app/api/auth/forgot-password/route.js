import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { sendEmail } from "@/lib/gmail"
import { forgotPasswordTemplate } from "@/lib/email-templates"
import crypto from "crypto"

export async function POST(req) {
  try {
    await connectDB()

    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    // Always return success even if user not found (security)
    if (!user) {
      return NextResponse.json({
        message: "If that email exists, a reset link has been sent",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    await sendEmail({
      to: user.email,
      subject: "Reset your QRBite password 🔐",
      html: forgotPasswordTemplate({
        name: user.name,
        resetUrl,
      }),
    })

    return NextResponse.json({
      message: "If that email exists, a reset link has been sent",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}