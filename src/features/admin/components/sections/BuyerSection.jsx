import DataTable from "../../../../common/components/DataTable";
import FormField from "../../../../common/components/FormField";
import StatusTag from "../../../../common/components/StatusTag";
import { formatDate } from "../../../../common/utils/formatters";

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
          description="Fulfilled orders reduce inventory automatically. Pending and confirmed orders stay planned only."
          emptyMessage="No sales orders yet. Add the first order on the right."
          headers={["Buyer", "Product", "Qty", "Delivery", "Status", "Actions"]}
          rows={items.map((buyer) => [
            buyer.buyerName,
            getInventoryName(buyer.inventoryItemId),
            buyer.buyerQty,
            formatDate(buyer.deliveryDate),
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
            <h3 id="buyers">Capture customer orders against inventory items</h3>
            <p className="panel-copy">
              Sales orders link directly to inventory. Stock only deducts when the order is fulfilled.
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

          <FormField label="Quantity">
            <input
              type="number"
              min="1"
              placeholder="80"
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
