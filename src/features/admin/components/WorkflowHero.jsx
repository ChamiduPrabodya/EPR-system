import { Link } from "react-router-dom";
import { appRoutes } from "../../../app/router/routes";

export default function WorkflowHero({ summary, alertCount }) {
  return (
    <section className="hero-panel portal-hero" id="dashboard">
      <div className="portal-hero-head">
        <div>
          <p className="eyebrow">Workspace</p>
          <h2>Inventory</h2>
          <p className="hero-copy">
            Launch common inventory and fulfillment tasks, then move into the module you need.
          </p>
        </div>
        <div className="portal-hero-status">
          <strong>{alertCount > 0 ? `${alertCount} stock alerts require attention` : "No inventory alerts are open"}</strong>
          <span>Suppliers {summary.sellers} | Jobs {summary.processing} | Orders {summary.buyers}</span>
        </div>
      </div>

      <div className="portal-action-row">
        <Link className="portal-action-tile" to={appRoutes.adminInventory}>
          <strong>New Stock Item</strong>
          <span>Add quantity, max, and alert levels</span>
        </Link>
        <Link className="portal-action-tile" to={appRoutes.adminProcessing}>
          <strong>New Process Job</strong>
          <span>Create internal work or service step</span>
        </Link>
        <Link className="portal-action-tile" to={appRoutes.adminBuyers}>
          <strong>New Sales Order</strong>
          <span>Capture customer quantity and date</span>
        </Link>
        <Link className="portal-action-tile" to={appRoutes.adminSellers}>
          <strong>New Supplier Intake</strong>
          <span>Log materials from vendors</span>
        </Link>
      </div>
    </section>
  );
}
