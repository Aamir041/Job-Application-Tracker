import { STATUS_CONFIG } from "../data/constants";

export function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG["Applied"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: c.bg,
        color: c.color,
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "0.05em",
        border: `1px solid ${c.color}22`,
        textTransform: "uppercase",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}
