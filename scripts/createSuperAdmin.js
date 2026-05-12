// Run this once to create super admin:
// node scripts/createSuperAdmin.js

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const MONGODB_URI = process.env.MONGODB_URI || "your-mongodb-uri-here"

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  restaurantId: { type: mongoose.Schema.Types.ObjectId, default: null },
  isActive: { type: Boolean, default: true },
})

async function createSuperAdmin() {
  await mongoose.connect(MONGODB_URI)
  console.log("Connected to MongoDB")

  const User = mongoose.models.User || mongoose.model("User", UserSchema)

  const existing = await User.findOne({ role: "SUPER_ADMIN" })
  if (existing) {
    console.log("Super admin already exists:", existing.email)
    process.exit(0)
  }

  const hashedPassword = await bcrypt.hash("superadmin123", 12)

  const superAdmin = await User.create({
    name: "Super Admin",
    email: "superadmin@qrbite.com",
    password: hashedPassword,
    role: "SUPER_ADMIN",
    restaurantId: null,
  })

  console.log("✅ Super admin created!")
  console.log("Email:", superAdmin.email)
  console.log("Password: superadmin123")
  console.log("⚠️  Change the password after first login!")
  process.exit(0)
}

createSuperAdmin().catch((err) => {
  console.error(err)
  process.exit(1)
})