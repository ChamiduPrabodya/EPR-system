import { useEffect } from "react";
import { appTheme } from "../../../app/theme";
import PageIntro from "../components/PageIntro";
import SellerSection from "../components/sections/SellerSection";
import { useAdminData } from "../context/AdminDataContext";

export default function SellersPage() {
  const {
    data,
    sellerForm,
    editingSellerId,
    updateSellerForm,
    handleSellerSubmit,
    beginSellerEdit,
    cancelSellerEdit,
    deleteSeller,
    getSellerAvailableQty,
  } = useAdminData();
  const totalMaterialQty = data.sellers.reduce((total, item) => total + item.materialQty, 0);
  const totalAvailableQty = data.sellers.reduce((total, item) => total + getSellerAvailableQty(item.id), 0);

  useEffect(() => {
    document.title = `${appTheme.appTitle} | Sellers`;
  }, []);

  return (
    <>
      <PageIntro
        eyebrow="Procurement"
        title="Manage supplier details and raw material intake."
        description="Review existing supplier records first, then add the next delivery on the right."
        tips={["Keep supplier names consistent.", "Save contact details your team will actually use."]}
        stats={[
          { label: "Suppliers", value: data.sellers.length },
          { label: "Received", value: totalMaterialQty },
          { label: "Available", value: totalAvailableQty },
        ]}
      />
      <SellerSection
        form={sellerForm}
        items={data.sellers}
        editingId={editingSellerId}
        onChange={updateSellerForm}
        onSubmit={handleSellerSubmit}
        onEdit={beginSellerEdit}
        onDelete={deleteSeller}
        onCancelEdit={cancelSellerEdit}
        getSellerAvailableQty={getSellerAvailableQty}
      />
    </>
  );
}
