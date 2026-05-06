import { useEffect } from "react";
import { appTheme } from "../../../app/theme";
import PageIntro from "../components/PageIntro";
import { useAdminData } from "../context/AdminDataContext";
import { formatCurrency } from "../../../common/utils/formatters";

export default function CostsPage() {
  const { actualCostRows, currentCostRows } = useAdminData();

  useEffect(() => {
    document.title = `${appTheme.appTitle} | Costs`;
  }, []);

  function printReport(title, columns, rows) {
    const printWindow = window.open("", "_blank", "width=1100,height=800");

    if (!printWindow) {
      return;
    }

    const head = columns.map((column) => `<th>${column}</th>`).join("");
    const body = rows
      .map(
        (row) =>
          `<tr>${row
            .map((cell) => `<td>${String(cell)}</td>`)
            .join("")}</tr>`,
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1f2937; }
            h1 { margin-bottom: 8px; }
            p { margin-top: 0; color: #4b5563; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>N&C ERP printable report</p>
          <table>
            <thead><tr>${head}</tr></thead>
            <tbody>${body}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  const actualPrintRows = actualCostRows.map((row) => [
    row.inventoryName,
    formatCurrency(row.rawMaterialUnitCost),
    formatCurrency(row.packingCostPerUnit),
    formatCurrency(row.processCostPerUnit),
    formatCurrency(row.actualCostPerUnit),
    formatCurrency(row.sellingPricePerUnit),
    formatCurrency(row.actualMarginPerUnit),
  ]);

  const currentPrintRows = currentCostRows.map((row) => [
    row.inventoryName,
    row.openingQty,
    row.currentQty,
    formatCurrency(row.currentCostPerUnit),
    formatCurrency(row.currentStockValue),
    formatCurrency(row.sellingPricePerUnit),
    formatCurrency(row.currentMarginPerUnit),
  ]);

  return (
    <>
      <PageIntro
        eyebrow="Product costing"
        title="Review actual cost and current cost for each product."
        description="This workspace gives you two printable cost views: actual production cost and current weighted stock cost."
        tips={["Use actual cost for latest production review.", "Use current cost for current stock valuation and selling checks."]}
        stats={[
          { label: "Products", value: actualCostRows.length },
          {
            label: "Actual views",
            value: actualCostRows.filter((row) => row.actualCostPerUnit > 0).length,
          },
          {
            label: "Current views",
            value: currentCostRows.filter((row) => row.currentQty > 0).length,
          },
        ]}
      />

      <section className="cost-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Actual cost</p>
              <h3>Latest actual product cost</h3>
              <p className="panel-copy">
                Raw material cost, packing cost, and process cost are combined into the latest actual cost per unit.
              </p>
            </div>
            <button
              className="secondary-button panel-button"
              type="button"
              onClick={() =>
                printReport(
                  "Actual Product Cost Report",
                  ["Product", "Raw Unit Cost", "Packing Unit Cost", "Process Unit Cost", "Actual Unit Cost", "Selling Price", "Margin"],
                  actualPrintRows,
                )
              }
            >
              Print actual cost
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Raw Unit Cost</th>
                  <th>Packing Unit Cost</th>
                  <th>Process Unit Cost</th>
                  <th>Actual Unit Cost</th>
                  <th>Selling Price</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                {actualCostRows.map((row) => (
                  <tr key={row.inventoryId}>
                    <td>{row.inventoryName}</td>
                    <td>{formatCurrency(row.rawMaterialUnitCost)}</td>
                    <td>{formatCurrency(row.packingCostPerUnit)}</td>
                    <td>{formatCurrency(row.processCostPerUnit)}</td>
                    <td>{formatCurrency(row.actualCostPerUnit)}</td>
                    <td>{formatCurrency(row.sellingPricePerUnit)}</td>
                    <td>{formatCurrency(row.actualMarginPerUnit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Current cost</p>
              <h3>Current stock cost view</h3>
              <p className="panel-copy">
                This uses weighted stock cost from opening stock and completed production, then shows the current stock value.
              </p>
            </div>
            <button
              className="secondary-button panel-button"
              type="button"
              onClick={() =>
                printReport(
                  "Current Product Cost Report",
                  ["Product", "Opening Qty", "Current Qty", "Current Unit Cost", "Current Stock Value", "Selling Price", "Margin"],
                  currentPrintRows,
                )
              }
            >
              Print current cost
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Opening Qty</th>
                  <th>Current Qty</th>
                  <th>Current Unit Cost</th>
                  <th>Current Stock Value</th>
                  <th>Selling Price</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                {currentCostRows.map((row) => (
                  <tr key={row.inventoryId}>
                    <td>{row.inventoryName}</td>
                    <td>{row.openingQty}</td>
                    <td>{row.currentQty}</td>
                    <td>{formatCurrency(row.currentCostPerUnit)}</td>
                    <td>{formatCurrency(row.currentStockValue)}</td>
                    <td>{formatCurrency(row.sellingPricePerUnit)}</td>
                    <td>{formatCurrency(row.currentMarginPerUnit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </>
  );
}
