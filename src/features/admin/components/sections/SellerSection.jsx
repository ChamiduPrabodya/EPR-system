import DataTable from "../../../../common/components/DataTable";
import FormField from "../../../../common/components/FormField";

export default function SellerSection({ form, items, onChange, onSubmit }) {
  return (
    <section className="feature-page-grid">
      <article className="panel records-panel">
        <DataTable
          title="Seller records"
          description="Review saved suppliers and the raw materials they provided."
          emptyMessage="No seller records yet. Add the first supplier on the left."
          headers={["Seller", "Material", "Qty", "Contact"]}
          rows={items.map((seller) => [
            seller.sellerName,
            seller.materialName,
            seller.materialQty,
            seller.sellerContact,
          ])}
        />
      </article>

      <article className="panel form-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Quick add</p>
            <h3 id="sellers">Create a supplier record and log incoming material</h3>
            <p className="panel-copy">Add one delivery at a time so procurement records stay clean.</p>
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

          <FormField label="Quantity">
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

          <button type="submit">Save supplier intake</button>
        </form>
      </article>
    </section>
  );
}
