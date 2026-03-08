import { PRIORITY_COLORS } from "../data/constants";

export function PriorityDot({ priority }) {
  const color = PRIORITY_COLORS[priority] || "#999";
  return (
    <span
      title={priority}
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 6px ${color}88`,
      }}
    />
  );
}
