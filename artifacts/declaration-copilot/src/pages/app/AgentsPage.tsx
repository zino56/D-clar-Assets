import { motion } from "framer-motion";
import { Brain, Wrench, ArrowRight, Cpu, Activity } from "lucide-react";
import {
  useGetAgentOverview,
  useListSkills,
  useListTools,
} from "@workspace/api-client-react";
import { AppShell } from "../../components/app/AppShell";
import { PageLoader, ErrorState } from "../../components/app/AsyncStates";

export default function AgentsPage() {
  const { data: overview, isLoading: oLoad, isError: oErr, refetch } = useGetAgentOverview();
  const {
    data: skills,
    isLoading: skillsLoading,
    isError: skillsError,
  } = useListSkills();
  const {
    data: tools,
    isLoading: toolsLoading,
    isError: toolsError,
  } = useListTools();

  if (oLoad) {
    return (
      <AppShell title="AI System" subtitle="Transparence du pipeline">
        <PageLoader />
      </AppShell>
    );
  }

  if (oErr || !overview) {
    return (
      <AppShell title="AI System" subtitle="Erreur">
        <ErrorState message="Impossible de charger le système IA." onRetry={() => refetch()} />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="AI System"
      subtitle="Skills, outils déterministes et orchestration — pas un chatbot"
      hideAgentPanel
    >
      <div className="px-6 py-5 max-w-[1200px] mx-auto flex flex-col gap-6">
        {/* Overview */}
        <div className="bg-gradient-to-br from-[#141210] to-[#1D1A17] rounded-2xl border border-white/[0.08] p-6 text-white">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-5 h-5 text-[#1A6B5E]" />
                <span className="text-[11px] uppercase tracking-wider text-gray-500">Agent principal</span>
              </div>
              <h2 className="text-[22px] font-bold tracking-tight">{overview.name}</h2>
              <p className="text-[13px] text-gray-400 mt-1 max-w-lg">
                Orchestration déclaration G50 — les skills raisonnent, les outils vérifient et décident le statut final.
              </p>
            </div>
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#1A6B5E]/20 text-[#1A6B5E] border border-[#1A6B5E]/30">
              {overview.status === "active" ? "Actif" : overview.status}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Documents analysés", value: overview.documentsAnalyzed },
              { label: "Score readiness moy.", value: `${overview.averageReadinessScore}%` },
              { label: "Anomalies (semaine)", value: overview.anomaliesThisWeek },
              { label: "Skills actives", value: overview.skillsActive ?? 4 },
            ].map((s) => (
              <div key={s.label} className="bg-white/[0.04] rounded-xl px-4 py-3 border border-white/[0.06]">
                <div className="text-[20px] font-bold">{s.value}</div>
                <div className="text-[11px] text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
          <h3 className="text-[14px] font-semibold text-[#1C1A16] mb-4">Comment ça fonctionne</h3>
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            {[
              "Document",
              "OCR",
              "Skill IA",
              "Validation",
              "Checks déterministes",
              "Readiness",
              "Relance",
            ].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-[#F4F3EF] font-medium text-[#1C1A16] border border-black/[0.06]">
                  {step}
                </span>
                {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-[#6B6966]" />}
              </span>
            ))}
          </div>
        </div>

        {/* Skills registry */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-[#1A6B5E]" />
            <h3 className="text-[14px] font-semibold text-[#1C1A16]">Skills Registry</h3>
          </div>
          {skillsError && (
            <p className="text-[12px] text-[#B83232] mb-3">Impossible de charger le registre des skills.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillsLoading && (
              <p className="text-[12px] text-[#6B6966] col-span-2">Chargement des skills…</p>
            )}
            {skills?.items.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-black/[0.06] p-5 hover:border-[#1A6B5E]/25 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <code className="text-[12px] font-mono font-semibold text-[#1A6B5E]">{skill.name}</code>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-green-50 text-[#2F7A4A]">
                    {skill.status}
                  </span>
                </div>
                <h4 className="text-[14px] font-semibold text-[#1C1A16] mb-1">{skill.title}</h4>
                <p className="text-[12px] text-[#6B6966] leading-relaxed mb-3">{skill.description}</p>
                <div className="text-[11px] space-y-1 text-[#6B6966]">
                  <p>
                    <span className="font-medium text-[#1C1A16]">Entrée :</span> {skill.inputSchemaSummary}
                  </p>
                  <p>
                    <span className="font-medium text-[#1C1A16]">Sortie :</span> {skill.outputSchemaSummary}
                  </p>
                  <p>
                    <span className="font-medium text-[#1C1A16]">Quand :</span> {skill.usedWhen}
                  </p>
                </div>
                <span className="inline-block mt-3 text-[10px] text-[#6B6966] bg-[#F4F3EF] px-2 py-0.5 rounded">
                  {skill.stage}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tools registry */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-[#E8A020]" />
            <h3 className="text-[14px] font-semibold text-[#1C1A16]">Deterministic Tools</h3>
          </div>
          {toolsError && (
            <p className="text-[12px] text-[#B83232] mb-3">Impossible de charger le registre des outils.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {toolsLoading && (
              <p className="text-[12px] text-[#6B6966] col-span-full">Chargement des outils…</p>
            )}
            {tools?.items.map((tool) => (
              <div
                key={tool.name}
                className={`rounded-2xl border p-4 ${
                  tool.status === "coming_soon"
                    ? "bg-[#F4F3EF]/50 border-dashed border-black/[0.1] opacity-80"
                    : "bg-white border-black/[0.06]"
                }`}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-[13px] font-semibold text-[#1C1A16]">{tool.title}</span>
                  <span
                    className={`text-[9px] font-bold uppercase ${
                      tool.status === "active" ? "text-[#2F7A4A]" : "text-[#6B6966]"
                    }`}
                  >
                    {tool.status === "coming_soon" ? "Bientôt" : "Actif"}
                  </span>
                </div>
                <p className="text-[11px] text-[#6B6966]">{tool.description}</p>
                {tool.verifies && (
                  <p className="text-[10px] text-[#1A6B5E] mt-2 font-medium">Vérifie : {tool.verifies}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-[#6B6966] flex items-center gap-1.5 pb-4">
          <Activity className="w-3.5 h-3.5" />
          Dernier pipeline : {overview.lastPipelineRun ? new Date(overview.lastPipelineRun).toLocaleString("fr-DZ") : "—"}
          {/* TODO: live Hermes integration */}
        </p>
      </div>
    </AppShell>
  );
}
