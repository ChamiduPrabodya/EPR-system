import { useEffect } from "react";
import { Link } from "react-router-dom";
import { appRoutes } from "../../../app/router/routes";
import { appTheme } from "../../../app/theme";
import { formatDate } from "../../../common/utils/formatters";
import AlertsPanel from "../components/AlertsPanel";
import AdminSummary from "../components/AdminSummary";
import ErpEssentialsPanel from "../components/ErpEssentialsPanel";
import WorkflowHero from "../components/WorkflowHero";
import { useAdminData } from "../context/AdminDataContext";

export default function AdminOverviewPage() {
  const { data, alerts, summary } = useAdminData();
  const upcomingOrders = [...data.buyers]
    .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate))
    .slice(0, 3);
  const stockWatch = data.inventory.filter(
    (item) => item.inventoryQty <= item.inventoryLow || item.inventoryQty >= item.inventoryMax,
  );

  useEffect(() => {
    document.title = `${appTheme.appTitle} | Dashboard`;
  }, []);

  return (
    <>
      <WorkflowHero summary={summary} alertCount={alerts.length} />
      <AdminSummary
        sellerCount={data.sellers.length}
        batchCount={data.processing.length}
        buyerCount={data.buyers.length}
        alertCount={alerts.length}
      />
      <ErpEssentialsPanel summary={summary} />
      <section className="dashboard-board">
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Transactions</p>
              <h3>Upcoming customer deliveries</h3>
              <p className="panel-copy">These orders are the closest scheduled deliveries in the system.</p>
            </div>
          </div>
          <div className="dashboard-list">
            {upcomingOrders.length === 0 ? (
              <div className="empty-state">No delivery dates are saved yet.</div>
            ) : (
              upcomingOrders.map((order) => (
                <article className="dashboard-list-item" key={`${order.buyerName}-${order.deliveryDate}`}>
                  <div>
                    <strong>{order.buyerName}</strong>
                    <p>{order.buyerProduct} - {order.buyerQty} units</p>
                  </div>
                  <span>{formatDate(order.deliveryDate)}</span>
                </article>
              ))
            )}
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Inquiries</p>
              <h3>Stock items that need review</h3>
              <p className="panel-copy">Open inventory when you need to fix a low or over-capacity item.</p>
            </div>
          </div>
          <div className="dashboard-list">
            {stockWatch.length === 0 ? (
              <div className="empty-state">No stock items are outside their target levels.</div>
            ) : (
              stockWatch.map((item) => (
                <article className="dashboard-list-item" key={item.inventoryName}>
                  <div>
                    <strong>{item.inventoryName}</strong>
                    <p>
                      Current: {item.inventoryQty} - Alert: {item.inventoryLow} - Capacity: {item.inventoryMax}
                    </p>
                  </div>
                  <Link className="inline-link" to={appRoutes.adminInventory}>
                    Review
                  </Link>
                </article>
              ))
            )}
          </div>
        </article>
      </section>
      <AlertsPanel alerts={alerts} />
    </>
  );
}
