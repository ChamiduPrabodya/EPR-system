import DataTable from "../../../../common/components/DataTable";
import FormField from "../../../../common/components/FormField";
import { formatDate } from "../../../../common/utils/formatters";

export default function BuyerSection({ form, items, onChange, onSubmit }) {
  return (
    <section className="feature-page-grid">
      <article className="panel records-panel">
        <DataTable
          title="Buyer orders"
          description="Review all current buyer requests and planned delivery dates."
          emptyMessage="No buyer orders yet. Add the first order on the left."
          headers={["Buyer", "Product", "Qty", "Delivery"]}
          rows={items.map((buyer) => [
            buyer.buyerName,
            buyer.buyerProduct,
            buyer.buyerQty,
            formatDate(buyer.deliveryDate),
          ])}
        />
      </article>

      <article className="panel form-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Quick add</p>
            <h3 id="buyers">Capture customer orders clearly</h3>
            <p className="panel-copy">Add the next order only after you review what is already scheduled.</p>
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
            <input
              type="text"
              placeholder="Packed herb box"
              required
              value={form.buyerProduct}
              onChange={(event) => onChange("buyerProduct", event.target.value)}
            />
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

          <button type="submit">Save sales order</button>
        </form>
      </article>
    </section>
  );
}
