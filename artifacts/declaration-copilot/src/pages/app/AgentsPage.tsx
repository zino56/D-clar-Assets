import { useState } from "react";
import { Play, Plus, FileText, Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "../../components/app/AppShell";
import { agents } from "../../data/mockData";
import type { Agent } from "../../data/mockData";

const statusConfig = {
  idle:    { label: "En veille", dot: "bg-gray-400" },
  running: { label: "En cours",  dot: "bg-green-400 animate-pulse" },
  error:   { label: "Erreur",    dot: "bg-red-500" },
};

const agentColors: Record<string, { bg: string; text: string; lightBg: string }> = {
  "classifier":      { bg: "bg-blue-600",   text: "text-blue-600",   lightBg: "bg-blue-50" },
  "extractor":       { bg: "bg-purple-600", text: "text-purple-600", lightBg: "bg-purple-50" },
  "fiscal-checker":  { bg: "bg-red-600",    text: "text-red-600",    lightBg: "bg-red-50" },
  "followup-writer": { bg: "bg-amber-500",  text: "text-amber-600",  lightBg: "bg-amber-50" },
  "export-agent":    { bg: "bg-green-600",  text: "text-green-600",  lightBg: "bg-green-50" },
  "general-copilot": { bg: "bg-[#1A6B5E]", text: "text-[#1A6B5E]",  lightBg: "bg-teal-50" },
};

function AgentRosterCard({ agent, selected, onSelect }: { agent: Agent; selected: boolean; onSelect: () => void }) {
  const colors = agentColors[agent.id] ?? { bg: "bg-gray-600", text: "text-gray-600", lightBg: "bg-gray-50" };
  const s = statusConfig[agent.status];
  return (
    <motion.div
      whileHover={{ y: -1 }}
      onClick={onSelect}
      className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-sm ${
        selected ? "border-[#1A6B5E] ring-2 ring-[#1A6B5E]/10" : "border-black/[0.06]"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0`}>
          {agent.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-[#1C1A16] truncate">{agent.name}</div>
          <div className="text-[11px] text-[#6B6966] truncate">{agent.role}</div>
        </div>
        {selected && <ChevronRight className="w-4 h-4 text-[#1A6B5E] flex-shrink-0" />}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
        <span className="text-[11px] text-[#6B6966]">{s.label}</span>
        <span className="ml-auto text-[11px] text-[#6B6966]">{agent.usageToday}× aujourd'hui</span>
      </div>

      <div className="flex flex-wrap gap-1">
        {agent.skills.slice(0, 2).map(skill => (
          <span key={skill} className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${colors.lightBg} ${colors.text}`}>
            {skill}
          </span>
        ))}
        {agent.skills.length > 2 && (
          <span className="text-[10px] text-[#6B6966] px-1.5 py-0.5">+{agent.skills.length - 2}</span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-black/[0.04]">
        <p className="text-[11px] text-[#6B6966] truncate">{agent.lastAction}</p>
      </div>
    </motion.div>
  );
}

function AgentWorkspace({ agent }: { agent: Agent }) {
  const [executedTask, setExecutedTask] = useState<string | null>(null);
  const colors = agentColors[agent.id] ?? { bg: "bg-gray-600", text: "text-gray-600", lightBg: "bg-gray-50" };
  const s = statusConfig[agent.status];

  const runTask = (task: string) => {
    setExecutedTask(task);
    setTimeout(() => setExecutedTask(null), 2000);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={agent.id}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden h-full flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-black/[0.06]">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center text-white text-[14px] font-bold`}>
              {agent.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#1C1A16]">{agent.name}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                <span className="text-[12px] text-[#6B6966]">{s.label} · {agent.usageToday} tâches exécutées</span>
              </div>
            </div>
          </div>
          <p className="text-[13px] text-[#6B6966] leading-[1.6]">{agent.description}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Skills */}
          <div>
            <div className="text-[11px] font-semibold text-[#6B6966] uppercase tracking-wider mb-2.5">Compétences disponibles</div>
            <div className="flex flex-wrap gap-2">
              {agent.skills.map(skill => (
                <span key={skill} className={`text-[12px] font-medium px-2.5 py-1 rounded-full border ${colors.lightBg} ${colors.text} border-current/20`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Outputs */}
          <div>
            <div className="text-[11px] font-semibold text-[#6B6966] uppercase tracking-wider mb-2.5">Sorties permises</div>
            <div className="flex flex-wrap gap-2">
              {agent.outputs.map(output => (
                <span key={output} className="text-[12px] font-medium px-2.5 py-1 rounded-full border border-black/[0.08] bg-[#F4F3EF] text-[#6B6966]">
                  {output}
                </span>
              ))}
            </div>
          </div>

          {/* Task composer */}
          <div>
            <div className="text-[11px] font-semibold text-[#6B6966] uppercase tracking-wider mb-2.5">Composer une tâche</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {agent.tasks.map(task => (
                <button
                  key={task}
                  onClick={() => runTask(task)}
                  className={`flex items-center gap-2.5 text-left px-4 py-3 rounded-xl border transition-all group ${
                    executedTask === task
                      ? `${colors.lightBg} border-current/20 ${colors.text}`
                      : "border-black/[0.08] hover:border-[#1A6B5E]/30 hover:bg-[#F4F3EF] bg-white"
                  }`}
                >
                  {executedTask === task ? (
                    <Check className={`w-4 h-4 flex-shrink-0 ${colors.text}`} />
                  ) : (
                    <Play className="w-4 h-4 flex-shrink-0 text-[#6B6966] group-hover:text-[#1A6B5E] transition-colors" />
                  )}
                  <span className="text-[12px] font-medium text-[#1C1A16]">{task}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ExecutionLog({ agent }: { agent: Agent }) {
  return (
    <div className="bg-[#141210] rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3.5 border-b border-white/[0.06] flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[11px] text-gray-400 font-mono ml-2">agent.execution.log</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] flex flex-col gap-2">
        {agent.recentLog.map((entry, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-gray-600 flex-shrink-0">[{entry.time}]</span>
            <span className="text-gray-300 leading-[1.5]">{entry.message}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-[#1A6B5E]">$</span>
          <span className="text-gray-400 animate-pulse">_</span>
        </div>
      </div>

      {/* Quick chips */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider mb-2.5">Chips rapides</div>
        <div className="flex flex-wrap gap-1.5">
          {["NIF manquant", "Expliquer anomalie", "Préparer export", "Rédiger message"].map(chip => (
            <button
              key={chip}
              className="text-[11px] text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/[0.08] rounded-full px-2.5 py-1 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 bg-white/5 rounded-xl border border-white/[0.08] px-3 py-2.5">
          <FileText className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          <input
            className="flex-1 bg-transparent text-[12px] text-gray-300 placeholder:text-gray-600 outline-none"
            placeholder="Décrire une tâche structurée pour l'agent actif…"
          />
        </div>
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const [selectedAgentId, setSelectedAgentId] = useState("general-copilot");
  const selectedAgent = agents.find(a => a.id === selectedAgentId)!;

  return (
    <AppShell
      title="Agents"
      subtitle="Compétences spécialisées pour automatiser la déclaration"
      hideAgentPanel
    >
      <div className="px-6 py-5 max-w-[1600px] mx-auto h-[calc(100vh-64px)] flex flex-col">
        {/* Top actions */}
        <div className="flex items-center gap-3 mb-5">
          <button className="flex items-center gap-2 bg-[#1A6B5E] text-white text-[13px] font-medium rounded-xl px-4 py-2 hover:bg-[#145549] transition-colors">
            <Play className="w-4 h-4" /> Exécuter l'agent actif
          </button>
          <button className="flex items-center gap-2 bg-white text-[#1C1A16] text-[13px] font-medium rounded-xl px-4 py-2 border border-black/[0.08] hover:bg-[#F4F3EF] transition-colors">
            <Plus className="w-4 h-4 text-[#1A6B5E]" /> Nouvelle tâche
          </button>
          <button className="flex items-center gap-2 bg-white text-[#6B6966] text-[13px] font-medium rounded-xl px-4 py-2 border border-black/[0.08] hover:bg-[#F4F3EF] transition-colors">
            <FileText className="w-4 h-4" /> Voir les logs
          </button>
        </div>

        {/* 3-column layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_340px] gap-4 min-h-0">
          {/* Roster */}
          <div className="overflow-y-auto flex flex-col gap-2.5 pr-1">
            {agents.map(agent => (
              <AgentRosterCard
                key={agent.id}
                agent={agent}
                selected={agent.id === selectedAgentId}
                onSelect={() => setSelectedAgentId(agent.id)}
              />
            ))}
          </div>

          {/* Active workspace */}
          <div className="min-h-0">
            <AgentWorkspace agent={selectedAgent} />
          </div>

          {/* Execution log */}
          <div className="min-h-0">
            <ExecutionLog agent={selectedAgent} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
