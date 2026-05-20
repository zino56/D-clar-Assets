import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Zap, CheckCircle, Clock } from "lucide-react";
import { agents } from "../../data/mockData";
import type { Agent } from "../../data/mockData";

const agentColors: Record<string, string> = {
  "classifier":      "bg-blue-900/40 text-blue-300",
  "extractor":       "bg-purple-900/40 text-purple-300",
  "fiscal-checker":  "bg-red-900/40 text-red-300",
  "followup-writer": "bg-amber-900/40 text-amber-300",
  "export-agent":    "bg-green-900/40 text-green-300",
  "general-copilot": "bg-teal-900/40 text-teal-300",
};

const statusDot: Record<Agent["status"], { color: string; label: string }> = {
  idle:    { color: "bg-gray-500", label: "En veille" },
  running: { color: "bg-green-400 animate-pulse", label: "En cours" },
  error:   { color: "bg-red-500", label: "Erreur" },
};

function AgentTab({ agent, active, onClick }: { agent: Agent; active: boolean; onClick: () => void }) {
  const colorClass = agentColors[agent.id] ?? "bg-gray-800 text-gray-300";
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 flex items-center gap-2.5 ${
        active ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      <div className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${colorClass}`}>
        {agent.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-medium text-gray-200 truncate">{agent.name}</div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[agent.status].color}`} />
          <span className="text-[10px] text-gray-500">{statusDot[agent.status].label}</span>
        </div>
      </div>
    </button>
  );
}

export function AgentPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState("general-copilot");
  const [copiedTask, setCopiedTask] = useState<string | null>(null);

  const activeAgent = agents.find(a => a.id === activeAgentId)!;

  const handleTask = (task: string) => {
    setCopiedTask(task);
    setTimeout(() => setCopiedTask(null), 1500);
  };

  if (collapsed) {
    return (
      <div className="w-12 flex-shrink-0 bg-[#141210] border-l border-white/[0.06] flex flex-col items-center pt-4 pb-3 gap-3">
        <button
          onClick={() => setCollapsed(false)}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </button>
        <div className="flex-1 flex flex-col items-center gap-2 mt-2">
          {agents.map((a) => (
            <button
              key={a.id}
              onClick={() => { setActiveAgentId(a.id); setCollapsed(false); }}
              title={a.name}
              className={`w-7 h-7 rounded flex items-center justify-center text-[9px] font-bold transition-colors ${agentColors[a.id] ?? "bg-gray-800 text-gray-300"}`}
            >
              {a.name.charAt(0)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: 360 }}
      className="flex-shrink-0 bg-[#141210] border-l border-white/[0.06] flex flex-col overflow-hidden"
      style={{ width: 360 }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#1A6B5E]" />
          <span className="text-[13px] font-semibold text-white">Agent Workspace</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${
              agents.some(a => a.status === "running") ? "bg-green-400 animate-pulse" : "bg-gray-500"
            }`} />
            <span className="text-[11px] text-gray-400">
              {agents.some(a => a.status === "running") ? "En cours" : "En veille"}
            </span>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-colors ml-1"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Agent tabs */}
      <div className="px-2 py-2 border-b border-white/[0.06] flex flex-col gap-0.5 max-h-[240px] overflow-y-auto">
        {agents.map((agent) => (
          <AgentTab
            key={agent.id}
            agent={agent}
            active={agent.id === activeAgentId}
            onClick={() => setActiveAgentId(agent.id)}
          />
        ))}
      </div>

      {/* Active agent workspace */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeAgentId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4"
        >
          {/* Agent header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold ${agentColors[activeAgent.id] ?? "bg-gray-800 text-gray-300"}`}>
                {activeAgent.name.charAt(0)}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white">{activeAgent.name}</div>
                <div className="text-[11px] text-gray-400">{activeAgent.role}</div>
              </div>
            </div>
            <p className="text-[12px] text-gray-400 leading-[1.6] mt-2">{activeAgent.description}</p>
          </div>

          {/* Skills */}
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Compétences</div>
            <div className="flex flex-wrap gap-1.5">
              {activeAgent.skills.map((skill) => (
                <span key={skill} className="text-[11px] bg-white/5 text-gray-300 px-2 py-0.5 rounded-full border border-white/10">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Recent log */}
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Activité récente</div>
            <div className="flex flex-col gap-2">
              {activeAgent.recentLog.map((entry, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[10px] text-gray-600 font-mono mt-0.5 flex-shrink-0">[{entry.time}]</span>
                  <span className="text-[11px] text-gray-400 leading-[1.5]">{entry.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Task composer */}
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Tâches structurées</div>
            <div className="flex flex-col gap-1.5">
              {activeAgent.tasks.map((task) => (
                <button
                  key={task}
                  onClick={() => handleTask(task)}
                  className="flex items-center gap-2 text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/[0.06] transition-colors group"
                >
                  {copiedTask === task ? (
                    <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                  ) : (
                    <Clock className="w-3 h-3 text-gray-500 flex-shrink-0 group-hover:text-gray-300" />
                  )}
                  <span className="text-[12px] text-gray-300">{task}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom quick actions */}
      <div className="border-t border-white/[0.06] px-4 py-3">
        <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-2">Actions rapides</div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            "Classer le doc actif",
            "Relire anomalies",
            "Générer message FR/AR",
            "Préparer export G50",
          ].map((action) => (
            <button
              key={action}
              className="text-[11px] text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/[0.06] rounded-lg px-2 py-1.5 text-left transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
