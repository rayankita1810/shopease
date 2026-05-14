import express from "express";
import { trackOrderById } from "../controllers/orderTrackingController.js";

const router = express.Router();

router.get("/:id", trackOrderById);

export default router;