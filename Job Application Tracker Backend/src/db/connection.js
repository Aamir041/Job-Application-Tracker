/**
 * PostgreSQL connection pool using the `pg` package (node-postgres).
 * Pure JavaScript — no native compilation required.
 *
 * Usage:
 *   import { query, getClient, closePool } from "./connection.js";
 *
 *   // Simple query (uses pool automatically)
 *   const { rows } = await query("SELECT * FROM applications WHERE id = $1", [id]);
 *
 *   // Transaction (manual client checkout)
 *   const client = await getClient();
 *   try {
 *     await client.query("BEGIN");
 *     await client.query("...");
 *     await client.query("COMMIT");
 *   } catch (e) {
 *     await client.query("ROLLBACK");
 *     throw e;
 *   } finally {
 *     client.release();
 *   }
 */
import pg from "pg";

const { Pool } = pg;

let _pool = null;

function buildConfig() {
  // If DATABASE_URL is set, pg parses it automatically
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
    };
  }

  return {
    host:     process.env.PGHOST     ?? "localhost",
    port:     parseInt(process.env.PGPORT ?? "5432", 10),
    user:     process.env.PGUSER     ?? "postgres",
    password: process.env.PGPASSWORD ?? "Aamir@123",
    database: process.env.PGDATABASE ?? "job_tracker",
  };
}

export function getPool() {
  if (!_pool) {
    _pool = new Pool({
      ...buildConfig(),
      max:              parseInt(process.env.PG_POOL_MAX              ?? "10",   10),
      idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT_MS      ?? "30000", 10),
      connectionTimeoutMillis: parseInt(process.env.PG_CONNECTION_TIMEOUT_MS ?? "2000", 10),
    });

    _pool.on("error", (err) => {
      console.error("Unexpected PostgreSQL pool error:", err);
    });
  }
  return _pool;
}

/** Run a single query against the pool. */
export async function query(sql, params = []) {
  return getPool().query(sql, params);
}

/** Check out a client for manual transaction management. */
export async function getClient() {
  return getPool().connect();
}

/** Drain and close the pool (used on graceful shutdown & in tests). */
export async function closePool() {
  if (_pool) {
    await _pool.end();
    _pool = null;
  }
}