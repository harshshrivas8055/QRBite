import mongoose from "mongoose"

// Variant schema — e.g. Half / Full with different prices
const VariantSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
    // e.g. "Half", "Full", "Quarter", "Regular", "Large"
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
})

const MenuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
      // This is the base price when no variants exist
    },
    image: {
      type: String,
      default: null,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },

    // Variants — if set, customer must pick one
    // e.g. [{ label: "Half", price: 60 }, { label: "Full", price: 100 }]
    variants: {
      type: [VariantSchema],
      default: [],
    },

    // If true, customer must select a variant before adding to cart
    hasVariants: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const MenuItem =
  mongoose.models.MenuItem || mongoose.model("MenuItem", MenuItemSchema)

export default MenuItem