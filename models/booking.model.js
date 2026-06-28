import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "cancelled", "delivered", "complete"],
      default: "active",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    paymentIntentId: { type: String, default: null },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

// Fast lookup — "show me all bookings of this user"
bookingSchema.index({ userId: 1, status: 1 });

// Fast lookup — "show me all bookings of this provider"
bookingSchema.index({ serviceProviderId: 1, status: 1 });

// Fast lookup — "is this time slot already booked for this provider?"
bookingSchema.index({ serviceProviderId: 1, startTime: 1, endTime: 1 });
export const Booking = mongoose.model("Booking", bookingSchema);
