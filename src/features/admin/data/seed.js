export const storageKey = "supplyflow-admin-data";

export const defaultAdminData = {
  sellers: [
    {
      id: "seller-1",
      sellerName: "Green Leaf Traders",
      materialName: "Dried herbs",
      materialQty: 250,
      sellerContact: "+94 77 123 4567",
    },
    {
      id: "seller-2",
      sellerName: "Harvest Source",
      materialName: "Natural fiber",
      materialQty: 140,
      sellerContact: "+94 71 555 8855",
    },
  ],
  processing: [
    {
      id: "process-1",
      sourceSellerId: "seller-1",
      inventoryItemId: "inventory-1",
      productName: "Packed herb box",
      featureType: "Packing",
      featureCost: 1200,
      inputQty: 120,
      outputQty: 55,
      processStatus: "Completed",
    },
    {
      id: "process-2",
      sourceSellerId: "seller-2",
      inventoryItemId: "inventory-2",
      productName: "Fiber packaging set",
      featureType: "Delivery",
      featureCost: 800,
      inputQty: 45,
      outputQty: 25,
      processStatus: "In Progress",
    },
  ],
  buyers: [
    {
      id: "buyer-1",
      buyerName: "City Retail Hub",
      inventoryItemId: "inventory-1",
      buyerProduct: "Packed herb box",
      buyerQty: 40,
      deliveryDate: "2026-05-08",
      orderStatus: "Fulfilled",
    },
    {
      id: "buyer-2",
      buyerName: "Market Lane Stores",
      inventoryItemId: "inventory-2",
      buyerProduct: "Fiber packaging set",
      buyerQty: 45,
      deliveryDate: "2026-05-12",
      orderStatus: "Confirmed",
    },
  ],
  inventory: [
    {
      id: "inventory-1",
      inventoryName: "Packed herb box",
      inventoryQty: 0,
      inventoryMax: 300,
      inventoryLow: 30,
    },
    {
      id: "inventory-2",
      inventoryName: "Fiber packaging set",
      inventoryQty: 190,
      inventoryMax: 260,
      inventoryLow: 50,
    },
  ],
};

export const emptySellerForm = {
  sellerName: "",
  materialName: "",
  materialQty: "",
  sellerContact: "",
};

export const emptyProcessForm = {
  sourceSellerId: "",
  inventoryItemId: "",
  featureType: "Packing",
  featureCost: "",
  inputQty: "",
  outputQty: "",
  processStatus: "Queued",
};

export const emptyBuyerForm = {
  buyerName: "",
  inventoryItemId: "",
  buyerQty: "",
  deliveryDate: "",
  orderStatus: "Pending",
};

export const emptyInventoryForm = {
  inventoryName: "",
  inventoryQty: "",
  inventoryMax: "",
  inventoryLow: "",
};
