import express from "express";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import { errorMiddleware } from "./middlewares/error.middeware.js";
const app = express();

connectDB();

app.use(express.json());

app.use(errorMiddleware);
app.listen(process.env.PORT || 8000, () => {
  console.log("Server is Up and Running");
});
