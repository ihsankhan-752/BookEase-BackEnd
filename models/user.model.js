import mongoose from "mongoose";
import bcrypt from "bcrypt";

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: ["mon", "tue", "wed", "thu", "fri", "sat"],
    },
    open: {
      type: String,
      required: true,
    },
    close: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: String,
      lowerCase: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "serviceProvider", "admin"],
      default: "user",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    availability: {
      type: [availabilitySchema],
      default: [],
    },

    category: {
      type: String,
      default: "",
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "suspend"],
      default: "active",
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

userSchema.index({ name: "text", bio: "text" });
userSchema.index({ role: 1, category: 1, status: 1 });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

export const User = mongoose.model("User", userSchema);
