import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Restaurant from "@/models/Restaurant"
import User from "@/models/User"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import crypto from "crypto"
import { sendEmail } from "@/lib/gmail"
import { verifyEmailTemplate } from "@/lib/email-templates"

export const runtime = "nodejs"

// GET - get current admin's restaurant
export async function GET(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const restaurant = await Restaurant.findOne({
      ownerId: session.user.id,
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ restaurant })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - register new restaurant + admin user
export async function POST(req) {
  try {
    await connectDB()

    const body = await req.json()
    const { name, email, password, restaurantName, address, phone } = body

    if (!name || !email || !password || !restaurantName) {
      return NextResponse.json(
        { error: "Name, email, password and restaurant name are required" },
        { status: 400 }
      )
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    const slug =
      restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString().slice(-4)

    const restaurantId = new mongoose.Types.ObjectId()
    const userId = new mongoose.Types.ObjectId()

    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate email verification token
    const verifyToken = crypto.randomBytes(32).toString("hex")
    const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await User.create({
      _id: userId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "ADMIN",
      restaurantId,
      emailVerified: false,
      emailVerifyToken: verifyToken,
      emailVerifyExpiry: verifyExpiry,
    })

    try {
      await Restaurant.create({
        _id: restaurantId,
        name: restaurantName,
        slug,
        ownerId: user._id,
        address: address || "",
        phone: phone || "",
      })
    } catch (error) {
      await User.findByIdAndDelete(user._id)
      throw error
    }

    // Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verifyToken}`

    try {
      await sendEmail({
        to: email.toLowerCase(),
        subject: "Verify your QRBite email address ✉️",
        html: verifyEmailTemplate({
          name,
          verifyUrl,
        }),
      })
    } catch (emailError) {
      // Don't fail registration if email fails
      // User can request resend later
      console.error("Failed to send verification email:", emailError.message)
    }

    return NextResponse.json(
      {
        message:
          "Restaurant registered successfully. Please check your email to verify your account.",
        restaurantId,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}