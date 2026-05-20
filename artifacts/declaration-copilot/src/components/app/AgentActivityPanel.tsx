import { motion } from "framer-motion";
import {
  Brain,
  Calculator,
  FileSearch,
  MessageSquare,
  ScanText,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { useListAgentActivity } from "@workspace/api-client-react";
import { formatRelativeTime } from "@/lib/format";
import { ErrorState } from "./AsyncStates";

const typeIcons = {
  skill: Brain,
  tool: Wrench,
  status: ShieldAlert,
} as const;

function badgeClass(type: string) {
  if (type === "skill") return "bg-[#1A6B5E]/15 text-[#1A6B5E] border-[#1A6B5E]/25";
  if (type === "tool") return "bg-[#E8A020]/15 text-[#8B6914] border-[#E8A020]/30";
  return "bg-[#6B6966]/10 text-[#6B6966] border-black/[0.08]";
}

export function AgentActivityPanel() {
  const { data, isLoading, isError, refetch } = useListAgentActivity({ limit: 12 });

  return (
    <div className="bg-[#141210] rounded-2xl border border-white/[0.06] overflow-hidden h-full flex flex-col min-h-[420px]">
      <div className="px-4 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A6B5E] opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1A6B5E]" />
          </span>
          <span className="text-[13px] font-semibold text-gray-100">Agent Activity</span>
        </div>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Live</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
        {isLoading && (
          <div className="flex flex-col gap-2 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/[0.06] rounded-xl" />
            ))}
          </div>
        )}
        {isError && (
          <ErrorState message="Impossible de charger l'activité agent." onRetry={() => refetch()} />
        )}
        {data?.items.map((item, i) => {
          const Icon = typeIcons[item.type as keyof typeof typeIcons] ?? FileSearch;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl bg-[#1D1A17] border border-white/[0.05] px-3 py-2.5 hover:border-[#1A6B5E]/30 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-[#1A6B5E]" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[12px] font-medium text-gray-200 leading-snug">{item.title}</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${badgeClass(item.type)}`}>
                      {item.skillOrTool ?? item.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{item.detail}</p>
                  <span className="text-[10px] text-gray-600 mt-1 block">{formatRelativeTime(item.createdAt)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="px-4 py-3 border-t border-white/[0.06] flex items-center gap-2 text-[10px] text-gray-500">
        <ScanText className="w-3 h-3" />
        <span>Skills reason · Tools act</span>
        <Calculator className="w-3 h-3 ml-auto opacity-50" />
        <MessageSquare className="w-3 h-3 opacity-50" />
      </div>
    </div>
  );
}
