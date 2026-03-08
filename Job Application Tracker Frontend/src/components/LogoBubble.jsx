export function LogoBubble({ char, company }) {
  const hue = (company.charCodeAt(0) * 37) % 360;
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: "10px",
        flexShrink: 0,
        background: `hsl(${hue}, 35%, 22%)`,
        border: `1px solid hsl(${hue}, 35%, 32%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "15px",
        fontWeight: "700",
        color: `hsl(${hue}, 70%, 75%)`,
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {char}
    </div>
  );
}
