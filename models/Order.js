import mongoose from "mongoose"

const OrderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: null },
  isVeg: { type: Boolean, default: true },

  // Variant info — e.g. "Half" or "Full"
  variantLabel: {
    type: String,
    default: null,
    // null means no variant selected (simple item)
  },
})

const OrderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    tableNumber: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    status: {
      type: String,
      enum: ["PLACED", "ACCEPTED", "PREPARING", "READY", "SERVED", "CANCELLED"],
      default: "PLACED",
    },
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    serviceChargeAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    customerNote: { type: String, default: "" },
    orderNumber: { type: String, unique: true },

    // Bill
    billGenerated: { type: Boolean, default: false },
    billGeneratedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

OrderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    this.orderNumber = `ORD-${timestamp}-${random}`
  }
})

if (process.env.NODE_ENV === "development" && mongoose.models.Order) {
  delete mongoose.models.Order
}

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema)

export default Order