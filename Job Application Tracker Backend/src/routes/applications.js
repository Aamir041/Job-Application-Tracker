import { Router } from "express";
import {
  listApplications,
  getStats,
  getApplication,
  createApplication,
  updateApplication,
  updateStatus,
  deleteApplication,
} from "../controllers/applications.js";

const router = Router();

// Stats first — must come before /:id to avoid route conflict
router.get("/stats",     getStats);

router.get("/",          listApplications);
router.get("/:id",       getApplication);
router.post("/",         createApplication);
router.put("/:id",       updateApplication);
router.patch("/:id/status", updateStatus);
router.delete("/:id",    deleteApplication);

export default router;
