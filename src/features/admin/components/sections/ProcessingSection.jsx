import DataTable from "../../../../common/components/DataTable";
import FormField from "../../../../common/components/FormField";
import StatusTag from "../../../../common/components/StatusTag";
import { formatCurrency } from "../../../../common/utils/formatters";

export default function ProcessingSection({
  form,
  items,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancelEdit,
  editingId,
  sellerOptions,
  inventoryOptions,
  getSellerMaterialLabel,
  getInventoryName,
}) {
  return (
    <section className="feature-page-grid">
      <article className="panel records-panel">
        <DataTable
          title="Operations jobs"
          description="Operations consume supplier material and add completed output into inventory automatically."
          emptyMessage="No operations jobs yet. Add the first processing job on the right."
          headers={["Output Item", "Source Material", "Input", "Output", "Cost", "Status", "Actions"]}
          rows={items.map((item) => [
            getInventoryName(item.inventoryItemId),
            getSellerMaterialLabel(item.sourceSellerId),
            item.inputQty,
            item.outputQty,
            formatCurrency(item.featureCost),
            <StatusTag
              key={`${item.id}-status`}
              label={item.processStatus}
              tone={
                item.processStatus === "Completed"
                  ? "good"
                  : item.processStatus === "In Progress"
                    ? "warn"
                    : "neutral"
              }
            />,
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
          ])}
        />
      </article>

      <article className="panel form-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{editingId ? "Edit job" : "Quick add"}</p>
            <h3 id="processing">Create internal jobs from supplier material</h3>
            <p className="panel-copy">
              Completed jobs increase inventory. Queued and in-progress jobs still reserve supplier material.
            </p>
          </div>
        </div>

        <form className="entry-form" onSubmit={onSubmit}>
          <FormField label="Supplier receipt">
            <select value={form.sourceSellerId} onChange={(event) => onChange("sourceSellerId", event.target.value)}>
              <option value="">Select supplier material</option>
              {sellerOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Inventory output item">
            <select value={form.inventoryItemId} onChange={(event) => onChange("inventoryItemId", event.target.value)}>
              <option value="">Select inventory item</option>
              {inventoryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Feature added">
            <select value={form.featureType} onChange={(event) => onChange("featureType", event.target.value)}>
              <option value="Packing">Packing</option>
              <option value="Delivery">Delivery</option>
              <option value="Labeling">Labeling</option>
              <option value="Quality Check">Quality Check</option>
            </select>
          </FormField>

          <FormField label="Input quantity used">
            <input
              type="number"
              min="1"
              placeholder="120"
              required
              value={form.inputQty}
              onChange={(event) => onChange("inputQty", event.target.value)}
            />
          </FormField>

          <FormField label="Output quantity produced">
            <input
              type="number"
              min="0"
              placeholder="55"
              required
              value={form.outputQty}
              onChange={(event) => onChange("outputQty", event.target.value)}
            />
          </FormField>

          <FormField label="Cost">
            <input
              type="number"
              min="0"
              placeholder="1200"
              required
              value={form.featureCost}
              onChange={(event) => onChange("featureCost", event.target.value)}
            />
          </FormField>

          <FormField label="Status">
            <select value={form.processStatus} onChange={(event) => onChange("processStatus", event.target.value)}>
              <option value="Queued">Queued</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </FormField>

          <div className="form-action-row">
            <button type="submit">{editingId ? "Update operations job" : "Save operations job"}</button>
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
