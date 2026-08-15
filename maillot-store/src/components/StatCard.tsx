export default function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="card-surface p-5">
      <p className="text-xs font-medium text-ink-700/60">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent ? "text-accent-dark" : "text-ink-950"}`}>
        {value}
      </p>
    </div>
  );
}
