import { useEffect } from "react";
import { appTheme } from "../../../app/theme";
import AlertsPanel from "../components/AlertsPanel";
import PageIntro from "../components/PageIntro";
import InventorySection from "../components/sections/InventorySection";
import { useAdminData } from "../context/AdminDataContext";

export default function InventoryPage() {
  const {
    data,
    alerts,
    inventoryForm,
    updateInventoryForm,
    handleInventorySubmit,
    getInventoryStatus,
  } = useAdminData();
  const healthyItems = data.inventory.filter((item) => getInventoryStatus(item) === "Healthy").length;

  useEffect(() => {
    document.title = `${appTheme.appTitle} | Inventory`;
  }, []);

  return (
    <>
      <PageIntro
        eyebrow="Inventory control"
        title="Track stock levels, capacity, and low quantity alerts."
        description="Use this page to review current stock first and then update or add the next inventory line."
        tips={["Set realistic alert levels.", "Update quantity after every sale, receipt, or restock."]}
        stats={[
          { label: "Items", value: data.inventory.length },
          { label: "Healthy", value: healthyItems },
        ]}
      />
      <InventorySection
        form={inventoryForm}
        items={data.inventory}
        onChange={updateInventoryForm}
        onSubmit={handleInventorySubmit}
        getInventoryStatus={getInventoryStatus}
      />
      <AlertsPanel alerts={alerts} />
    </>
  );
}
