import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and middleware
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use("/api", apiRoutes);

// Root route welcome message
app.get("/", (req, res) => {
  res.json({
    message: "CodePilot AI Engine API is online.",
    documentation: "/api/health"
  });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 CodePilot AI Backend Server running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});
