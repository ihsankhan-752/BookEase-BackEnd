import express from "express";
import {
  createReview,
  getServiceReview,
} from "../controllers/review.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", authMiddleware, createReview);
router.get("/:serviceId", authMiddleware, getServiceReview);
export default router;
