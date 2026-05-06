import { appRoutes } from "./router/routes";

export const appTheme = {
  appTitle: import.meta.env.VITE_APP_TITLE || "N&C ERP",
  appName: "N&C",
  adminName: import.meta.env.VITE_ADMIN_NAME || "Main Admin",
  heroTags: ["Suppliers", "Operations", "Sales Orders", "Inventory Control"],
  workflowSteps: [
    {
      title: "Save supplier records",
      description: "Keep supplier names, raw materials, and contact details in one place before work begins.",
    },
    {
      title: "Track operations work",
      description: "Record packing, delivery, labeling, or any internal service step needed to complete an order.",
    },
    {
      title: "Manage customer orders",
      description: "See what each customer ordered, how much they need, and the delivery date your team must hit.",
    },
    {
      title: "Watch stock levels",
      description: "Monitor available stock, low limits, and capacity so shortages are visible early.",
    },
  ],
  sidebarLinks: [
    {
      label: "Dashboard",
      to: appRoutes.admin,
      description: "Module launcher and status",
      summaryKey: "alerts",
      shortLabel: "DB",
    },
    {
      label: "Suppliers",
      to: appRoutes.adminSellers,
      description: "Vendors and material intake",
      summaryKey: "sellers",
      shortLabel: "SU",
    },
    {
      label: "Operations",
      to: appRoutes.adminProcessing,
      description: "Production and service steps",
      summaryKey: "processing",
      shortLabel: "OP",
    },
    {
      label: "Sales",
      to: appRoutes.adminBuyers,
      description: "Customer orders and delivery plans",
      summaryKey: "buyers",
      shortLabel: "SA",
    },
    {
      label: "Inventory",
      to: appRoutes.adminInventory,
      description: "Stock levels and warnings",
      summaryKey: "inventory",
      shortLabel: "IN",
    },
    {
      label: "Costs",
      to: appRoutes.adminCosts,
      description: "Actual and current product cost",
      summaryKey: "inventory",
      shortLabel: "CO",
    },
  ],
  pageMeta: {
    [appRoutes.admin]: {
      eyebrow: "Home",
      title: "ERP workspace",
      description: "Open a module, launch a task, or review current operational status.",
    },
    [appRoutes.adminSellers]: {
      eyebrow: "Procurement",
      title: "Supplier management",
      description: "Review vendor records, raw materials, quantities, and intake history.",
    },
    [appRoutes.adminProcessing]: {
      eyebrow: "Operations",
      title: "Operations management",
      description: "Track internal work steps, service costs, and processing status.",
    },
    [appRoutes.adminBuyers]: {
      eyebrow: "Sales",
      title: "Sales order management",
      description: "Keep customer orders organized with products, quantities, and promised dates.",
    },
    [appRoutes.adminInventory]: {
      eyebrow: "Inventory",
      title: "Inventory workspace",
      description: "Monitor stock on hand, capacity, and alert thresholds from one place.",
    },
    [appRoutes.adminCosts]: {
      eyebrow: "Costs",
      title: "Product cost workspace",
      description: "Review actual cost, current cost, and print both views for each product.",
    },
  },
};
