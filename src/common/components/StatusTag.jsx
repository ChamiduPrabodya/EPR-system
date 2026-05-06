export default function StatusTag({ label, tone = "neutral" }) {
  const toneClassMap = {
    good: "tag-good",
    warn: "tag-warn",
    neutral: "tag-neutral",
  };

  return <span className={`tag ${toneClassMap[tone] || toneClassMap.neutral}`}>{label}</span>;
}
