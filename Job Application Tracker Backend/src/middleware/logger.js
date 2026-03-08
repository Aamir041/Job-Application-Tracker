import morgan from "morgan";

// Compact dev format; switch to "combined" in production for full Apache-style logs
const format = process.env.NODE_ENV === "production" ? "combined" : "dev";

export const requestLogger = morgan(format);
