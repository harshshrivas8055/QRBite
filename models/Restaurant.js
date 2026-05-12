import mongoose from "mongoose"

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "INR",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      acceptingOrders: { type: Boolean, default: true },
      taxPercentage: { type: Number, default: 0 },
      serviceCharge: { type: Number, default: 0 },
    },

    // Menu theme
    theme: {
      type: String,
      enum: [
        "classic",
        "dark-luxury",
        "fresh-green",
        "ocean-blue",
        "warm-sunset",
        "bold-red",
      ],
      default: "classic",
    },

    // Location based ordering
    location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      radius: { type: Number, default: 100 }, // meters
      enforceLocation: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
)

const Restaurant =
  mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema)

export default Restaurant