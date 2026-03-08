import { glassStyle } from "../styles/shared";
import { StatusBadge } from "./StatusBadge";
import { LogoBubble } from "./LogoBubble";

export function JobTable({ jobs, onView, onEdit, onDelete }) {
  return (
    <div style={{ ...glassStyle, borderRadius: "16px", overflow: "hidden" }}>
      {/* Header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr auto",
          padding: "12px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          fontSize: "10px",
          color: "#4A4640",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        <span>Company</span>
        <span>Role</span>
        <span>Status</span>
        <span>Date Submitted</span>
        <span>Salary</span>
        <span />
      </div>

      {/* Empty state */}
      {jobs.length === 0 && (
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "#4A4640",
            fontSize: "13px",
          }}
        >
          No applications match your filter.
        </div>
      )}

      {/* Job rows */}
      {jobs.map((job, i) => (
        <div
          key={job.id}
          className="job-row"
          onClick={() => onView(job)}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr auto",
            padding: "14px 20px",
            borderBottom:
              i < jobs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            alignItems: "center",
            gap: 8,
            animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
          }}
        >
          {/* Company */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LogoBubble char={job.logo} company={job.company} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#E8E4DC" }}>
                {job.company}
              </div>
              {job.jobLink && (
                <a
                  href={job.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: "10px", color: "#6B9FFF", marginTop: 2, display: "block", textDecoration: "none", opacity: 0.8 }}
                >
                  ↗ Job Req
                </a>
              )}
            </div>
          </div>

          {/* Role */}
          <div>
            <div style={{ fontSize: "12px", color: "#B0AAA4" }}>{job.role}</div>
            {job.status === "Rejected" && job.rejectionReason && (
              <div
                style={{
                  fontSize: "10px",
                  color: "#F87171",
                  marginTop: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 200,
                  opacity: 0.7,
                }}
              >
                ✕ {job.rejectionReason}
              </div>
            )}
          </div>

          <StatusBadge status={job.status} />
          <span style={{ fontSize: "11px", color: "#7A7570", marginLeft: "3rem" }}>{job.dateSubmitted}</span>
          <span style={{ fontSize: "12px", color: "#34D399", fontWeight: "500", marginLeft: "2.3rem" }}>
            {job.salary}
          </span>

          {/* Actions */}
          <div
            style={{ display: "flex", gap: 6, alignItems: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(job)}
              title="Edit"
              style={{
                background: "none",
                border: "none",
                color: "#4A4640",
                cursor: "pointer",
                fontSize: 14,
                padding: 2,
              }}
            >
              ✎
            </button>
            <button
              onClick={() => onDelete(job.id)}
              title="Delete"
              style={{
                background: "none",
                border: "none",
                color: "#4A4640",
                cursor: "pointer",
                fontSize: 14,
                padding: 2,
              }}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
