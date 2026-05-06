import { Navigate, Route, Routes } from "react-router-dom";
import { appRoutes } from "./routes";
import RequireAdmin from "../../features/auth/components/RequireAdmin";
import LoginPage from "../../features/auth/pages/LoginPage";
import AdminLayout from "../../features/admin/components/AdminLayout";
import AdminOverviewPage from "../../features/admin/pages/AdminOverviewPage";
import BuyersPage from "../../features/admin/pages/BuyersPage";
import InventoryPage from "../../features/admin/pages/InventoryPage";
import ProcessingPage from "../../features/admin/pages/ProcessingPage";
import SellersPage from "../../features/admin/pages/SellersPage";
import { AdminDataProvider } from "../../features/admin/context/AdminDataContext";

export default function AppRouter() {
  return (
    <Routes>
      <Route path={appRoutes.root} element={<Navigate to={appRoutes.admin} replace />} />
      <Route path={appRoutes.login} element={<LoginPage />} />
      <Route
        path={appRoutes.admin}
        element={
          <RequireAdmin>
            <AdminDataProvider>
              <AdminLayout />
            </AdminDataProvider>
          </RequireAdmin>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="sellers" element={<SellersPage />} />
        <Route path="processing" element={<ProcessingPage />} />
        <Route path="buyers" element={<BuyersPage />} />
        <Route path="inventory" element={<InventoryPage />} />
      </Route>
      <Route path="*" element={<Navigate to={appRoutes.admin} replace />} />
    </Routes>
  );
}
