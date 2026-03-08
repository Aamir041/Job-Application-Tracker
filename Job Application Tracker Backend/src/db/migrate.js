import "dotenv/config";
import { query, closePool } from "./connection.js";

export async function runMigrations() {
  // Create the status enum type if it doesn't already exist
  await query(`
    DO $$ BEGIN
      CREATE TYPE application_status AS ENUM
        ('Applied', 'Screening', 'Interview', 'Offer', 'Rejected');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  // Create the updated_at auto-trigger function (reusable across tables)
  await query(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Create applications table
  await query(`
    CREATE TABLE IF NOT EXISTS applications (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company          TEXT NOT NULL,
      role             TEXT NOT NULL,
      status           application_status NOT NULL DEFAULT 'Applied',
      salary           TEXT,
      date_submitted   DATE,
      job_link         TEXT,
      rejection_reason TEXT,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Indexes
  await query(`
    CREATE INDEX IF NOT EXISTS idx_applications_status
      ON applications(status);
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_applications_date_submitted
      ON applications(date_submitted DESC NULLS LAST);
  `);

  // Auto-update trigger
  await query(`
    DROP TRIGGER IF EXISTS trg_applications_updated_at ON applications;
    CREATE TRIGGER trg_applications_updated_at
      BEFORE UPDATE ON applications
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  `);

  console.log("✅  Migrations complete.");
}

// Allow running directly: node src/db/migrate.js
if (process.argv[1].endsWith("migrate.js")) {
  runMigrations()
    .then(() => closePool())
    .catch((err) => { console.error(err); process.exit(1); });
}