import type { DocumentStatus, Severity } from "@workspace/api-client-react";

interface StatusBadgeProps {
  status: DocumentStatus;
  size?: "sm" | "md";
}

const config: Record<DocumentStatus, { label: string; className: string }> = {
  READY:      { label: "READY",       className: "bg-green-50 text-green-700 border border-green-200" },
  INCOMPLETE: { label: "INCOMPLETE",  className: "bg-amber-50 text-amber-700 border border-amber-200" },
  BLOCKED:    { label: "BLOCKED",     className: "bg-red-50 text-red-700 border border-red-200" },
  PROCESSING: { label: "PROCESSING",  className: "bg-blue-50 text-blue-600 border border-blue-200" },
  ERROR:      { label: "ERROR",       className: "bg-red-100 text-red-800 border border-red-300" },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const { label, className } = config[status];
  const sizeClass = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-1";
  return (
    <span className={`inline-flex items-center rounded font-semibold tracking-wider ${sizeClass} ${className}`}>
      {label}
    </span>
  );
}

interface SeverityDotProps { severity: Severity; }
export function SeverityDot({ severity }: SeverityDotProps) {
  const colors: Record<Severity, string> = {
    BLOCKING: "bg-red-500",
    RISK:     "bg-amber-500",
    WARNING:  "bg-yellow-400",
  };
  return <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${colors[severity]}`} />;
}

interface ImpactBadgeProps { impact: "Bloquant" | "Risque" | "À vérifier"; }
export function ImpactBadge({ impact }: ImpactBadgeProps) {
  const config = {
    "Bloquant":   "bg-red-50 text-red-700 border-red-200",
    "Risque":     "bg-amber-50 text-amber-700 border-amber-200",
    "À vérifier": "bg-yellow-50 text-yellow-700 border-yellow-200",
  }[impact];
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${config}`}>{impact}</span>
  );
}
