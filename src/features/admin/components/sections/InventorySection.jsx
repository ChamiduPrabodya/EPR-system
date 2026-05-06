import DataTable from "../../../../common/components/DataTable";
import FormField from "../../../../common/components/FormField";
import StatusTag from "../../../../common/components/StatusTag";

export default function InventorySection({
  form,
  items,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancelEdit,
  editingId,
  getInventoryStatus,
  getInventoryCurrentQty,
  getInventoryProducedQty,
  getInventorySoldQty,
}) {
  return (
    <section className="feature-page-grid">
      <article className="panel records-panel">
        <DataTable
          title="Inventory records"
          description="Current stock is calculated from opening stock plus completed operations minus fulfilled sales."
          emptyMessage="No inventory items yet. Add the first stock item on the right."
          headers={["Item", "Opening", "Current", "Produced", "Sold", "Status", "Actions"]}
          rows={items.map((item) => {
            const status = getInventoryStatus(item);
            return [
              item.inventoryName,
              item.inventoryQty,
              getInventoryCurrentQty(item),
              getInventoryProducedQty(item),
              getInventorySoldQty(item),
              <StatusTag key={`${item.id}-status`} label={status} tone={status === "Healthy" ? "good" : "warn"} />,
              <div className="table-actions" key={item.id}>
                <button className="table-action-button" type="button" onClick={() => onEdit(item.id)}>
                  Edit
                </button>
                <button
                  className="table-action-button table-action-danger"
                  type="button"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </div>,
            ];
          })}
        />
      </article>

      <article className="panel form-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{editingId ? "Edit stock item" : "Quick add"}</p>
            <h3 id="inventory">Manage stock master records and thresholds</h3>
            <p className="panel-copy">
              Inventory items sit between operations and sales. Opening stock is adjusted by linked jobs and fulfilled orders.
            </p>
          </div>
        </div>

        <form className="entry-form" onSubmit={onSubmit}>
          <FormField label="Item name">
            <input
              type="text"
              placeholder="Packed herb box"
              required
              value={form.inventoryName}
              onChange={(event) => onChange("inventoryName", event.target.value)}
            />
          </FormField>

          <FormField label="Opening stock">
            <input
              type="number"
              min="0"
              placeholder="140"
              required
              value={form.inventoryQty}
              onChange={(event) => onChange("inventoryQty", event.target.value)}
            />
          </FormField>

          <FormField label="Max capacity">
            <input
              type="number"
              min="1"
              placeholder="300"
              required
              value={form.inventoryMax}
              onChange={(event) => onChange("inventoryMax", event.target.value)}
            />
          </FormField>

          <FormField label="Low quantity alert level">
            <input
              type="number"
              min="0"
              placeholder="60"
              required
              value={form.inventoryLow}
              onChange={(event) => onChange("inventoryLow", event.target.value)}
            />
          </FormField>

          <div className="form-action-row">
            <button type="submit">{editingId ? "Update inventory item" : "Save inventory item"}</button>
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
