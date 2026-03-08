import { useState, useEffect, useCallback } from "react";
import {
  getApplications,
  createApplication,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../services/api";

/**
 * Central state hook for job applications.
 * Fetches from the backend on mount and after every mutation.
 * Exposes: jobs, loading, error, and CRUD functions.
 */
export function useJobs() {
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getApplications();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // ── Mutations ──────────────────────────────────────────────────────────────

  const addJob = useCallback(async (data) => {
    const created = await createApplication(data);
    setJobs((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateJob = useCallback(async (id, data) => {
    const updated = await updateApplication(id, data);
    setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
    return updated;
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    const updated = await updateApplicationStatus(id, status);
    setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
    return updated;
  }, []);

  const deleteJob = useCallback(async (id) => {
    await deleteApplication(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, []);

  return { jobs, loading, error, addJob, updateJob, updateStatus, deleteJob, refetch: fetchJobs };
}