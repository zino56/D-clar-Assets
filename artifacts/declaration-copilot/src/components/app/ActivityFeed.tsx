import type { ActivityEntry } from "../../data/mockData";

interface ActivityFeedProps {
  entries: ActivityEntry[];
  maxItems?: number;
}

const agentColors: Record<string, string> = {
  "Classifier":     "bg-blue-100 text-blue-700",
  "Extractor":      "bg-purple-100 text-purple-700",
  "Fiscal Checker": "bg-red-100 text-red-700",
  "Follow-up Writer": "bg-amber-100 text-amber-700",
  "Export Agent":   "bg-green-100 text-green-700",
  "System":         "bg-gray-100 text-gray-600",
};

export function ActivityFeed({ entries, maxItems = 6 }: ActivityFeedProps) {
  return (
    <div className="flex flex-col gap-2">
      {entries.slice(0, maxItems).map((entry) => (
        <div key={entry.id} className="flex items-start gap-2.5">
          <span className="text-[11px] text-[#6B6966] font-mono w-10 flex-shrink-0 mt-0.5">{entry.time}</span>
          <div className="flex-1 min-w-0">
            {entry.agent && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded mr-1.5 ${agentColors[entry.agent] ?? "bg-gray-100 text-gray-600"}`}>
                {entry.agent}
              </span>
            )}
            <span className="text-[12px] text-[#1C1A16]">{entry.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
