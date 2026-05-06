export default function FormField({ label, children }) {
  return (
    <label className="field-label">
      <span>{label}</span>
      {children}
    </label>
  );
}
