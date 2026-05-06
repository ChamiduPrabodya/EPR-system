import { useLocation } from "react-router-dom";
import { appTheme } from "../../../app/theme";
import { useAuth } from "../../auth/context/AuthContext";
import { useAdminData } from "../context/AdminDataContext";

export default function AdminTopbar() {
  const location = useLocation();
  const { user } = useAuth();
  const { summary, alerts } = useAdminData();
  const pageMeta = appTheme.pageMeta[location.pathname] || appTheme.pageMeta["/admin"];
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const totalRecords = summary.sellers + summary.processing + summary.buyers + summary.inventory;

  return (
    <header className="admin-topbar">
      <div className="erp-header-bar">
        <div className="erp-header-left">
          <span className="erp-app-pill">{appTheme.appName}</span>
          <label className="erp-search">
            <span>Search</span>
            <input type="text" placeholder="Search screens, items, or records" />
          </label>
        </div>

        <div className="erp-header-right">
          <div className="erp-header-meta">
            <strong>Revision Two Products</strong>
            <span>{formattedDate}</span>
          </div>
          <div className="erp-header-actions" aria-hidden="true">
            <span>?</span>
            <span>+</span>
            <span>{user.name.slice(0, 1).toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="erp-page-bar">
        <div className="topbar-main">
          <p className="eyebrow">{pageMeta.eyebrow}</p>
          <h2>{pageMeta.title}</h2>
        </div>

        <div className="topbar-side">
          <div className="topbar-chips">
            <span className="user-chip">Alerts: {alerts.length}</span>
            <span className="user-chip">Records: {totalRecords}</span>
          </div>
          <span className="topbar-kicker">{pageMeta.description}</span>
        </div>
      </div>
    </header>
  );
}
