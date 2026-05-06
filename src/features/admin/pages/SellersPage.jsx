import { useEffect } from "react";
import { appTheme } from "../../../app/theme";
import PageIntro from "../components/PageIntro";
import SellerSection from "../components/sections/SellerSection";
import { useAdminData } from "../context/AdminDataContext";

export default function SellersPage() {
  const { data, sellerForm, updateSellerForm, handleSellerSubmit } = useAdminData();
  const totalMaterialQty = data.sellers.reduce((total, item) => total + item.materialQty, 0);

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
          { label: "Total quantity", value: totalMaterialQty },
        ]}
      />
      <SellerSection
        form={sellerForm}
        items={data.sellers}
        onChange={updateSellerForm}
        onSubmit={handleSellerSubmit}
      />
    </>
  );
}
