import DataTable from "../../../../common/components/DataTable";
import FormField from "../../../../common/components/FormField";
import StatusTag from "../../../../common/components/StatusTag";
import { formatCurrency } from "../../../../common/utils/formatters";

export default function ProcessingSection({ form, items, onChange, onSubmit }) {
  return (
    <section className="feature-page-grid">
      <article className="panel records-panel">
        <DataTable
          title="Processing records"
          description="See what extra services were added and whether they are finished."
          emptyMessage="No processing records yet. Add the first company service on the left."
          headers={["Product", "Feature", "Cost", "Status"]}
          rows={items.map((item) => [
            item.productName,
            item.featureType,
            formatCurrency(item.featureCost),
            <StatusTag
              key={`${item.productName}-${item.featureType}`}
              label={item.processStatus}
              tone={
                item.processStatus === "Completed"
                  ? "good"
                  : item.processStatus === "In Progress"
                    ? "warn"
                    : "neutral"
              }
            />,
          ])}
        />
      </article>

      <article className="panel form-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Quick add</p>
            <h3 id="processing">Add internal jobs and service work</h3>
            <p className="panel-copy">Create the next work item only after you confirm the current list is right.</p>
          </div>
        </div>

        <form className="entry-form" onSubmit={onSubmit}>
          <FormField label="Product name">
            <input
              type="text"
              placeholder="Premium herb box"
              required
              value={form.productName}
              onChange={(event) => onChange("productName", event.target.value)}
            />
          </FormField>

          <FormField label="Feature added">
            <select value={form.featureType} onChange={(event) => onChange("featureType", event.target.value)}>
              <option value="Packing">Packing</option>
              <option value="Delivery">Delivery</option>
              <option value="Labeling">Labeling</option>
              <option value="Quality Check">Quality Check</option>
            </select>
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
            <select
              value={form.processStatus}
              onChange={(event) => onChange("processStatus", event.target.value)}
            >
              <option value="Queued">Queued</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </FormField>

          <button type="submit">Save operations job</button>
        </form>
      </article>
    </section>
  );
}
