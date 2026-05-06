import DataTable from "../../../../common/components/DataTable";
import FormField from "../../../../common/components/FormField";
import StatusTag from "../../../../common/components/StatusTag";
import { formatCurrency } from "../../../../common/utils/formatters";

export default function BuyerSection({
  form,
  items,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancelEdit,
  editingId,
  inventoryOptions,
  getInventoryName,
}) {
  return (
    <section className="feature-page-grid">
      <article className="panel records-panel">
        <DataTable
          title="Sales orders"
          description="Sales totals multiply by quantity automatically. Fulfilled orders reduce inventory stock."
          emptyMessage="No sales orders yet. Add the first order on the right."
          headers={["Buyer", "Product", "Qty", "Unit Price", "Sales Total", "Profit", "Status", "Actions"]}
          rows={items.map((buyer) => [
            buyer.buyerName,
            getInventoryName(buyer.inventoryItemId),
            buyer.buyerQty,
            formatCurrency(buyer.saleUnitPrice),
            formatCurrency(buyer.buyerQty * buyer.saleUnitPrice),
            formatCurrency(buyer.buyerQty * (buyer.saleUnitPrice - buyer.costUnitPrice)),
            <StatusTag
              key={`${buyer.id}-status`}
              label={buyer.orderStatus}
              tone={buyer.orderStatus === "Fulfilled" ? "good" : buyer.orderStatus === "Confirmed" ? "warn" : "neutral"}
            />,
            <div className="table-actions" key={buyer.id}>
              <button className="table-action-button" type="button" onClick={() => onEdit(buyer.id)}>
                Edit
              </button>
              <button
                className="table-action-button table-action-danger"
                type="button"
                onClick={() => onDelete(buyer.id)}
              >
                Delete
              </button>
            </div>,
          ])}
        />
      </article>

      <article className="panel form-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{editingId ? "Edit order" : "Quick add"}</p>
            <h3 id="buyers">Capture customer orders with selling price</h3>
            <p className="panel-copy">
              Selling price multiplies by quantity automatically, so 1 kg and 12 kg both calculate correctly.
            </p>
          </div>
        </div>

        <form className="entry-form" onSubmit={onSubmit}>
          <FormField label="Buyer name">
            <input
              type="text"
              placeholder="City Retail Hub"
              required
              value={form.buyerName}
              onChange={(event) => onChange("buyerName", event.target.value)}
            />
          </FormField>

          <FormField label="Product ordered">
            <select value={form.inventoryItemId} onChange={(event) => onChange("inventoryItemId", event.target.value)}>
              <option value="">Select inventory item</option>
              {inventoryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Selling price per unit">
            <input
              type="number"
              min="0"
              placeholder="90"
              required
              value={form.saleUnitPrice}
              onChange={(event) => onChange("saleUnitPrice", event.target.value)}
            />
          </FormField>

          <FormField label="Quantity">
            <input
              type="number"
              min="1"
              placeholder="12"
              required
              value={form.buyerQty}
              onChange={(event) => onChange("buyerQty", event.target.value)}
            />
          </FormField>

          <FormField label="Delivery date">
            <input
              type="date"
              required
              value={form.deliveryDate}
              onChange={(event) => onChange("deliveryDate", event.target.value)}
            />
          </FormField>

          <FormField label="Order status">
            <select value={form.orderStatus} onChange={(event) => onChange("orderStatus", event.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </FormField>

          <div className="form-preview">
            <strong>Calculated total</strong>
            <span>{formatCurrency((Number(form.buyerQty) || 0) * (Number(form.saleUnitPrice) || 0))}</span>
          </div>

          <div className="form-action-row">
            <button type="submit">{editingId ? "Update sales order" : "Save sales order"}</button>
            {editingId ? (
              <button className="secondary-button" type="button" onClick={onCancelEdit}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </article>
    </section>
  );
}
