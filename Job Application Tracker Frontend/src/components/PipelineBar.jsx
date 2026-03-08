import { STATUSES, STATUS_CONFIG } from "../data/constants";
import { glassStyle } from "../styles/shared";

export function PipelineBar({ jobs }) {
  const counts = STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: jobs.filter((j) => j.status === s).length }),
    {}
  );

  return (
    <div
      style={{
        ...glassStyle,
        borderRadius: "16px",
        padding: "20px 24px",
        marginBottom: 28,
        display: "flex",
        gap: 4,
        alignItems: "stretch",
      }}
    >
      {STATUSES.map((s) => {
        const count = counts[s] || 0;
        const pct = jobs.length ? count / jobs.length : 0;
        const c = STATUS_CONFIG[s];
        return (
          <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "10px",
                  color: c.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {s}
              </span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#E8E4DC" }}>
                {count}
              </span>
            </div>
            <div
              style={{
                height: 4,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct * 100}%`,
                  background: c.color,
                  borderRadius: 4,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
