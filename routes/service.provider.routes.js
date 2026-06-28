import express from "express";
import {
  createService,
  updateProfile,
  setAvailability,
  getMyServices,
  deleteService,
} from "../controllers/service.provider.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.patch("/update", authMiddleware, updateProfile);
router.patch("/availability", authMiddleware, setAvailability);
router.post("/", authMiddleware, upload.single("image"), createService);
router.get("/", authMiddleware, getMyServices);
router.delete("/:id", authMiddleware, deleteService);

export default router;
