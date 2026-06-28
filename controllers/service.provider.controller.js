import asyncHandler from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { Service } from "../models/service.model.js";
import { User } from "../models/user.model.js";

export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { bio, category, phone } = req.body;

  const updatedProfile = await User.findByIdAndUpdate(
    userId,
    {
      bio,
      category,
      phone,
    },
    { new: true },
  ).select("-password");

  if (!updatedProfile) {
    return next(new ErrorHandler("No user found", 400));
  }

  return res
    .status(200)
    .json({ success: true, message: "Profile Updated", updateProfile });
});

export const setAvailability = asyncHandler(async (req, res, next) => {
  const { availability } = req.body;

  if (!Array.isArray(availability))
    return next(new ErrorHandler("Availability must be an array", 400));

  const provider = await User.findByIdAndUpdate(
    req.user.id,
    { availability },
    { new: true },
  ).select("availability");

  res.status(200).json({ success: true, data: provider.availability });
});

export const createService = asyncHandler(async (req, res, next) => {
  const { name, description, duration, price } = req.body;

  const serviceData = {
    serviceProvider: req.user.id,
    name,
    description,
    duration,
    price,
  };

  if (req.file) {
    serviceData.image = {
      public_id: req.file.filename,
      url: req.file.path,
    };
  }

  const service = await Service.create(serviceData);

  return res
    .status(201)
    .json({ success: true, message: "Service Created", service });
});

export const getMyServices = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const services = await Service.find({ serviceProvider: userId });

  if (services.length === 0) {
    return next(new ErrorHandler("No service Found", 404));
  }

  return res.status(200).json({ success: true, services });
});

export const deleteService = asyncHandler(async (req, res, next) => {
  const { serviceId } = req.params;
  const userId = req.user.id;

  const service = await Service.findOne({
    _id: serviceId,
    serviceProvider: userId,
  });

  if (!service) {
    return next(new ErrorHandler("No service found", 404));
  }

  await service.deleteOne();

  return res.status(200).json({ success: true, message: "Service Deleted" });
});
