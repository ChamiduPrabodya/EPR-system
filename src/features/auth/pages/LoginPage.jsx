import { useEffect } from "react";
import { Link } from "react-router-dom";
import { appTheme } from "../../../app/theme";
import { appRoutes } from "../../../app/router/routes";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = `${appTheme.appTitle} | Login`;
  }, []);

  return (
    <main className="page-shell">
      <section className="auth-card">
        <p className="eyebrow">Admin access</p>
        <h1>Open the ERP workspace in admin mode.</h1>
        <p>
          This workspace opens directly into the redesigned ERP view so you can test the whole flow
          quickly. The next product step can add proper login, permissions, and user roles.
        </p>
        <div className="auth-details">
          <span className="user-chip">Current role: {user.role}</span>
          <span className="user-chip">Current user: {user.name}</span>
        </div>
        <div className="placeholder-actions">
          <Link className="primary-link" to={appRoutes.admin}>
            Open admin dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
