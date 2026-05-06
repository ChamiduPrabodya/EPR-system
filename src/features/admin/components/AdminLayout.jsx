import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout() {
  return (
    <div className="app-frame">
      <div className="app-orb app-orb-one" />
      <div className="app-orb app-orb-two" />
      <div className="app-shell">
        <AdminSidebar />
        <main className="main-content">
          <AdminTopbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
