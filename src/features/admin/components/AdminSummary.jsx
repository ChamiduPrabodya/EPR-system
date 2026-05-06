import StatCard from "../../../common/components/StatCard";

export default function AdminSummary({ sellerCount, batchCount, buyerCount, alertCount }) {
  return (
    <section className="stats-grid" aria-label="Summary cards">
      <StatCard accent label="Supplier records" value={sellerCount} note="Saved vendor entries" />
      <StatCard label="Operations jobs" value={batchCount} note="Tracked internal work" />
      <StatCard label="Sales orders" value={buyerCount} note="Outgoing customer requests" />
      <StatCard warn label="Stock alerts" value={alertCount} note="Inventory needs attention" />
    </section>
  );
}
