import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Service name required"],
    },

    description: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

serviceSchema.index({ serviceProvider: 1, isActive: 1 });

export const Service = mongoose.model("Service", serviceSchema);
