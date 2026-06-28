import express from "express";
import {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createBooking);
router.get("/my", getUserBookings);
router.get("/provider", getProviderBookings);
router.patch("/:id/status", updateBookingStatus);
router.patch("/:id/cancel", cancelBooking);

export default router;
