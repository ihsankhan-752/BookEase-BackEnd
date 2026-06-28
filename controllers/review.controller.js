import asyncHandler from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { Review } from "../models/review.model.js";
import { Booking } from "../models/booking.model.js";
import { Service } from "../models/service.model.js";

export const createReview = asyncHandler(async (req, res, next) => {
  const { bookingId, review, rating } = req.body;
  const userId = req.user.id;

  const booking = await Booking.findOne({ _id: bookingId, userId });
  if (!booking) return next(new ErrorHandler("Booking not found", 404));

  if (booking.status !== "complete") {
    return next(new ErrorHandler("Can only review completed bookings", 400));
  }

  const newReview = await Review.create({
    userId,
    serviceId: booking.serviceId,
    bookingId,
    rating,
    review,
  });

  const allReviews = await Review.find({ serviceId: booking.serviceId });
  const average =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await Service.findByIdAndUpdate(booking.serviceId, {
    averageRating: average.toFixed(1),
    totalReviews: allReviews.length,
  });

  return res
    .status(201)
    .json({ success: true, message: "Review Created", review: newReview });
});

export const getServiceReview = asyncHandler(async (req, res, next) => {
  const { serviceId } = req.params;

  const reviews = await Review.find({ serviceId })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 });

  if (!reviews.length) return next(new ErrorHandler("No reviews found", 404));

  return res.status(200).json({ success: true, reviews });
});
