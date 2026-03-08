import { glassStyle } from "../styles/shared";

export function StatCard({ label, value, accent }) {
  return (
    <div style={{ ...glassStyle, borderRadius: "14px", padding: "20px 24px", minWidth: 120 }}>
      <div
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: accent,
          fontFamily: "'Playfair Display', serif",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "#7A7570",
          marginTop: 6,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {label}
      </div>
    </div>
  );
}
