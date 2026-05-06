import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadJsonState, saveJsonState } from "../../../common/utils/storage";
import {
  defaultAdminData,
  emptyBuyerForm,
  emptyInventoryForm,
  emptyProcessForm,
  emptySellerForm,
  storageKey,
} from "../data/seed";

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const [data, setData] = useState(() => loadAdminState());
  const [sellerForm, setSellerForm] = useState(emptySellerForm);
  const [processForm, setProcessForm] = useState(emptyProcessForm);
  const [buyerForm, setBuyerForm] = useState(emptyBuyerForm);
  const [inventoryForm, setInventoryForm] = useState(emptyInventoryForm);

  useEffect(() => {
    saveJsonState(storageKey, data);
  }, [data]);

  const alerts = useMemo(() => collectAlerts(data.inventory), [data.inventory]);
  const summary = useMemo(
    () => ({
      sellers: data.sellers.length,
      processing: data.processing.length,
      buyers: data.buyers.length,
      inventory: data.inventory.length,
      alerts: alerts.length,
    }),
    [alerts.length, data.buyers.length, data.inventory.length, data.processing.length, data.sellers.length],
  );

  const value = useMemo(
    () => ({
      data,
      alerts,
      summary,
      sellerForm,
      processForm,
      buyerForm,
      inventoryForm,
      updateSellerForm(field, value) {
        setSellerForm((current) => ({ ...current, [field]: value }));
      },
      updateProcessForm(field, value) {
        setProcessForm((current) => ({ ...current, [field]: value }));
      },
      updateBuyerForm(field, value) {
        setBuyerForm((current) => ({ ...current, [field]: value }));
      },
      updateInventoryForm(field, value) {
        setInventoryForm((current) => ({ ...current, [field]: value }));
      },
      handleSellerSubmit(event) {
        event.preventDefault();

        setData((current) => ({
          ...current,
          sellers: [
            {
              sellerName: sellerForm.sellerName.trim(),
              materialName: sellerForm.materialName.trim(),
              materialQty: Number(sellerForm.materialQty),
              sellerContact: sellerForm.sellerContact.trim(),
            },
            ...current.sellers,
          ],
        }));

        setSellerForm(emptySellerForm);
      },
      handleProcessSubmit(event) {
        event.preventDefault();

        setData((current) => ({
          ...current,
          processing: [
            {
              productName: processForm.productName.trim(),
              featureType: processForm.featureType,
              featureCost: Number(processForm.featureCost),
              processStatus: processForm.processStatus,
            },
            ...current.processing,
          ],
        }));

        setProcessForm(emptyProcessForm);
      },
      handleBuyerSubmit(event) {
        event.preventDefault();

        setData((current) => ({
          ...current,
          buyers: [
            {
              buyerName: buyerForm.buyerName.trim(),
              buyerProduct: buyerForm.buyerProduct.trim(),
              buyerQty: Number(buyerForm.buyerQty),
              deliveryDate: buyerForm.deliveryDate,
            },
            ...current.buyers,
          ],
        }));

        setBuyerForm(emptyBuyerForm);
      },
      handleInventorySubmit(event) {
        event.preventDefault();

        setData((current) => ({
          ...current,
          inventory: [
            {
              inventoryName: inventoryForm.inventoryName.trim(),
              inventoryQty: Number(inventoryForm.inventoryQty),
              inventoryMax: Number(inventoryForm.inventoryMax),
              inventoryLow: Number(inventoryForm.inventoryLow),
            },
            ...current.inventory,
          ],
        }));

        setInventoryForm(emptyInventoryForm);
      },
      getInventoryStatus,
    }),
    [alerts, buyerForm, data, inventoryForm, processForm, sellerForm, summary],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const context = useContext(AdminDataContext);

  if (!context) {
    throw new Error("useAdminData must be used inside AdminDataProvider.");
  }

  return context;
}

function loadAdminState() {
  const saved = loadJsonState(storageKey, defaultAdminData);

  return {
    sellers: Array.isArray(saved.sellers) ? saved.sellers : defaultAdminData.sellers,
    processing: Array.isArray(saved.processing) ? saved.processing : defaultAdminData.processing,
    buyers: Array.isArray(saved.buyers) ? saved.buyers : defaultAdminData.buyers,
    inventory: Array.isArray(saved.inventory) ? saved.inventory : defaultAdminData.inventory,
  };
}

function collectAlerts(inventory) {
  return inventory.flatMap((item) => {
    const itemAlerts = [];

    if (item.inventoryQty <= item.inventoryLow) {
      itemAlerts.push({
        title: `${item.inventoryName} is running low`,
        message: `Current quantity is ${item.inventoryQty}, below the alert level of ${item.inventoryLow}.`,
        type: "low",
      });
    }

    if (item.inventoryQty >= item.inventoryMax) {
      itemAlerts.push({
        title: `${item.inventoryName} reached maximum capacity`,
        message: `Current quantity is ${item.inventoryQty}, matching or exceeding capacity ${item.inventoryMax}.`,
        type: "capacity",
      });
    }

    return itemAlerts;
  });
}

function getInventoryStatus(item) {
  if (item.inventoryQty >= item.inventoryMax) {
    return "Capacity Full";
  }

  if (item.inventoryQty <= item.inventoryLow) {
    return "Low Stock";
  }

  return "Healthy";
}
