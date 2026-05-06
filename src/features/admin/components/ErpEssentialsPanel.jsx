import { Link } from "react-router-dom";
import { appRoutes } from "../../../app/router/routes";

function getModuleState(count, hasAlert = false) {
  if (hasAlert) {
    return {
      label: "Needs attention",
      tone: "warn",
    };
  }

  if (count > 0) {
    return {
      label: "In use",
      tone: "good",
    };
  }

  return {
    label: "Set up first",
    tone: "neutral",
  };
}

export default function ErpEssentialsPanel({ summary }) {
  const groups = [
    {
      title: "Transactions",
      items: [
        { label: "Supplier Receipts", note: `${summary.sellers} supplier records`, to: appRoutes.adminSellers },
        { label: "Operations Jobs", note: `${summary.processing} active jobs`, to: appRoutes.adminProcessing },
        { label: "Sales Orders", note: `${summary.buyers} customer orders`, to: appRoutes.adminBuyers },
      ],
    },
    {
      title: "Planning",
      items: [
        { label: "Inventory Summary", note: `${summary.inventory} stock items`, to: appRoutes.adminInventory },
        { label: "Stock Alerts", note: `${summary.alerts} warning items`, to: appRoutes.adminInventory },
        { label: "Delivery Calendar", note: `${summary.buyers} dated orders`, to: appRoutes.adminBuyers },
      ],
    },
    {
      title: "Inquiries",
      items: [
        { label: "Supplier Contacts", note: "Vendor phone details", to: appRoutes.adminSellers },
        { label: "Processing Status", note: "Queued, live, completed", to: appRoutes.adminProcessing },
        { label: "Inventory Review", note: "Capacity and low stock", to: appRoutes.adminInventory },
      ],
    },
    {
      title: "Preferences",
      items: [
        { label: "Item Thresholds", note: "Low stock alert setup", to: appRoutes.adminInventory },
        { label: "Order Tracking", note: "Customer delivery dates", to: appRoutes.adminBuyers },
        { label: "Service Costs", note: "Operations cost entries", to: appRoutes.adminProcessing },
      ],
    },
  ];
  const inventoryState = getModuleState(summary.inventory, summary.alerts > 0);

  return (
    <section className="essentials-panel">
      <div className="panel-head portal-directory-head">
        <div>
          <p className="eyebrow">Module directory</p>
          <h3>Inventory workspace menu</h3>
          <p className="panel-copy">Use the launcher below to jump into the task or inquiry you need.</p>
        </div>
        <span className={`essential-state essential-state-${inventoryState.tone}`}>{inventoryState.label}</span>
      </div>

      <div className="portal-directory-grid">
        {groups.map((group) => (
          <article className="portal-directory-column" key={group.title}>
            <h4>{group.title}</h4>
            <div className="portal-directory-links">
              {group.items.map((item) => (
                <Link className="portal-directory-link" key={item.label} to={item.to}>
                  <strong>{item.label}</strong>
                  <span>{item.note}</span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
