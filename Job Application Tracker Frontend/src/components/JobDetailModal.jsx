import { Modal } from "./Modal";
import { StatusBadge } from "./StatusBadge";
import { LogoBubble } from "./LogoBubble";
import { STATUSES, STATUS_CONFIG } from "../data/constants";
import { glassStyle } from "../styles/shared";

function DetailRow({ label, value, isLink, isRejection }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#4A4640" }}>
        {label}
      </div>
      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "12px", color: "#6B9FFF", wordBreak: "break-all", textDecoration: "none" }}
        >
          {value} ↗
        </a>
      ) : (
        <div style={{ fontSize: "13px", color: isRejection ? "#F87171" : "#B0AAA4", lineHeight: 1.5 }}>
          {value || "—"}
        </div>
      )}
    </div>
  );
}

export function JobDetailModal({ job, onClose, onEdit, onDelete, onStatusChange }) {
  if (!job) return null;

  return (
    <Modal title="Application Details" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Header */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <LogoBubble char={job.logo} company={job.company} />
          <div>
            <div style={{ fontSize: "20px", fontFamily: "'Playfair Display', serif", color: "#F0EDE8" }}>
              {job.company}
            </div>
            <div style={{ fontSize: "13px", color: "#7A7570", marginTop: 2 }}>{job.role}</div>
          </div>
        </div>

        {/* Status badge */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <StatusBadge status={job.status} />
          {job.salary && (
            <span style={{ ...glassStyle, borderRadius: "20px", padding: "4px 10px", fontSize: "11px", color: "#34D399" }}>
              {job.salary}
            </span>
          )}
        </div>

        {/* Detail fields */}
        <div style={{ ...glassStyle, borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          <DetailRow label="Date Submitted" value={job.dateSubmitted} />
          <DetailRow label="Link to Job Req" value={job.jobLink} isLink />
          {job.status === "Rejected" && (
            <DetailRow label="Rejection Reason" value={job.rejectionReason} isRejection />
          )}
        </div>

        {/* Status switcher */}
        <div>
          <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, color: "#4A4640" }}>
            Update Status
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {STATUSES.map((s) => {
              const c = STATUS_CONFIG[s];
              const active = job.status === s;
              return (
                <button
                  key={s}
                  onClick={() => onStatusChange(job.id, s)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "8px",
                    background: active ? c.bg : "transparent",
                    border: `1px solid ${active ? c.color : "rgba(255,255,255,0.08)"}`,
                    color: active ? c.color : "#4A4640",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: active ? "600" : "400",
                    transition: "all 0.15s",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onEdit}
            style={{
              flex: 1, padding: "11px", borderRadius: "10px",
              background: "rgba(107,159,255,0.12)", border: "1px solid rgba(107,159,255,0.2)",
              color: "#6B9FFF", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Mono', monospace",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(job.id)}
            style={{
              flex: 1, padding: "11px", borderRadius: "10px",
              background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.15)",
              color: "#F87171", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Mono', monospace",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
