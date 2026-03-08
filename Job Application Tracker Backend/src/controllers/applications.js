import * as Application from "../models/application.js";
import {
  createSchema,
  updateSchema,
  statusSchema,
  listQuerySchema,
} from "../models/schemas.js";

// GET /api/applications
export async function listApplications(req, res, next) {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid query parameters", details: parsed.error.flatten() });
    }
    const applications = await Application.findAll(parsed.data);
    res.json({ data: applications, count: applications.length });
  } catch (err) { next(err); }
}

// GET /api/applications/stats
export async function getStats(req, res, next) {
  try {
    const stats = await Application.getStats();
    res.json({ data: stats });
  } catch (err) { next(err); }
}

// GET /api/applications/:id
export async function getApplication(req, res, next) {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json({ data: application });
  } catch (err) { next(err); }
}

// POST /api/applications
export async function createApplication(req, res, next) {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    const application = await Application.create(parsed.data);
    res.status(201).json({ data: application });
  } catch (err) { next(err); }
}

// PUT /api/applications/:id
export async function updateApplication(req, res, next) {
  try {
    const existing = await Application.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    const updated = await Application.update(req.params.id, parsed.data);
    res.json({ data: updated });
  } catch (err) { next(err); }
}

// PATCH /api/applications/:id/status
export async function updateStatus(req, res, next) {
  try {
    const existing = await Application.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    const updated = await Application.update(req.params.id, parsed.data);
    res.json({ data: updated });
  } catch (err) { next(err); }
}

// DELETE /api/applications/:id
export async function deleteApplication(req, res, next) {
  try {
    const existing = await Application.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }
    await Application.remove(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}