import { useState } from "react";
import { useGlobalStyles } from "./hooks/useGlobalStyles";
import { useJobs } from "./hooks/useJobs";
import { STATUSES } from "./data/constants";
import { glassStyle, inputStyle } from "./styles/shared";

import { StatCard } from "./components/StatCard";
import { PipelineBar } from "./components/PipelineBar";
import { JobTable } from "./components/JobTable";
import { Modal } from "./components/Modal";
import { JobForm } from "./components/JobForm";
import { JobDetailModal } from "./components/JobDetailModal";

// ── Inline UI primitives ──────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", gap: 16 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "3px solid rgba(107,159,255,0.15)",
        borderTopColor: "#6B9FFF",
        animation: "spin 0.8s linear infinite",
      }} />
      <span style={{ fontSize: "12px", color: "#4A4640", letterSpacing: "0.1em" }}>Loading applications…</span>
    </div>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div style={{
      background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
      borderRadius: "12px", padding: "16px 20px", marginBottom: 24,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>⚠</span>
        <span style={{ fontSize: "13px", color: "#F87171" }}>{message}</span>
      </div>
      {onRetry && (
        <button onClick={onRetry} style={{
          background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)",
          borderRadius: "8px", color: "#F87171", fontSize: "11px", cursor: "pointer",
          padding: "6px 14px", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap",
        }}>
          Retry
        </button>
      )}
    </div>
  );
}

function MutationToast({ message, type }) {
  if (!message) return null;
  const color = type === "error" ? "#F87171" : "#34D399";
  const bg    = type === "error" ? "rgba(248,113,113,0.1)" : "rgba(52,211,153,0.1)";
  const bdr   = type === "error" ? "rgba(248,113,113,0.25)" : "rgba(52,211,153,0.25)";
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 200,
      background: bg, border: `1px solid ${bdr}`, borderRadius: "10px",
      padding: "12px 18px", fontSize: "12px", color, fontFamily: "'DM Mono', monospace",
      animation: "fadeUp 0.2s ease", maxWidth: 320, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      {message}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  useGlobalStyles();

  const { jobs, loading, error, addJob, updateJob, updateStatus, deleteJob, refetch } = useJobs();

  const [filter,  setFilter]  = useState("All");
  const [search,  setSearch]  = useState("");
  const [sort,    setSort]    = useState("date");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  // Mutation feedback
  const [toast, setToast] = useState(null); // { message, type }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Derived state ──────────────────────────────────────────────────────────

  const counts = STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: jobs.filter((j) => j.status === s).length }),
    {}
  );

  const filtered = jobs
    .filter((j) => filter === "All" || j.status === filter)
    .filter((j) =>
      !search ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "date"
        ? new Date(b.dateSubmitted ?? 0) - new Date(a.dateSubmitted ?? 0)
        : a.company.localeCompare(b.company)
    );

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleAdd(data) {
    try {
      await addJob(data);
      setShowAdd(false);
      showToast("Application added ✓");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleEdit(data) {
    try {
      const updated = await updateJob(editing.id, data);
      // Sync the viewing panel if it's open for this record
      setViewing((v) => (v?.id === editing.id ? updated : v));
      setEditing(null);
      showToast("Application updated ✓");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteJob(id);
      setViewing(null);
      showToast("Application deleted");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleStatusChange(id, status) {
    try {
      const updated = await updateStatus(id, status);
      setViewing((v) => (v?.id === id ? updated : v));
      showToast(`Status → ${status}`);
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: "#0C0B10", color: "#E8E4DC", fontFamily: "'DM Mono', monospace" }}>

      {/* Ambient background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(107,159,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(167,139,250,0.05) 0%, transparent 60%)",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: "11px", color: "#6B9FFF", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>
              ◆ Career Dashboard
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(28px, 4vw, 40px)", fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#F0EDE8", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Application<br />
              <span style={{ color: "#6B9FFF" }}>Tracker</span>
            </h1>
            <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#4A4640", letterSpacing: "0.05em" }}>
              {loading ? "Loading…" : `${jobs.length} applications tracked · Spring 2026`}
            </p>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            disabled={loading}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(107,159,255,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 4px 20px rgba(107,159,255,0.3)"; }}
            style={{
              padding: "12px 22px", borderRadius: "12px",
              background: "linear-gradient(135deg, #6B9FFF 0%, #A78BFA 100%)",
              border: "none", color: "#fff", fontSize: "12px", fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1,
              fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em",
              boxShadow: "0 4px 20px rgba(107,159,255,0.3)",
              display: "flex", alignItems: "center", gap: 8,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
          >
            <span style={{ fontSize: 16 }}>+</span> Add Application
          </button>
        </div>

        {/* ── Error banner ── */}
        {error && <ErrorBanner message={`Could not reach the API: ${error}`} onRetry={refetch} />}

        {/* ── Loading / content ── */}
        {loading ? <LoadingSpinner /> : (
          <>
            {/* Stats */}
            <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
              <StatCard label="Total"      value={jobs.length}                                   accent="#E8E4DC" />
              <StatCard label="Active"     value={jobs.filter((j) => j.status !== "Rejected").length} accent="#6B9FFF" />
              <StatCard label="Interviews" value={counts.Interview || 0}                          accent="#A78BFA" />
              <StatCard label="Offers"     value={counts.Offer     || 0}                          accent="#34D399" />
            </div>

            {/* Pipeline */}
            <PipelineBar jobs={jobs} />

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 4, ...glassStyle, borderRadius: "10px", padding: "4px" }}>
                {["All", ...STATUSES].map((s) => (
                  <button
                    key={s}
                    className="tab-btn"
                    onClick={() => setFilter(s)}
                    style={{
                      padding: "7px 14px", borderRadius: "7px", fontSize: "11px",
                      border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace",
                      fontWeight: filter === s ? "600" : "400", letterSpacing: "0.04em",
                      background: filter === s ? "rgba(107,159,255,0.2)" : "transparent",
                      color: filter === s ? "#6B9FFF" : "#4A4640",
                      transition: "all 0.15s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <input
                style={{ ...inputStyle, maxWidth: 220, flex: 1 }}
                placeholder="Search companies, roles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                style={{ ...inputStyle, width: "auto", flex: "none" }}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="date">Sort: Date</option>
                <option value="company">Sort: Company</option>
              </select>
            </div>

            {/* Table */}
            <JobTable
              jobs={filtered}
              onView={setViewing}
              onEdit={setEditing}
              onDelete={handleDelete}
            />

            <div style={{ marginTop: 16, fontSize: "11px", color: "#2A2A2F", textAlign: "center", letterSpacing: "0.05em" }}>
              {filtered.length} of {jobs.length} applications · Job Tracker 2026
            </div>
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {showAdd && (
        <Modal title="New Application" onClose={() => setShowAdd(false)}>
          <JobForm onSave={handleAdd} />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Application" onClose={() => setEditing(null)}>
          <JobForm initial={editing} onSave={handleEdit} />
        </Modal>
      )}

      {viewing && (
        <JobDetailModal
          job={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null); }}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* ── Toast notification ── */}
      <MutationToast message={toast?.message} type={toast?.type} />
    </div>
  );
}