export default function DataTable({
  headers,
  rows,
  title = "Saved records",
  description = "Recent entries are shown first.",
  emptyMessage = "No records added yet.",
}) {
  return (
    <div className="data-table-card">
      <div className="table-header">
        <div className="table-header-copy">
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        <span className="table-count">{rows.length} records</span>
      </div>

      {rows.length === 0 ? (
        <div className="empty-state">{emptyMessage}</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${String(row[0])}-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
