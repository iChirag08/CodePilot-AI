import express from "express";
import {
  reviewCodeHandler,
  debugCodeHandler,
  optimizeCodeHandler,
  generateTestsHandler,
  chatHandler,
  healthCheckHandler
} from "../controllers/aiController.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Apply rate limiting to AI endpoints
router.use("/review", apiLimiter);
router.use("/debug", apiLimiter);
router.use("/optimize", apiLimiter);
router.use("/tests", apiLimiter);
router.use("/chat", apiLimiter);

// Express REST API routes
router.post("/review", reviewCodeHandler);
router.post("/debug", debugCodeHandler);
router.post("/optimize", optimizeCodeHandler);
router.post("/tests", generateTestsHandler);
router.post("/chat", chatHandler);
router.get("/health", healthCheckHandler);

export default router;
