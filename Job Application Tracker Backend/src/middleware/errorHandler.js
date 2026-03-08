/**
 * Catches any errors thrown in route handlers and returns a clean JSON response.
 * Must be registered AFTER all routes with four arguments (err, req, res, next).
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(`[ERROR] ${req.method} ${req.path}`, err);

  // SQLite constraint violations
  if (err.code === "SQLITE_CONSTRAINT") {
    return res.status(409).json({ error: "Database constraint violation", detail: err.message });
  }

  const status  = err.status ?? 500;
  const message = err.expose ? err.message : "Internal server error";

  res.status(status).json({ error: message });
}

/**
 * 404 handler — registered after all routes.
 */
export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
}
