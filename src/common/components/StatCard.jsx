export default function StatCard({ label, value, note, accent = false, warn = false }) {
  const className = ["stat-card", accent ? "accent-card" : "", warn ? "warn-card" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={className}>
      <div className="stat-card-head">
        <p>{label}</p>
        <span className="stat-card-pulse" aria-hidden="true"></span>
      </div>
      <h3>{value}</h3>
      <span>{note}</span>
    </article>
  );
}
