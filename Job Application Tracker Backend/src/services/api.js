/**
 * api.js  — drop into the frontend's src/services/ folder.
 *
 * Wraps every backend endpoint so components never call fetch() directly.
 * All functions return the unwrapped `data` payload or throw an Error.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null; // DELETE success — no body

  const json = await res.json();
  if (!res.ok) {
    const msg = json?.error ?? `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return json.data;
}

// ── Applications ─────────────────────────────────────────────────────────────

/**
 * @param {{ status?: string, sort?: string, order?: string }} [params]
 */
export const getApplications = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
  ).toString();
  return request("GET", `/applications${qs ? `?${qs}` : ""}`);
};

export const getApplication = (id) =>
  request("GET", `/applications/${id}`);

/**
 * @param {{ company, role, status, salary, dateSubmitted, jobLink, rejectionReason }} data
 */
export const createApplication = (data) =>
  request("POST", "/applications", data);

export const updateApplication = (id, data) =>
  request("PUT", `/applications/${id}`, data);

export const updateApplicationStatus = (id, status) =>
  request("PATCH", `/applications/${id}/status`, { status });

export const deleteApplication = (id) =>
  request("DELETE", `/applications/${id}`);

// ── Stats ────────────────────────────────────────────────────────────────────

export const getStats = () =>
  request("GET", "/applications/stats");
