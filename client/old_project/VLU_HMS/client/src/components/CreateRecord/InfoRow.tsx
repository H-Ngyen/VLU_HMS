interface InfoRowProps {
  label: string;
  value: string | number | undefined;
  fullWidth?: boolean;
  className?: string;
}

export const InfoRow = ({
  label,
  value,
  fullWidth = false,
  className = "",
}: InfoRowProps) => (
  <div className={`${fullWidth ? "col-span-full" : ""} ${className} mb-2`}>
    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
      {label}
    </span>
    <span className="text-gray-800 font-medium">{value || "---"}</span>
  </div>
);
