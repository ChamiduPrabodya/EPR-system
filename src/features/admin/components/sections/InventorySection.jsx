import DataTable from "../../../../common/components/DataTable";
import FormField from "../../../../common/components/FormField";
import StatusTag from "../../../../common/components/StatusTag";

export default function InventorySection({ form, items, onChange, onSubmit, getInventoryStatus }) {
  return (
    <section className="feature-page-grid">
      <article className="panel records-panel">
        <DataTable
          title="Inventory records"
          description="Use this list to compare quantity, capacity, and alert level at a glance."
          emptyMessage="No inventory items yet. Add the first stock item on the left."
          headers={["Item", "Current", "Capacity", "Alert Level", "Status"]}
          rows={items.map((item) => {
            const status = getInventoryStatus(item);
            return [
              item.inventoryName,
              item.inventoryQty,
              item.inventoryMax,
              item.inventoryLow,
              <StatusTag
                key={item.inventoryName}
                label={status}
                tone={status === "Healthy" ? "good" : "warn"}
              />,
            ];
          })}
        />
      </article>

      <article className="panel form-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Quick add</p>
            <h3 id="inventory">Track stock, limits, and risk thresholds</h3>
            <p className="panel-copy">Add or update one stock line at a time after you confirm the current list.</p>
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

          <FormField label="Current quantity">
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

          <button type="submit">Save inventory item</button>
        </form>
      </article>
    </section>
  );
}
