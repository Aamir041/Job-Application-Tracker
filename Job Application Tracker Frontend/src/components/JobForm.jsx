import { useState } from "react";
import { STATUSES } from "../data/constants";
import { inputStyle, labelStyle } from "../styles/shared";

const BLANK = {
  company: "",
  role: "",
  status: "Applied",
  salary: "",
  dateSubmitted: "",
  jobLink: "",
  rejectionReason: "",
};

export function JobForm({ initial, onSave }) {
  const [form, setForm] = useState(initial || BLANK);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (form.company && form.role) {
      onSave({ ...form, logo: form.company[0]?.toUpperCase() || "?" });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Company Name */}
      <div>
        <label style={labelStyle}>Company Name</label>
        <input
          style={inputStyle}
          value={form.company}
          onChange={(e) => set("company", e.target.value)}
          placeholder="e.g. Stripe"
        />
      </div>

      {/* Role */}
      <div>
        <label style={labelStyle}>Role</label>
        <input
          style={inputStyle}
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
          placeholder="e.g. Senior Engineer"
        />
      </div>

      {/* Status + Salary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Application Status</label>
          <select
            style={inputStyle}
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Salary</label>
          <input
            style={inputStyle}
            value={form.salary}
            onChange={(e) => set("salary", e.target.value)}
            placeholder="e.g. $120k"
          />
        </div>
      </div>

      {/* Date Submitted */}
      <div>
        <label style={labelStyle}>Date Submitted</label>
        <input
          style={inputStyle}
          type="date"
          value={form.dateSubmitted}
          onChange={(e) => set("dateSubmitted", e.target.value)}
        />
      </div>

      {/* Link to Job Req */}
      <div>
        <label style={labelStyle}>Link to Job Req</label>
        <input
          style={inputStyle}
          value={form.jobLink}
          onChange={(e) => set("jobLink", e.target.value)}
          placeholder="https://..."
        />
      </div>

      {/* Rejection Reason — only shown when Rejected */}
      {form.status === "Rejected" && (
        <div>
          <label style={labelStyle}>Rejection Reason</label>
          <textarea
            style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
            value={form.rejectionReason}
            onChange={(e) => set("rejectionReason", e.target.value)}
            placeholder="e.g. Went with internal candidate"
          />
        </div>
      )}

      <button
        onClick={handleSave}
        onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.target.style.opacity = "1")}
        style={{
          marginTop: 8,
          padding: "12px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #6B9FFF, #A78BFA)",
          border: "none",
          color: "#fff",
          fontWeight: "700",
          fontSize: "13px",
          cursor: "pointer",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.05em",
          transition: "opacity 0.2s",
        }}
      >
        {initial ? "Save Changes" : "Add Application"}
      </button>
    </div>
  );
}
