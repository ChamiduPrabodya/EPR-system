import { useEffect } from "react";
import { appTheme } from "../../../app/theme";
import PageIntro from "../components/PageIntro";
import BuyerSection from "../components/sections/BuyerSection";
import { useAdminData } from "../context/AdminDataContext";

export default function BuyersPage() {
  const {
    data,
    buyerForm,
    editingBuyerId,
    inventoryOptions,
    updateBuyerForm,
    handleBuyerSubmit,
    beginBuyerEdit,
    cancelBuyerEdit,
    deleteBuyer,
    getInventoryName,
  } = useAdminData();
  const totalUnits = data.buyers.reduce((total, item) => total + item.buyerQty, 0);

  useEffect(() => {
    document.title = `${appTheme.appTitle} | Buyers`;
  }, []);

  return (
    <>
      <PageIntro
        eyebrow="Sales orders"
        title="Record customer details and outgoing product orders."
        description="Use this page to review open sales orders and add the next customer request clearly."
        tips={["Check delivery dates before saving.", "Use product names that match inventory records."]}
        stats={[
          { label: "Orders", value: data.buyers.length },
          { label: "Units ordered", value: totalUnits },
          { label: "Fulfilled", value: data.buyers.filter((item) => item.orderStatus === "Fulfilled").length },
        ]}
      />
      <BuyerSection
        form={buyerForm}
        items={data.buyers}
        editingId={editingBuyerId}
        inventoryOptions={inventoryOptions}
        onChange={updateBuyerForm}
        onSubmit={handleBuyerSubmit}
        onEdit={beginBuyerEdit}
        onDelete={deleteBuyer}
        onCancelEdit={cancelBuyerEdit}
        getInventoryName={getInventoryName}
      />
    </>
  );
}
