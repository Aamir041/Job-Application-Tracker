import "dotenv/config";
import { query, closePool } from "./connection.js";
import { runMigrations } from "./migrate.js";

const SEED_DATA = [
  {
    company: "Anthropic",
    role: "Senior Frontend Engineer",
    status: "Interview",
    salary: "$180k",
    date_submitted: "2026-02-28",
    job_link: "https://anthropic.com/careers",
    rejection_reason: null,
  },
  {
    company: "Linear",
    role: "Product Designer",
    status: "Applied",
    salary: "$140k",
    date_submitted: "2026-03-01",
    job_link: "https://linear.app/jobs",
    rejection_reason: null,
  },
  {
    company: "Vercel",
    role: "Developer Advocate",
    status: "Offer",
    salary: "$160k",
    date_submitted: "2026-02-20",
    job_link: "https://vercel.com/careers",
    rejection_reason: null,
  },
  {
    company: "Figma",
    role: "UX Engineer",
    status: "Rejected",
    salary: "$155k",
    date_submitted: "2026-02-14",
    job_link: "https://figma.com/careers",
    rejection_reason: "Went with internal candidate",
  },
  {
    company: "Notion",
    role: "Full Stack Engineer",
    status: "Screening",
    salary: "$165k",
    date_submitted: "2026-03-03",
    job_link: "https://notion.so/careers",
    rejection_reason: null,
  },
  {
    company: "Stripe",
    role: "Product Engineer",
    status: "Applied",
    salary: "$200k",
    date_submitted: "2026-03-05",
    job_link: "https://stripe.com/jobs",
    rejection_reason: null,
  },
];

async function seed() {
  await runMigrations();

  const { rows } = await query("SELECT COUNT(*)::int AS count FROM applications");
  if (rows[0].count > 0) {
    console.log(`⚠️  Database already has ${rows[0].count} rows. Skipping seed.`);
    return;
  }

  for (const row of SEED_DATA) {
    await query(
      `INSERT INTO applications
         (company, role, status, salary, date_submitted, job_link, rejection_reason)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [row.company, row.role, row.status, row.salary,
       row.date_submitted, row.job_link, row.rejection_reason]
    );
  }

  console.log(`✅  Seeded ${SEED_DATA.length} applications.`);
}

seed()
  .then(() => closePool())
  .catch((err) => { console.error(err); process.exit(1); });