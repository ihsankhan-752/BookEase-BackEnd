import asyncHandler from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import jwt from "jsonwebtoken";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next(new ErrorHandler("Auth Header Missing", 404));
  }

  if (!authHeader.startsWith("Bearer ")) {
    return next(new ErrorHandler("Bearer Missing", 404));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("Token Missing", 404));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;

  next();
});
