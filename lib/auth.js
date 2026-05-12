import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import connectDB from "./db"
import User from "@/models/User"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        await connectDB()

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        })

        if (!user) {
          throw new Error("No user found with this email")
        }

        if (!user.isActive) {
          throw new Error("Your account has been deactivated")
        }

        // Check email verification for non-super-admins
        if (user.role !== "SUPER_ADMIN" && !user.emailVerified) {
          throw new Error(
            "Please verify your email before signing in. Check your inbox."
          )
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          restaurantId: user.restaurantId?.toString() || null,
          avatar: user.avatar || null,
          emailVerified: user.emailVerified,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.restaurantId = user.restaurantId
        token.avatar = user.avatar
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.restaurantId = token.restaurantId
        session.user.avatar = token.avatar
        session.user.emailVerified = token.emailVerified
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.AUTH_SECRET,
})