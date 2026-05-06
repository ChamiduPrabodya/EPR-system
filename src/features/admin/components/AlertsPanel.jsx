import StatusTag from "../../../common/components/StatusTag";

export default function AlertsPanel({ alerts }) {
  return (
    <section className="alerts-panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Attention area</p>
          <h3>Inventory warnings</h3>
          <p className="panel-copy">These items need action first so stock problems do not affect sales.</p>
        </div>
      </div>

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="empty-state">No inventory warnings right now.</div>
        ) : (
          alerts.map((alert) => (
            <article className="alert-item" key={`${alert.type}-${alert.title}`}>
              <div>
                <strong>{alert.title}</strong>
                <p>{alert.message}</p>
              </div>
              <StatusTag label={alert.type === "capacity" ? "Capacity" : "Low Stock"} tone={alert.type === "capacity" ? "warn" : "neutral"} />
            </article>
          ))
        )}
      </div>
    </section>
  );
}
