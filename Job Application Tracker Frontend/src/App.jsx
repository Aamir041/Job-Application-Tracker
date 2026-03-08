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

export default function App() {
  useGlobalStyles();

  const { jobs, addJob, updateJob, updateStatus, deleteJob } = useJobs();

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  // Derived counts
  const counts = STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: jobs.filter((j) => j.status === s).length }),
    {}
  );

  // Filtered + sorted list
  const filtered = jobs
    .filter((j) => filter === "All" || j.status === filter)
    .filter(
      (j) =>
        !search ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.role.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "date"
        ? new Date(b.date) - new Date(a.date)
        : a.company.localeCompare(b.company)
    );

  const handleAdd = (data) => {
    addJob(data);
    setShowAdd(false);
  };

  const handleEdit = (data) => {
    updateJob(editing.id, data);
    setEditing(null);
  };

  const handleDelete = (id) => {
    deleteJob(id);
    setViewing(null);
  };

  const handleStatusChange = (id, status) => {
    updateStatus(id, status);
    setViewing((v) => (v ? { ...v, status } : v));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0C0B10",
        color: "#E8E4DC",
        fontFamily: "'DM Mono', monospace",
        margin: 0,
        padding: 0,
        boxSizing: "border-box"
      }}
    >
      {/* Ambient background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(107,159,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(167,139,250,0.05) 0%, transparent 60%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 40,
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#6B9FFF",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              ◆ Career Dashboard
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(28px, 4vw, 40px)",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                color: "#F0EDE8",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Application
              <br />
              <span style={{ color: "#6B9FFF" }}>Tracker</span>
            </h1>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "12px",
                color: "#4A4640",
                letterSpacing: "0.05em",
              }}
            >
              {jobs.length} applications tracked · Spring 2026
            </p>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(107,159,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(107,159,255,0.3)";
            }}
            style={{
              padding: "12px 22px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6B9FFF 0%, #A78BFA 100%)",
              border: "none",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.05em",
              boxShadow: "0 4px 20px rgba(107,159,255,0.3)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
          >
            <span style={{ fontSize: 16 }}>+</span> Add Application
          </button>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
          <StatCard label="Total" value={jobs.length} accent="#E8E4DC" />
          <StatCard
            label="Active"
            value={jobs.filter((j) => j.status !== "Rejected").length}
            accent="#6B9FFF"
          />
          <StatCard label="Interviews" value={counts.Interview || 0} accent="#A78BFA" />
          <StatCard label="Offers" value={counts.Offer || 0} accent="#34D399" />
        </div>

        {/* ── Pipeline ── */}
        <PipelineBar jobs={jobs} />

        {/* ── Filters ── */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 4,
              ...glassStyle,
              borderRadius: "10px",
              padding: "4px",
            }}
          >
            {["All", ...STATUSES].map((s) => (
              <button
                key={s}
                className="tab-btn"
                onClick={() => setFilter(s)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "7px",
                  fontSize: "11px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: filter === s ? "600" : "400",
                  letterSpacing: "0.04em",
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
            placeholder="Search companies, roles..."
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

        {/* ── Table ── */}
        <JobTable
          jobs={filtered}
          onView={setViewing}
          onEdit={setEditing}
          onDelete={handleDelete}
        />

        <div
          style={{
            marginTop: 16,
            fontSize: "11px",
            color: "#2A2A2F",
            textAlign: "center",
            letterSpacing: "0.05em",
          }}
        >
          {filtered.length} of {jobs.length} applications · Job Tracker 2026
        </div>
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
    </div>
  );
}
