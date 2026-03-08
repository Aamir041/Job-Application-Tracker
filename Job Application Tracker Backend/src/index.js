import "dotenv/config";
import { createApp } from "./app.js";
import { runMigrations } from "./db/migrate.js";
import { closePool } from "./db/connection.js";

const PORT = parseInt(process.env.PORT ?? "3001", 10);

async function main() {
  // Run migrations on every boot (idempotent — uses CREATE IF NOT EXISTS)
  await runMigrations();

  const app    = createApp();
  const server = app.listen(PORT, () => {
    console.log(`🚀  Job Tracker API running on http://localhost:${PORT}`);
    console.log(`    Environment : ${process.env.NODE_ENV ?? "development"}`);
    console.log(`    Health check: http://localhost:${PORT}/health`);
  });

  // ── Graceful shutdown
  async function shutdown(signal) {
    console.log(`\n${signal} received. Shutting down gracefully…`);
    server.close(async () => {
      await closePool();
      console.log("✅  Server and database pool closed.");
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT",  () => shutdown("SIGINT"));
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});