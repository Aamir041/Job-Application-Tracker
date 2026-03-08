import { z } from "zod";

export const STATUSES = ["Applied", "Screening", "Interview", "Offer", "Rejected"];

const statusEnum = z.enum(STATUSES);

// Used for POST /applications
export const createSchema = z.object({
  company:         z.string().min(1, "Company name is required").max(120),
  role:            z.string().min(1, "Role is required").max(180),
  status:          statusEnum.default("Applied"),
  salary:          z.string().max(50).nullable().optional(),
  dateSubmitted:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").nullable().optional(),
  jobLink:         z.string().url("Must be a valid URL").max(500).nullable().optional(),
  rejectionReason: z.string().max(500).nullable().optional(),
});

// Used for PUT /applications/:id — all fields optional
export const updateSchema = createSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Request body must contain at least one field to update" }
);

// Used for PATCH /applications/:id/status
export const statusSchema = z.object({
  status: statusEnum,
});

// Query params for GET /applications
export const listQuerySchema = z.object({
  status: statusEnum.optional(),
  sort:   z.enum(["date_submitted", "company", "created_at"]).optional(),
  order:  z.enum(["asc", "desc"]).optional(),
});
