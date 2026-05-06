import { useEffect } from "react";
import { appTheme } from "../../../app/theme";
import { formatCurrency } from "../../../common/utils/formatters";
import AlertsPanel from "../components/AlertsPanel";
import PageIntro from "../components/PageIntro";
import InventorySection from "../components/sections/InventorySection";
import { useAdminData } from "../context/AdminDataContext";

export default function InventoryPage() {
  const {
    data,
    alerts,
    inventoryForm,
    editingInventoryId,
    updateInventoryForm,
    handleInventorySubmit,
    beginInventoryEdit,
    cancelInventoryEdit,
    deleteInventory,
    getInventoryStatus,
    getInventoryCurrentQty,
    getInventoryProducedQty,
    getInventorySoldQty,
    getInventoryCurrentUnitCost,
    getInventoryCurrentStockValue,
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
          {
            label: "Current stock",
            value: data.inventory.reduce((total, item) => total + getInventoryCurrentQty(item), 0),
          },
          {
            label: "Stock value",
            value: formatCurrency(
              data.inventory.reduce((total, item) => total + getInventoryCurrentStockValue(item), 0),
            ),
          },
        ]}
      />
      <InventorySection
        form={inventoryForm}
        items={data.inventory}
        editingId={editingInventoryId}
        onChange={updateInventoryForm}
        onSubmit={handleInventorySubmit}
        onEdit={beginInventoryEdit}
        onDelete={deleteInventory}
        onCancelEdit={cancelInventoryEdit}
        getInventoryStatus={getInventoryStatus}
        getInventoryCurrentQty={getInventoryCurrentQty}
        getInventoryProducedQty={getInventoryProducedQty}
        getInventorySoldQty={getInventorySoldQty}
        getInventoryCurrentUnitCost={getInventoryCurrentUnitCost}
        getInventoryCurrentStockValue={getInventoryCurrentStockValue}
      />
      <AlertsPanel alerts={alerts} />
    </>
  );
}
