interface StatItemProps {
  value: string;
  label: string;
}

export function StatItem({ value, label }: StatItemProps) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</div>
      <div className="text-xs sm:text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}

export function StatsRow({ stats }: { stats: StatItemProps[] }) {
  return (
    <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-200/80 max-w-4xl mx-auto">
      {stats.map((item, idx) => (
        <StatItem key={idx} value={item.value} label={item.label} />
      ))}
    </div>
  );
}
