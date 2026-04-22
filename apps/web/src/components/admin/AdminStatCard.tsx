type Props = {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
};

export function AdminStatCard({ label, value, change, changeType = "neutral", icon }: Props) {
  const changeColor = {
    positive: "text-neon",
    negative: "text-red-500",
    neutral: "text-gray-500",
  }[changeType];

  return (
    <div className="bg-safarigray border border-safariborder rounded-2xl p-5 md:p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {icon && <div className="text-neon">{icon}</div>}
      </div>
      <p className="text-2xl md:text-3xl font-display font-bold text-white mb-1">{value}</p>
      {change && (
        <p className={`text-xs font-medium ${changeColor}`}>{change}</p>
      )}
    </div>
  );
}