import { query, getClient } from "../db/connection.js";

/**
 * Converts a snake_case Postgres row to the camelCase shape the frontend expects.
 * pg returns date columns as JS Date objects — we normalise to ISO strings.
 */
function toClient(row) {
  if (!row) return null;

  const dateStr = row.date_submitted
    ? (row.date_submitted instanceof Date
        ? row.date_submitted.toISOString().slice(0, 10)
        : row.date_submitted)
    : null;

  return {
    id:              row.id,
    company:         row.company,
    role:            row.role,
    status:          row.status,
    salary:          row.salary           ?? null,
    dateSubmitted:   dateStr,
    jobLink:         row.job_link         ?? null,
    rejectionReason: row.rejection_reason ?? null,
    createdAt:       row.created_at,
    updatedAt:       row.updated_at,
  };
}

// ── Queries ──────────────────────────────────────────────────────────────────

export async function findAll({ status, sort = "date_submitted", order = "desc" } = {}) {
  const ALLOWED_SORT  = ["date_submitted", "company", "created_at"];
  const ALLOWED_ORDER = ["asc", "desc"];

  const sortCol = ALLOWED_SORT.includes(sort)   ? sort  : "date_submitted";
  const sortDir = ALLOWED_ORDER.includes(order)  ? order.toUpperCase() : "DESC";

  const params = [];
  let where = "";

  if (status) {
    params.push(status);
    where = `WHERE status = $1`;
  }

  const sql = `
    SELECT * FROM applications
    ${where}
    ORDER BY ${sortCol} ${sortDir} NULLS LAST
  `;

  const { rows } = await query(sql, params);
  return rows.map(toClient);
}

export async function findById(id) {
  const { rows } = await query(
    "SELECT * FROM applications WHERE id = $1",
    [id]
  );
  return toClient(rows[0] ?? null);
}

export async function create(data) {
  const { rows } = await query(
    `INSERT INTO applications
       (company, role, status, salary, date_submitted, job_link, rejection_reason)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.company,
      data.role,
      data.status          ?? "Applied",
      data.salary          ?? null,
      data.dateSubmitted   ?? null,
      data.jobLink         ?? null,
      data.rejectionReason ?? null,
    ]
  );
  return toClient(rows[0]);
}

export async function update(id, data) {
  const fields = [];
  const params = [];
  let   idx    = 1;

  if (data.company         !== undefined) { fields.push(`company = $${idx++}`);          params.push(data.company); }
  if (data.role            !== undefined) { fields.push(`role = $${idx++}`);             params.push(data.role); }
  if (data.status          !== undefined) { fields.push(`status = $${idx++}`);           params.push(data.status); }
  if (data.salary          !== undefined) { fields.push(`salary = $${idx++}`);           params.push(data.salary); }
  if (data.dateSubmitted   !== undefined) { fields.push(`date_submitted = $${idx++}`);   params.push(data.dateSubmitted); }
  if (data.jobLink         !== undefined) { fields.push(`job_link = $${idx++}`);         params.push(data.jobLink); }
  if (data.rejectionReason !== undefined) { fields.push(`rejection_reason = $${idx++}`); params.push(data.rejectionReason); }

  if (fields.length === 0) return findById(id);

  params.push(id);
  const { rows } = await query(
    `UPDATE applications SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    params
  );

  return toClient(rows[0] ?? null);
}

export async function remove(id) {
  const { rowCount } = await query(
    "DELETE FROM applications WHERE id = $1",
    [id]
  );
  return rowCount > 0;
}

export async function getStats() {
  const [countsResult, totalResult] = await Promise.all([
    query(`SELECT status, COUNT(*)::int AS count FROM applications GROUP BY status`),
    query(`SELECT COUNT(*)::int AS count FROM applications`),
  ]);

  const total    = totalResult.rows[0].count;
  const statsMap = Object.fromEntries(
    countsResult.rows.map((r) => [r.status, r.count])
  );

  return {
    total,
    byStatus: {
      Applied:   statsMap.Applied   ?? 0,
      Screening: statsMap.Screening ?? 0,
      Interview: statsMap.Interview ?? 0,
      Offer:     statsMap.Offer     ?? 0,
      Rejected:  statsMap.Rejected  ?? 0,
    },
    active: total - (statsMap.Rejected ?? 0),
  };
}