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
  const [editingSellerId, setEditingSellerId] = useState(null);
  const [editingProcessId, setEditingProcessId] = useState(null);
  const [editingBuyerId, setEditingBuyerId] = useState(null);
  const [editingInventoryId, setEditingInventoryId] = useState(null);

  useEffect(() => {
    saveJsonState(storageKey, data);
  }, [data]);

  const supplierAvailability = useMemo(() => buildSupplierAvailability(data), [data]);
  const processCostMetrics = useMemo(() => buildProcessCostMetrics(data), [data]);
  const inventoryMetrics = useMemo(
    () => buildInventoryMetrics(data, processCostMetrics),
    [data, processCostMetrics],
  );
  const alerts = useMemo(() => collectAlerts(data.inventory, inventoryMetrics), [data.inventory, inventoryMetrics]);
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

  const sellerOptions = useMemo(
    () =>
      data.sellers.map((seller) => ({
        id: seller.id,
        label: `${seller.sellerName} - ${seller.materialName}`,
      })),
    [data.sellers],
  );

  const inventoryOptions = useMemo(
    () =>
      data.inventory.map((item) => ({
        id: item.id,
        label: item.inventoryName,
      })),
    [data.inventory],
  );

  const actualCostRows = useMemo(
    () =>
      data.inventory.map((item) => {
        const metric = inventoryMetrics[item.id];
        return {
          inventoryId: item.id,
          inventoryName: item.inventoryName,
          rawMaterialUnitCost: metric.latestRawUnitCost,
          packingCostPerUnit: item.packingCostPerUnit,
          processCostPerUnit: metric.latestProcessCostPerUnit,
          actualCostPerUnit: metric.latestActualUnitCost,
          sellingPricePerUnit: item.sellingPricePerUnit,
          actualMarginPerUnit: item.sellingPricePerUnit - metric.latestActualUnitCost,
        };
      }),
    [data.inventory, inventoryMetrics],
  );

  const currentCostRows = useMemo(
    () =>
      data.inventory.map((item) => {
        const metric = inventoryMetrics[item.id];
        return {
          inventoryId: item.id,
          inventoryName: item.inventoryName,
          openingQty: item.inventoryQty,
          currentQty: metric.currentQty,
          currentCostPerUnit: metric.currentUnitCost,
          currentStockValue: metric.currentStockValue,
          sellingPricePerUnit: item.sellingPricePerUnit,
          currentMarginPerUnit: item.sellingPricePerUnit - metric.currentUnitCost,
        };
      }),
    [data.inventory, inventoryMetrics],
  );

  const value = useMemo(
    () => ({
      data,
      alerts,
      summary,
      sellerOptions,
      inventoryOptions,
      actualCostRows,
      currentCostRows,
      sellerForm,
      processForm,
      buyerForm,
      inventoryForm,
      editingSellerId,
      editingProcessId,
      editingBuyerId,
      editingInventoryId,
      updateSellerForm(field, value) {
        setSellerForm((current) => ({ ...current, [field]: value }));
      },
      updateProcessForm(field, value) {
        setProcessForm((current) => ({ ...current, [field]: value }));
      },
      updateBuyerForm(field, value) {
        setBuyerForm((current) => {
          if (field === "inventoryItemId") {
            const inventoryItem = data.inventory.find((item) => item.id === value);
            return {
              ...current,
              inventoryItemId: value,
              saleUnitPrice: inventoryItem ? String(inventoryItem.sellingPricePerUnit) : "",
            };
          }

          return { ...current, [field]: value };
        });
      },
      updateInventoryForm(field, value) {
        setInventoryForm((current) => ({ ...current, [field]: value }));
      },
      handleSellerSubmit(event) {
        event.preventDefault();

        const record = {
          id: editingSellerId || createId("seller"),
          sellerName: sellerForm.sellerName.trim(),
          materialName: sellerForm.materialName.trim(),
          materialQty: Number(sellerForm.materialQty),
          materialUnitCost: Number(sellerForm.materialUnitCost),
          sellerContact: sellerForm.sellerContact.trim(),
        };

        const nextData = upsertRecord(data, "sellers", record, editingSellerId);
        const nextAvailability = buildSupplierAvailability(nextData);

        if (nextAvailability[record.id] < 0) {
          window.alert("This update would make supplier material availability go below zero.");
          return;
        }

        setData(nextData);
        setSellerForm(emptySellerForm);
        setEditingSellerId(null);
      },
      handleProcessSubmit(event) {
        event.preventDefault();

        const sourceSeller = data.sellers.find((seller) => seller.id === processForm.sourceSellerId);
        const inventoryItem = data.inventory.find((item) => item.id === processForm.inventoryItemId);

        if (!sourceSeller || !inventoryItem) {
          window.alert("Choose both a supplier receipt and an inventory item before saving the job.");
          return;
        }

        const record = {
          id: editingProcessId || createId("process"),
          sourceSellerId: sourceSeller.id,
          inventoryItemId: inventoryItem.id,
          productName: inventoryItem.inventoryName,
          featureType: processForm.featureType,
          featureCost: Number(processForm.featureCost),
          inputQty: Number(processForm.inputQty),
          outputQty: Number(processForm.outputQty),
          processStatus: processForm.processStatus,
        };

        const nextData = upsertRecord(data, "processing", record, editingProcessId);
        const nextAvailability = buildSupplierAvailability(nextData);

        if (nextAvailability[sourceSeller.id] < 0) {
          window.alert("This job uses more raw material than the selected supplier receipt has available.");
          return;
        }

        setData(nextData);
        setProcessForm(emptyProcessForm);
        setEditingProcessId(null);
      },
      handleBuyerSubmit(event) {
        event.preventDefault();

        const inventoryItem = data.inventory.find((item) => item.id === buyerForm.inventoryItemId);

        if (!inventoryItem) {
          window.alert("Choose an inventory item before saving the sales order.");
          return;
        }

        const currentCostSnapshot =
          inventoryMetrics[inventoryItem.id]?.currentUnitCost ?? (Number(inventoryItem.openingUnitCost) || 0);

        const record = {
          id: editingBuyerId || createId("buyer"),
          buyerName: buyerForm.buyerName.trim(),
          inventoryItemId: inventoryItem.id,
          buyerProduct: inventoryItem.inventoryName,
          buyerQty: Number(buyerForm.buyerQty),
          deliveryDate: buyerForm.deliveryDate,
          orderStatus: buyerForm.orderStatus,
          saleUnitPrice: Number(buyerForm.saleUnitPrice || inventoryItem.sellingPricePerUnit),
          costUnitPrice: currentCostSnapshot,
        };

        const nextData = upsertRecord(data, "buyers", record, editingBuyerId);
        const nextInventoryMetrics = buildInventoryMetrics(nextData, buildProcessCostMetrics(nextData));
        const inventoryMetric = nextInventoryMetrics[inventoryItem.id];

        if (inventoryMetric && inventoryMetric.currentQty < 0) {
          window.alert("This order would make stock go below zero. Add stock first or change the order status.");
          return;
        }

        setData(nextData);
        setBuyerForm(emptyBuyerForm);
        setEditingBuyerId(null);
      },
      handleInventorySubmit(event) {
        event.preventDefault();

        const record = {
          id: editingInventoryId || createId("inventory"),
          inventoryName: inventoryForm.inventoryName.trim(),
          inventoryQty: Number(inventoryForm.inventoryQty),
          openingUnitCost: Number(inventoryForm.openingUnitCost),
          packingCostPerUnit: Number(inventoryForm.packingCostPerUnit),
          sellingPricePerUnit: Number(inventoryForm.sellingPricePerUnit),
          inventoryMax: Number(inventoryForm.inventoryMax),
          inventoryLow: Number(inventoryForm.inventoryLow),
        };

        const nextData = upsertRecord(data, "inventory", record, editingInventoryId);
        const nextInventoryMetrics = buildInventoryMetrics(nextData, buildProcessCostMetrics(nextData));
        const inventoryMetric = nextInventoryMetrics[record.id];

        if (inventoryMetric && inventoryMetric.currentQty < 0) {
          window.alert("This change would make current stock go below zero because fulfilled sales already consume more stock.");
          return;
        }

        setData(nextData);
        setInventoryForm(emptyInventoryForm);
        setEditingInventoryId(null);
      },
      beginSellerEdit(id) {
        const seller = data.sellers.find((item) => item.id === id);

        if (!seller) {
          return;
        }

        setSellerForm({
          sellerName: seller.sellerName,
          materialName: seller.materialName,
          materialQty: String(seller.materialQty),
          materialUnitCost: String(seller.materialUnitCost),
          sellerContact: seller.sellerContact,
        });
        setEditingSellerId(id);
      },
      beginProcessEdit(id) {
        const item = data.processing.find((record) => record.id === id);

        if (!item) {
          return;
        }

        setProcessForm({
          sourceSellerId: item.sourceSellerId,
          inventoryItemId: item.inventoryItemId,
          featureType: item.featureType,
          featureCost: String(item.featureCost),
          inputQty: String(item.inputQty),
          outputQty: String(item.outputQty),
          processStatus: item.processStatus,
        });
        setEditingProcessId(id);
      },
      beginBuyerEdit(id) {
        const buyer = data.buyers.find((record) => record.id === id);

        if (!buyer) {
          return;
        }

        setBuyerForm({
          buyerName: buyer.buyerName,
          inventoryItemId: buyer.inventoryItemId,
          buyerQty: String(buyer.buyerQty),
          deliveryDate: buyer.deliveryDate,
          orderStatus: buyer.orderStatus,
          saleUnitPrice: String(buyer.saleUnitPrice),
        });
        setEditingBuyerId(id);
      },
      beginInventoryEdit(id) {
        const item = data.inventory.find((record) => record.id === id);

        if (!item) {
          return;
        }

        setInventoryForm({
          inventoryName: item.inventoryName,
          inventoryQty: String(item.inventoryQty),
          openingUnitCost: String(item.openingUnitCost),
          packingCostPerUnit: String(item.packingCostPerUnit),
          sellingPricePerUnit: String(item.sellingPricePerUnit),
          inventoryMax: String(item.inventoryMax),
          inventoryLow: String(item.inventoryLow),
        });
        setEditingInventoryId(id);
      },
      cancelSellerEdit() {
        setSellerForm(emptySellerForm);
        setEditingSellerId(null);
      },
      cancelProcessEdit() {
        setProcessForm(emptyProcessForm);
        setEditingProcessId(null);
      },
      cancelBuyerEdit() {
        setBuyerForm(emptyBuyerForm);
        setEditingBuyerId(null);
      },
      cancelInventoryEdit() {
        setInventoryForm(emptyInventoryForm);
        setEditingInventoryId(null);
      },
      deleteSeller(id) {
        const hasLinkedJobs = data.processing.some((item) => item.sourceSellerId === id);

        if (hasLinkedJobs) {
          window.alert("This supplier receipt is linked to operations jobs and cannot be deleted.");
          return;
        }

        if (!window.confirm("Delete this supplier receipt?")) {
          return;
        }

        setData((current) => ({
          ...current,
          sellers: current.sellers.filter((item) => item.id !== id),
        }));

        if (editingSellerId === id) {
          setSellerForm(emptySellerForm);
          setEditingSellerId(null);
        }
      },
      deleteProcess(id) {
        if (!window.confirm("Delete this operations job?")) {
          return;
        }

        setData((current) => ({
          ...current,
          processing: current.processing.filter((item) => item.id !== id),
        }));

        if (editingProcessId === id) {
          setProcessForm(emptyProcessForm);
          setEditingProcessId(null);
        }
      },
      deleteBuyer(id) {
        if (!window.confirm("Delete this sales order?")) {
          return;
        }

        setData((current) => ({
          ...current,
          buyers: current.buyers.filter((item) => item.id !== id),
        }));

        if (editingBuyerId === id) {
          setBuyerForm(emptyBuyerForm);
          setEditingBuyerId(null);
        }
      },
      deleteInventory(id) {
        const linkedProcess = data.processing.some((item) => item.inventoryItemId === id);
        const linkedBuyer = data.buyers.some((item) => item.inventoryItemId === id);

        if (linkedProcess || linkedBuyer) {
          window.alert("This inventory item is linked to operations or sales records and cannot be deleted.");
          return;
        }

        if (!window.confirm("Delete this inventory item?")) {
          return;
        }

        setData((current) => ({
          ...current,
          inventory: current.inventory.filter((item) => item.id !== id),
        }));

        if (editingInventoryId === id) {
          setInventoryForm(emptyInventoryForm);
          setEditingInventoryId(null);
        }
      },
      getInventoryStatus(itemOrId) {
        const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
        return inventoryMetrics[id]?.status || "Healthy";
      },
      getInventoryCurrentQty(itemOrId) {
        const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
        return inventoryMetrics[id]?.currentQty ?? 0;
      },
      getInventoryProducedQty(itemOrId) {
        const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
        return inventoryMetrics[id]?.producedQty ?? 0;
      },
      getInventorySoldQty(itemOrId) {
        const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
        return inventoryMetrics[id]?.soldQty ?? 0;
      },
      getInventoryCurrentUnitCost(itemOrId) {
        const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
        return inventoryMetrics[id]?.currentUnitCost ?? 0;
      },
      getInventoryCurrentStockValue(itemOrId) {
        const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
        return inventoryMetrics[id]?.currentStockValue ?? 0;
      },
      getInventoryLatestActualUnitCost(itemOrId) {
        const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
        return inventoryMetrics[id]?.latestActualUnitCost ?? 0;
      },
      getInventoryActualMarginPerUnit(itemOrId) {
        const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
        return actualCostRows.find((row) => row.inventoryId === id)?.actualMarginPerUnit ?? 0;
      },
      getInventoryCurrentMarginPerUnit(itemOrId) {
        const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
        return currentCostRows.find((row) => row.inventoryId === id)?.currentMarginPerUnit ?? 0;
      },
      getInventoryPackingCost(itemOrId) {
        const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
        return data.inventory.find((item) => item.id === id)?.packingCostPerUnit ?? 0;
      },
      getInventorySellingPrice(itemOrId) {
        const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
        return data.inventory.find((item) => item.id === id)?.sellingPricePerUnit ?? 0;
      },
      getSellerAvailableQty(id) {
        return supplierAvailability[id] ?? 0;
      },
      getSellerName(id) {
        return data.sellers.find((item) => item.id === id)?.sellerName || "-";
      },
      getSellerMaterialLabel(id) {
        const seller = data.sellers.find((item) => item.id === id);
        return seller ? `${seller.sellerName} - ${seller.materialName}` : "-";
      },
      getSellerUnitCost(id) {
        return data.sellers.find((item) => item.id === id)?.materialUnitCost ?? 0;
      },
      getInventoryName(id) {
        return data.inventory.find((item) => item.id === id)?.inventoryName || "-";
      },
    }),
    [
      actualCostRows,
      alerts,
      buyerForm,
      currentCostRows,
      data,
      editingBuyerId,
      editingInventoryId,
      editingProcessId,
      editingSellerId,
      inventoryForm,
      inventoryMetrics,
      inventoryOptions,
      processForm,
      sellerForm,
      sellerOptions,
      summary,
      supplierAvailability,
    ],
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
  const sellers = normalizeSellers(saved.sellers);
  const inventory = normalizeInventory(saved.inventory);
  const processing = normalizeProcessing(saved.processing, sellers, inventory);
  const buyers = normalizeBuyers(saved.buyers, inventory);

  return { sellers, processing, buyers, inventory };
}

function normalizeSellers(records) {
  const source = Array.isArray(records) ? records : defaultAdminData.sellers;

  return source.map((item, index) => ({
    id: item.id || `seller-${index + 1}-${Math.random().toString(36).slice(2, 8)}`,
    sellerName: item.sellerName || "",
    materialName: item.materialName || "",
    materialQty: Number(item.materialQty) || 0,
    materialUnitCost: Number(item.materialUnitCost) || 0,
    sellerContact: item.sellerContact || "",
  }));
}

function normalizeInventory(records) {
  const source = Array.isArray(records) ? records : defaultAdminData.inventory;

  return source.map((item, index) => ({
    id: item.id || `inventory-${index + 1}-${Math.random().toString(36).slice(2, 8)}`,
    inventoryName: item.inventoryName || "",
    inventoryQty: Number(item.inventoryQty) || 0,
    openingUnitCost: Number(item.openingUnitCost) || 0,
    packingCostPerUnit: Number(item.packingCostPerUnit) || 0,
    sellingPricePerUnit: Number(item.sellingPricePerUnit) || 0,
    inventoryMax: Number(item.inventoryMax) || 0,
    inventoryLow: Number(item.inventoryLow) || 0,
  }));
}

function normalizeProcessing(records, sellers, inventory) {
  const source = Array.isArray(records) ? records : defaultAdminData.processing;
  const fallbackSellerId = sellers[0]?.id || "";
  const fallbackInventoryId = inventory[0]?.id || "";

  return source.map((item, index) => {
    const matchedInventory = inventory.find((record) => record.inventoryName === item.productName);

    return {
      id: item.id || `process-${index + 1}-${Math.random().toString(36).slice(2, 8)}`,
      sourceSellerId: item.sourceSellerId || fallbackSellerId,
      inventoryItemId: item.inventoryItemId || matchedInventory?.id || fallbackInventoryId,
      productName:
        item.productName ||
        inventory.find((record) => record.id === item.inventoryItemId)?.inventoryName ||
        "",
      featureType: item.featureType || "Packing",
      featureCost: Number(item.featureCost) || 0,
      inputQty: Number(item.inputQty) || Math.max(1, Number(item.materialQty) || 1),
      outputQty: Number(item.outputQty) || 0,
      processStatus: item.processStatus || "Queued",
    };
  });
}

function normalizeBuyers(records, inventory) {
  const source = Array.isArray(records) ? records : defaultAdminData.buyers;
  const fallbackInventoryId = inventory[0]?.id || "";

  return source.map((item, index) => {
    const matchedInventory = inventory.find((record) => record.inventoryName === item.buyerProduct);
    const inventoryItem = inventory.find((record) => record.id === item.inventoryItemId) || matchedInventory;

    return {
      id: item.id || `buyer-${index + 1}-${Math.random().toString(36).slice(2, 8)}`,
      buyerName: item.buyerName || "",
      inventoryItemId: item.inventoryItemId || matchedInventory?.id || fallbackInventoryId,
      buyerProduct:
        item.buyerProduct ||
        inventory.find((record) => record.id === item.inventoryItemId)?.inventoryName ||
        "",
      buyerQty: Number(item.buyerQty) || 0,
      deliveryDate: item.deliveryDate || "",
      orderStatus: item.orderStatus || "Pending",
      saleUnitPrice: Number(item.saleUnitPrice) || Number(inventoryItem?.sellingPricePerUnit) || 0,
      costUnitPrice: Number(item.costUnitPrice) || 0,
    };
  });
}

function buildSupplierAvailability(data) {
  const availability = Object.fromEntries(
    data.sellers.map((seller) => [seller.id, Number(seller.materialQty) || 0]),
  );

  data.processing.forEach((item) => {
    if (item.processStatus === "Cancelled") {
      return;
    }

    availability[item.sourceSellerId] = (availability[item.sourceSellerId] || 0) - (Number(item.inputQty) || 0);
  });

  return availability;
}

function buildProcessCostMetrics(data) {
  return Object.fromEntries(
    data.processing.map((item) => {
      const seller = data.sellers.find((record) => record.id === item.sourceSellerId);
      const inventoryItem = data.inventory.find((record) => record.id === item.inventoryItemId);
      const rawMaterialUnitCost = Number(seller?.materialUnitCost) || 0;
      const packingCostPerUnit = Number(inventoryItem?.packingCostPerUnit) || 0;
      const rawMaterialTotalCost = rawMaterialUnitCost * (Number(item.inputQty) || 0);
      const packingTotalCost = packingCostPerUnit * (Number(item.outputQty) || 0);
      const processExtraCost = Number(item.featureCost) || 0;
      const actualTotalCost = rawMaterialTotalCost + packingTotalCost + processExtraCost;
      const actualUnitCost = Number(item.outputQty) > 0 ? actualTotalCost / Number(item.outputQty) : 0;
      const processCostPerUnit = Number(item.outputQty) > 0 ? processExtraCost / Number(item.outputQty) : 0;

      return [
        item.id,
        {
          rawMaterialUnitCost,
          packingCostPerUnit,
          rawMaterialTotalCost,
          packingTotalCost,
          processExtraCost,
          actualTotalCost,
          actualUnitCost,
          processCostPerUnit,
        },
      ];
    }),
  );
}

function buildInventoryMetrics(data, processCostMetrics) {
  return Object.fromEntries(
    data.inventory.map((item) => {
      const completedProcesses = data.processing.filter(
        (record) => record.inventoryItemId === item.id && record.processStatus === "Completed",
      );
      const fulfilledSales = data.buyers.filter(
        (record) => record.inventoryItemId === item.id && record.orderStatus === "Fulfilled",
      );
      const openingQty = Number(item.inventoryQty) || 0;
      const openingUnitCost = Number(item.openingUnitCost) || 0;
      const openingValue = openingQty * openingUnitCost;
      const producedQty = completedProcesses.reduce((total, record) => total + (Number(record.outputQty) || 0), 0);
      const producedValue = completedProcesses.reduce(
        (total, record) => total + (processCostMetrics[record.id]?.actualTotalCost || 0),
        0,
      );
      const soldQty = fulfilledSales.reduce((total, record) => total + (Number(record.buyerQty) || 0), 0);
      const soldRevenue = fulfilledSales.reduce(
        (total, record) => total + (Number(record.buyerQty) || 0) * (Number(record.saleUnitPrice) || 0),
        0,
      );
      const availableBaseQty = openingQty + producedQty;
      const currentUnitCost = availableBaseQty > 0 ? (openingValue + producedValue) / availableBaseQty : 0;
      const currentQty = availableBaseQty - soldQty;
      const currentStockValue = currentQty * currentUnitCost;
      const latestCompletedProcess = completedProcesses[0];
      const latestCompletedCost = latestCompletedProcess
        ? processCostMetrics[latestCompletedProcess.id]
        : null;
      const latestActualUnitCost = latestCompletedCost?.actualUnitCost || currentUnitCost;
      const latestRawUnitCost = latestCompletedCost?.rawMaterialUnitCost || openingUnitCost;
      const latestProcessCostPerUnit = latestCompletedCost?.processCostPerUnit || 0;

      return [
        item.id,
        {
          openingQty,
          openingValue,
          producedQty,
          producedValue,
          soldQty,
          soldRevenue,
          currentQty,
          currentUnitCost,
          currentStockValue,
          latestActualUnitCost,
          latestRawUnitCost,
          latestProcessCostPerUnit,
          status: getInventoryStatusFromQty(currentQty, item),
        },
      ];
    }),
  );
}

function collectAlerts(inventory, metrics) {
  return inventory.flatMap((item) => {
    const currentQty = metrics[item.id]?.currentQty ?? Number(item.inventoryQty) ?? 0;
    const itemAlerts = [];

    if (currentQty <= item.inventoryLow) {
      itemAlerts.push({
        title: `${item.inventoryName} is running low`,
        message: `Current quantity is ${currentQty}, below the alert level of ${item.inventoryLow}.`,
        type: "low",
      });
    }

    if (currentQty >= item.inventoryMax) {
      itemAlerts.push({
        title: `${item.inventoryName} reached maximum capacity`,
        message: `Current quantity is ${currentQty}, matching or exceeding capacity ${item.inventoryMax}.`,
        type: "capacity",
      });
    }

    return itemAlerts;
  });
}

function getInventoryStatusFromQty(currentQty, item) {
  if (currentQty >= item.inventoryMax) {
    return "Capacity Full";
  }

  if (currentQty <= item.inventoryLow) {
    return "Low Stock";
  }

  return "Healthy";
}

function upsertRecord(data, key, record, editingId) {
  if (!editingId) {
    return {
      ...data,
      [key]: [record, ...data[key]],
    };
  }

  return {
    ...data,
    [key]: data[key].map((item) => (item.id === editingId ? record : item)),
  };
}

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
