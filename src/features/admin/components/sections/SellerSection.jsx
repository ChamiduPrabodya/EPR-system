import DataTable from "../../../../common/components/DataTable";
import FormField from "../../../../common/components/FormField";

export default function SellerSection({
  form,
  items,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancelEdit,
  editingId,
  getSellerAvailableQty,
}) {
  return (
    <section className="feature-page-grid">
      <article className="panel records-panel">
        <DataTable
          title="Supplier receipts"
          description="These raw-material receipts feed operations. Available quantity drops as jobs consume material."
          emptyMessage="No supplier receipts yet. Add the first supplier intake on the right."
          headers={["Supplier", "Material", "Received", "Available", "Contact", "Actions"]}
          rows={items.map((seller) => [
            seller.sellerName,
            seller.materialName,
            seller.materialQty,
            getSellerAvailableQty(seller.id),
            seller.sellerContact,
            <div className="table-actions" key={seller.id}>
              <button className="table-action-button" type="button" onClick={() => onEdit(seller.id)}>
                Edit
              </button>
              <button
                className="table-action-button table-action-danger"
                type="button"
                onClick={() => onDelete(seller.id)}
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
            <p className="eyebrow">{editingId ? "Edit supplier" : "Quick add"}</p>
            <h3 id="sellers">Create a supplier receipt and log incoming raw material</h3>
            <p className="panel-copy">
              Supplier receipts are the first step in the ERP flow. Operations will use this quantity later.
            </p>
          </div>
        </div>

        <form className="entry-form" onSubmit={onSubmit}>
          <FormField label="Seller name">
            <input
              type="text"
              placeholder="Green Leaf Traders"
              required
              value={form.sellerName}
              onChange={(event) => onChange("sellerName", event.target.value)}
            />
          </FormField>

          <FormField label="Raw material">
            <input
              type="text"
              placeholder="Dried herbs"
              required
              value={form.materialName}
              onChange={(event) => onChange("materialName", event.target.value)}
            />
          </FormField>

          <FormField label="Received quantity">
            <input
              type="number"
              min="1"
              placeholder="250"
              required
              value={form.materialQty}
              onChange={(event) => onChange("materialQty", event.target.value)}
            />
          </FormField>

          <FormField label="Contact">
            <input
              type="text"
              placeholder="+94 77 123 4567"
              required
              value={form.sellerContact}
              onChange={(event) => onChange("sellerContact", event.target.value)}
            />
          </FormField>

          <div className="form-action-row">
            <button type="submit">{editingId ? "Update supplier receipt" : "Save supplier receipt"}</button>
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
