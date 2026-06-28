import asyncHandler from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { Booking } from "../models/booking.model.js";
import { Service } from "../models/service.model.js";

export const createBooking = asyncHandler(async (req, res, next) => {
  const { serviceId, startTime, endTime, notes } = req.body;
  const userId = req.user.id;

  const service = await Service.findById(serviceId);

  if (!service) {
    return next(new ErrorHandler("Serivce Not Found", 404));
  }

  const conflict = await Booking.findOne({
    serviceProviderId: service.serviceProvider,
    status: { $nin: ["cancelled"] },
    $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
  });

  if (conflict) {
    return next(new ErrorHandler("Time slot already booked", 400));
  }

  const booking = await Booking.create({
    userId,
    serviceProviderId: service.serviceProvider,
    serviceId,
    startTime,
    endTime,
    notes,
  });

  return res
    .status(201)
    .json({ success: true, message: "Booking Created", booking });
});

export const getProviderBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ serviceProviderId: req.user.id })
    .populate("userId", "name email phone")
    .populate("serviceId", "name price duration")
    .sort({ startTime: 1 });

  if (bookings.length === 0) {
    return next(new ErrorHandler("No Bookings Found", 404));
  }

  return res.status(200).json({ success: true, bookings });
});

export const getUserBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ userId: req.user.id })
    .populate("serviceProviderId", "name email phone")
    .populate("serviceId", "name price duration")
    .sort({ startTime: 1 });

  if (bookings.length === 0) {
    return next(new ErrorHandler("No Bookings Found", 404));
  }

  return res.status(200).json({ success: true, bookings });
});

export const updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = ["active", "cancelled", "delivered", "complete"];

  if (!allowedStatus.includes(status)) {
    return next(new ErrorHandler("Invalid Status", 400));
  }

  const booking = await Booking.findOne({
    _id: id,
    serviceProviderId: req.user.id,
  });

  if (!booking) return next(new ErrorHandler("Booking not found", 404));

  booking.status = status;
  await booking.save();

  return res
    .status(200)
    .json({ success: true, message: "Status Updated", booking });
});

export const cancelBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const booking = await Booking.findOne({
    _id: id,
    userId: req.user.id,
  });

  if (!booking) return next(new ErrorHandler("Booking not found", 404));

  if (booking.status === "complete") {
    return next(new ErrorHandler("Cannot cancel a completed booking", 400));
  }

  booking.status = "cancelled";
  await booking.save();

  return res.status(200).json({ success: true, message: "Status Cancelled" });
});
