import express from "express";
import helmet from "helmet";
import cors from "cors";

import { requestLogger } from "./middleware/logger.js";
import { limiter }       from "./middleware/rateLimiter.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import applicationsRouter from "./routes/applications.js";

export function createApp() {
  const app = express();

  // ── Security headers
  app.use(helmet());

  // ── CORS
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow server-to-server / curl (no origin header)
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // ── Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // ── Logging
  if (process.env.NODE_ENV !== "test") {
    app.use(requestLogger);
  }

  // ── Rate limiting
  app.use(limiter);

  // ── Health check
  app.get("/health", (_req, res) =>
    res.json({ status: "ok", timestamp: new Date().toISOString() })
  );

  // ── API routes
  app.use("/api/applications", applicationsRouter);

  // ── 404 + error handling (order matters)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
