import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import redis from "../config/redis.js";
import asyncHanler from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import bcrypt from "bcrypt";

const signAccess = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });

const signRefresh = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

export const register = asyncHanler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler("User already exist", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === "serviceProvider" ? "serviceProvider" : "user",
  });

  const accessToken = signAccess(user._id);
  const refreshToken = signRefresh(user._id);

  await redis.setex(`refresh:${user._id}`, 60 * 60 * 24 * 7, refreshToken);

  return res.status(201).json({
    success: true,
    refreshToken,
    accessToken,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const login = asyncHanler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    return next(new ErrorHandler("Incorrect Password", 401));
  }

  const accessToken = signAccess(user._id);
  const refreshToken = signRefresh(user._id);

  await redis.setex(`refresh:${user._id}`, 60 * 60 * 24 * 7, refreshToken);

  return res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const logout = asyncHanler(async (req, res, next) => {
  await redis.del(`refresh:${req.user._id}`);

  return res.status(200).json({ success: true, message: "Logged out" });
});

export const getMe = asyncHanler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("No User Found", 404));
  }

  return res.status(200).json({ success: true, data: user });
});
