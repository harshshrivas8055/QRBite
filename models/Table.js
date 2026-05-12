import mongoose from "mongoose"

const TableSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    tableNumber: {
      type: String,
      required: [true, "Table number is required"],
      trim: true,
    },
    capacity: {
      type: Number,
      default: 4,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    qrCode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Unique table number per restaurant
TableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true })

const Table = mongoose.models.Table || mongoose.model("Table", TableSchema)

export default Table