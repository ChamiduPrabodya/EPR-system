import { Link, NavLink } from "react-router-dom";
import { appRoutes } from "../../../app/router/routes";
import { appTheme } from "../../../app/theme";
import { useAdminData } from "../context/AdminDataContext";

export default function AdminSidebar() {
  const { summary } = useAdminData();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-lockup">
          <span className="brand-mark">A</span>
          <div className="brand-copy">
            <p className="eyebrow">ERP Platform</p>
            <h1>{appTheme.appName}</h1>
          </div>
        </div>
        <p className="sidebar-copy">
          Core business modules for purchasing, operations, sales, and inventory.
        </p>
      </div>

      <nav className="nav-list">
        {appTheme.sidebarLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            end={link.to === appRoutes.admin}
          >
            <span className="nav-link-icon">{link.shortLabel}</span>
            <span className="nav-link-copy">
              <strong>{link.label}</strong>
              <small>{link.description}</small>
            </span>
            <span className="nav-link-badge">{summary[link.summaryKey]}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-lock">
          <span className="status-dot"></span>
          Live company workspace
        </div>
        <Link className="home-link" to={appRoutes.login}>
          Security and roles
        </Link>
      </div>
    </aside>
  );
}
