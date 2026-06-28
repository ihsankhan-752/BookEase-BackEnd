import express from "express";
import userRouter from "./user.routes.js";
import bookingRouter from "./booking.routes.js";
import serviceProviderRouter from "./service.provider.routes.js";
const router = express.Router();

router.use("/api/users", userRouter);
router.use("/api/serviceProvider", serviceProviderRouter);
router.use("/api/bookings", bookingRouter);
export default router;
