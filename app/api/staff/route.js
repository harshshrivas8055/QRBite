import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { sendEmail } from "@/lib/gmail"

export const runtime = "nodejs"

// GET - get all staff for restaurant
export async function GET(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const staff = await User.find({
      restaurantId: session.user.restaurantId,
      role: "STAFF",
    }).select("-password")

    return NextResponse.json({ staff })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - add staff member
export async function POST(req) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      )
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Staff are auto-verified — admin creates their account directly
    // No email verification needed for staff
    const staff = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "STAFF",
      restaurantId: session.user.restaurantId,
      emailVerified: true, // ← auto verify staff
    })

    // Send welcome email with login credentials to staff
    try {
      await sendEmail({
        to: email.toLowerCase(),
        subject: "Your QRBite Staff Account is Ready 🎉",
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto;">
            <div style="background: #141414; padding: 32px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #fff; margin: 0; font-size: 24px;">
                🍽️ QRBite
              </h1>
              <p style="color: #999; margin: 8px 0 0; font-size: 14px;">
                Kitchen Staff Account
              </p>
            </div>
            <div style="padding: 32px; border: 1px solid #e5e7eb;
              border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #111; margin: 0 0 16px;">
                Hi ${name}, your account is ready!
              </h2>
              <p style="color: #6b7280; font-size: 15px; line-height: 1.6;">
                Your manager has created a staff account for you on QRBite.
                You can now log in to the kitchen screen using the
                credentials below.
              </p>
              <div style="background: #f9fafb; border: 1px solid #e5e7eb;
                border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="color: #374151; font-size: 14px; margin: 0 0 8px;">
                  <strong>Login URL:</strong><br/>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/login"
                    style="color: #2563eb;">
                    ${process.env.NEXT_PUBLIC_APP_URL}/login
                  </a>
                </p>
                <p style="color: #374151; font-size: 14px; margin: 8px 0 0;">
                  <strong>Email:</strong> ${email.toLowerCase()}
                </p>
                <p style="color: #374151; font-size: 14px; margin: 4px 0 0;">
                  <strong>Password:</strong> ${password}
                </p>
              </div>
              <p style="color: #9ca3af; font-size: 13px;">
                Please change your password after your first login.
              </p>
            </div>
            <p style="text-align: center; color: #9ca3af;
              font-size: 12px; margin-top: 16px;">
              Powered by QRBite
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      // Don't fail if email fails — staff account still created
      console.error("Failed to send staff welcome email:", emailError.message)
    }

    const { password: _, ...staffData } = staff.toObject()

    return NextResponse.json(
      { message: "Staff member added successfully", staff: staffData },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}