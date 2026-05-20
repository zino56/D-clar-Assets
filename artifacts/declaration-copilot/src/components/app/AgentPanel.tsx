import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Zap, Brain, Wrench } from "lucide-react";
import { useListAgentActivity, useListSkills } from "@workspace/api-client-react";
import { formatRelativeTime } from "@/lib/format";

/**
 * Task-oriented operator panel (not a chat UI).
 * V1: read-only activity + skills registry preview from API.
 */
export function AgentPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const { data: activity, isLoading: activityLoading } = useListAgentActivity({ limit: 8 });
  const { data: skills } = useListSkills();

  if (collapsed) {
    return (
      <div className="w-12 flex-shrink-0 bg-[#141210] border-l border-white/[0.06] flex flex-col items-center pt-4 pb-3 gap-3">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B5E]"
          aria-label="Déplier le panneau opérateur"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </button>
        <Zap className="w-4 h-4 text-[#1A6B5E]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: 320 }}
      className="flex-shrink-0 bg-[#141210] border-l border-white/[0.06] flex flex-col overflow-hidden w-[320px]"
    >
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#1A6B5E]" />
            <span className="text-[13px] font-semibold text-white">Opérateur système</span>
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Replier le panneau"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
        <p className="text-[10px] text-gray-500 leading-relaxed">
          Skills = raisonnement IA · Outils = vérifications déterministes. Pas de chat en V1.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Brain className="w-3.5 h-3.5 text-[#1A6B5E]" />
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Skills actives</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills?.items.map((s) => (
              <span
                key={s.name}
                className="text-[10px] font-mono bg-white/5 text-gray-300 px-2 py-0.5 rounded border border-white/10"
              >
                {s.name}
              </span>
            )) ?? (
              <span className="text-[11px] text-gray-600">Chargement…</span>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Wrench className="w-3.5 h-3.5 text-[#E8A020]" />
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Activité pipeline</span>
          </div>
          {activityLoading && <p className="text-[11px] text-gray-600">Chargement…</p>}
          <div className="flex flex-col gap-2">
            {activity?.items.map((item) => (
              <div key={item.id} className="rounded-lg bg-[#1D1A17] border border-white/[0.05] px-2.5 py-2">
                <div className="text-[11px] text-gray-300 font-medium leading-snug">{item.title}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">{formatRelativeTime(item.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>

        <Link href="/app/agents">
          <span className="text-[11px] text-[#1A6B5E] hover:underline cursor-pointer">
            Voir le registre complet →
          </span>
        </Link>
      </div>

      <div className="border-t border-white/[0.06] px-4 py-3">
        <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-2">Actions structurées</div>
        <div className="grid grid-cols-1 gap-1.5">
          {[
            "Importer un document",
            "Relancer extraction",
            "Générer relance FR/AR",
            "Préparer export G50",
          ].map((action) => (
            <button
              key={action}
              type="button"
              disabled
              className="text-[11px] text-gray-500 bg-white/[0.03] border border-white/[0.06] rounded-lg px-2 py-1.5 text-left cursor-not-allowed opacity-70"
              aria-disabled="true"
            >
              {action}
              <span className="ml-1 text-[9px] uppercase text-gray-600">· bientôt</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
