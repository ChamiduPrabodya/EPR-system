export const storageKey = "supplyflow-admin-data";

export const defaultAdminData = {
  sellers: [
    {
      sellerName: "Green Leaf Traders",
      materialName: "Dried herbs",
      materialQty: 250,
      sellerContact: "+94 77 123 4567",
    },
    {
      sellerName: "Harvest Source",
      materialName: "Natural fiber",
      materialQty: 140,
      sellerContact: "+94 71 555 8855",
    },
  ],
  processing: [
    {
      productName: "Premium herb box",
      featureType: "Packing",
      featureCost: 1200,
      processStatus: "Completed",
    },
    {
      productName: "Retail fiber pack",
      featureType: "Delivery",
      featureCost: 800,
      processStatus: "In Progress",
    },
  ],
  buyers: [
    {
      buyerName: "City Retail Hub",
      buyerProduct: "Packed herb box",
      buyerQty: 80,
      deliveryDate: "2026-05-08",
    },
    {
      buyerName: "Market Lane Stores",
      buyerProduct: "Fiber packaging set",
      buyerQty: 45,
      deliveryDate: "2026-05-12",
    },
  ],
  inventory: [
    {
      inventoryName: "Packed herb box",
      inventoryQty: 55,
      inventoryMax: 300,
      inventoryLow: 60,
    },
    {
      inventoryName: "Fiber packaging set",
      inventoryQty: 215,
      inventoryMax: 200,
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
  productName: "",
  featureType: "Packing",
  featureCost: "",
  processStatus: "Queued",
};

export const emptyBuyerForm = {
  buyerName: "",
  buyerProduct: "",
  buyerQty: "",
  deliveryDate: "",
};

export const emptyInventoryForm = {
  inventoryName: "",
  inventoryQty: "",
  inventoryMax: "",
  inventoryLow: "",
};
