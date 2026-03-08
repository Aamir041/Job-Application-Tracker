# Job Tracker — Backend API

Node.js + Express REST API backed by **PostgreSQL** via `pg` (node-postgres).  
Pure JavaScript — no native compilation, works on Windows, macOS, and Linux.

## Prerequisites

- Node.js 18+
- A running PostgreSQL instance (local or hosted)

## Quick Start

```bash
cp .env.example .env       # fill in your DATABASE_URL
npm install
npm run migrate            # create tables, indexes, trigger (auto-runs on boot too)
npm run seed               # optional: load 6 sample applications
npm run dev                # start with hot-reload (nodemon)
```

API is available at **http://localhost:3001**

---

## Project Structure

```
job-tracker-backend/
├── .env.example
├── package.json
├── jest.config.json
├── tests/
│   └── applications.test.js    # Integration tests (supertest + Postgres test DB)
└── src/
    ├── index.js                # Server boot — migrations → listen → graceful shutdown
    ├── app.js                  # Express app factory (helmet, cors, rate limit, routes)
    │
    ├── db/
    │   ├── connection.js       # pg Pool singleton + query/getClient/closePool helpers
    │   ├── migrate.js          # CREATE TABLE / INDEX / TRIGGER (idempotent)
    │   └── seed.js             # Sample data loader
    │
    ├── models/
    │   ├── application.js      # All SQL queries; snake_case ↔ camelCase mapping
    │   └── schemas.js          # Zod validation schemas
    │
    ├── controllers/
    │   └── applications.js     # Async request handlers — validate → model → respond
    │
    ├── routes/
    │   └── applications.js     # Express Router — maps HTTP verbs to controllers
    │
    ├── middleware/
    │   ├── errorHandler.js     # Global error + 404 handler
    │   ├── logger.js           # Morgan request logger
    │   └── rateLimiter.js      # express-rate-limit (100 req/min)
    │
    └── services/
        └── api.js              # ← copy into frontend/src/services/
```

---

## Database Schema

```sql
CREATE TYPE application_status AS ENUM
  ('Applied', 'Screening', 'Interview', 'Offer', 'Rejected');

CREATE TABLE applications (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company          TEXT NOT NULL,
  role             TEXT NOT NULL,
  status           application_status NOT NULL DEFAULT 'Applied',
  salary           TEXT,
  date_submitted   DATE,
  job_link         TEXT,
  rejection_reason TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()  -- auto-updated via trigger
);
```

---

## API Reference

### Health

| Method | Path      | Description    |
|--------|-----------|----------------|
| GET    | `/health` | Liveness check |

### Applications

| Method | Path                           | Description                        |
|--------|--------------------------------|------------------------------------|
| GET    | `/api/applications`            | List all (filter & sort via query) |
| GET    | `/api/applications/stats`      | Counts by status                   |
| GET    | `/api/applications/:id`        | Get one by UUID                    |
| POST   | `/api/applications`            | Create                             |
| PUT    | `/api/applications/:id`        | Full update                        |
| PATCH  | `/api/applications/:id/status` | Update status only                 |
| DELETE | `/api/applications/:id`        | Delete                             |

### Query Parameters — `GET /api/applications`

| Param    | Values                                               | Default          |
|----------|------------------------------------------------------|------------------|
| `status` | `Applied` `Screening` `Interview` `Offer` `Rejected` | *(all)*          |
| `sort`   | `date_submitted` `company` `created_at`              | `date_submitted` |
| `order`  | `asc` `desc`                                         | `desc`           |

### Request Body — `POST / PUT`

```json
{
  "company":         "Stripe",
  "role":            "Product Engineer",
  "status":          "Applied",
  "salary":          "$200k",
  "dateSubmitted":   "2026-03-05",
  "jobLink":         "https://stripe.com/jobs/123",
  "rejectionReason": null
}
```

### Response Envelope

```json
{ "data": { "id": "uuid", "company": "Stripe", ... } }
```

Errors:
```json
{ "error": "Application not found" }
```

Validation errors also include a `details` field from Zod.

---

## Running Tests

Tests require a Postgres database. Set `DATABASE_URL` to a test database before running:

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/job_tracker_test npm test
```

The suite calls `TRUNCATE TABLE applications` before each test — it will not touch your main database as long as you point it at a separate one.

---

## Environment Variables

| Variable                  | Default                                              | Description                     |
|---------------------------|------------------------------------------------------|---------------------------------|
| `PORT`                    | `3001`                                               | HTTP port                       |
| `NODE_ENV`                | `development`                                        | Affects logging format          |
| `DATABASE_URL`            | —                                                    | Full Postgres connection string |
| `PGHOST`                  | `localhost`                                          | Used if DATABASE_URL is not set |
| `PGPORT`                  | `5432`                                               |                                 |
| `PGUSER`                  | `postgres`                                           |                                 |
| `PGPASSWORD`              | `password`                                           |                                 |
| `PGDATABASE`              | `job_tracker`                                        |                                 |
| `PG_POOL_MAX`             | `10`                                                 | Max pool connections            |
| `PG_IDLE_TIMEOUT_MS`      | `30000`                                              | Idle connection timeout         |
| `PG_CONNECTION_TIMEOUT_MS`| `2000`                                               | Connection acquire timeout      |
| `ALLOWED_ORIGINS`         | `http://localhost:5173`                              | Comma-separated CORS origins    |
| `RATE_LIMIT_WINDOW_MS`    | `60000`                                              | Rate limit window in ms         |
| `RATE_LIMIT_MAX`          | `100`                                                | Max requests per window         |

---

## Connecting the Frontend

1. Copy `src/services/api.js` into your frontend at `src/services/api.js`
2. Add `VITE_API_URL=http://localhost:3001/api` to the frontend `.env`
3. Replace `useJobs` hook calls with the exported API functions:

```js
import { getApplications, createApplication, updateApplication,
         updateApplicationStatus, deleteApplication } from "../services/api";
```