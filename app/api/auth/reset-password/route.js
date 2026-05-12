import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(req) {
  try {
    await connectDB()

    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 12)
    user.password = hashedPassword
    user.resetToken = null
    user.resetTokenExpiry = null
    await user.save()

    return NextResponse.json({
      message: "Password reset successfully. You can now log in.",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}