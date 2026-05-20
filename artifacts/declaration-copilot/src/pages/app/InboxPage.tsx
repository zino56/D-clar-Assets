import { useState } from "react";
import { Link } from "wouter";
import { Upload, Play, Eye, RotateCcw, Bot, AlertTriangle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "../../components/app/AppShell";
import { StatusBadge, SeverityDot } from "../../components/app/StatusBadge";
import { ScorePill } from "../../components/app/ScorePill";
import { MetricCard } from "../../components/app/MetricCard";
import { ActivityFeed } from "../../components/app/ActivityFeed";
import { documents, kpiSummary, priorityQueue, activityFeed } from "../../data/mockData";
import type { DocStatus } from "../../data/mockData";

const filters: { label: string; value: DocStatus | "ALL" }[] = [
  { label: "Tous", value: "ALL" },
  { label: "Ready", value: "READY" },
  { label: "Incomplete", value: "INCOMPLETE" },
  { label: "Blocked", value: "BLOCKED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Error", value: "ERROR" },
];

export default function InboxPage() {
  const [activeFilter, setActiveFilter] = useState<DocStatus | "ALL">("ALL");

  const filtered = activeFilter === "ALL"
    ? documents
    : documents.filter(d => d.status === activeFilter);

  return (
    <AppShell
      title="Inbox"
      subtitle="Documents en attente d'analyse, de correction ou d'export"
    >
      <div className="px-6 py-5 max-w-[1400px] mx-auto">
        {/* Action row */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <button className="flex items-center gap-2 bg-[#1A6B5E] hover:bg-[#145549] text-white text-[13px] font-medium rounded-xl px-4 py-2 transition-colors">
            <Upload className="w-4 h-4" />
            Importer un document
          </button>
          <button className="flex items-center gap-2 bg-white hover:bg-[#F4F3EF] text-[#1C1A16] text-[13px] font-medium rounded-xl px-4 py-2 border border-black/[0.08] transition-colors">
            <Play className="w-4 h-4 text-[#1A6B5E]" />
            Lancer l'analyse
          </button>
          <div className="flex items-center gap-1.5 ml-auto flex-wrap">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                  activeFilter === f.value
                    ? "bg-[#1A6B5E] text-white border-[#1A6B5E]"
                    : "bg-white text-[#6B6966] border-black/[0.08] hover:border-[#1A6B5E]/40 hover:text-[#1C1A16]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI strip */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-1">
          <MetricCard label="Ready" value={kpiSummary.ready} accent="text-green-700" />
          <MetricCard label="Incomplete" value={kpiSummary.incomplete} accent="text-amber-700" />
          <MetricCard label="Blocked" value={kpiSummary.blocked} accent="text-red-700" />
          <MetricCard label="Processing" value={kpiSummary.processing} accent="text-blue-600" />
          <MetricCard label="Exports ce mois" value={kpiSummary.exportsThisMonth} accent="text-[#1A6B5E]" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
          {/* Table */}
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#1C1A16]">{filtered.length} document{filtered.length !== 1 ? "s" : ""}</span>
              <span className="text-[11px] text-[#6B6966]">Mai 2026</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px]">
                <thead>
                  <tr className="bg-[#F4F3EF]/60">
                    <th className="text-left text-[11px] font-semibold text-[#6B6966] uppercase tracking-wider px-5 py-3">Document</th>
                    <th className="text-left text-[11px] font-semibold text-[#6B6966] uppercase tracking-wider px-3 py-3">Type</th>
                    <th className="text-left text-[11px] font-semibold text-[#6B6966] uppercase tracking-wider px-3 py-3">Fournisseur</th>
                    <th className="text-left text-[11px] font-semibold text-[#6B6966] uppercase tracking-wider px-3 py-3">Date</th>
                    <th className="text-left text-[11px] font-semibold text-[#6B6966] uppercase tracking-wider px-3 py-3">Score</th>
                    <th className="text-left text-[11px] font-semibold text-[#6B6966] uppercase tracking-wider px-3 py-3">Statut</th>
                    <th className="text-left text-[11px] font-semibold text-[#6B6966] uppercase tracking-wider px-3 py-3">Anomalies</th>
                    <th className="text-left text-[11px] font-semibold text-[#6B6966] uppercase tracking-wider px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {filtered.map((doc, i) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                      className="hover:bg-[#F4F3EF]/50 transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#F4F3EF] border border-black/[0.06] flex items-center justify-center flex-shrink-0">
                            <FileText className="w-3.5 h-3.5 text-[#6B6966]" />
                          </div>
                          <Link href={`/app/documents/${doc.id}`}>
                            <span className="text-[13px] font-medium text-[#1C1A16] hover:text-[#1A6B5E] cursor-pointer transition-colors">{doc.filename}</span>
                          </Link>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-[12px] text-[#6B6966]">{doc.type}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-[13px] text-[#1C1A16] font-medium">{doc.supplier}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-[12px] text-[#6B6966]">{doc.date}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <ScorePill score={doc.score} />
                      </td>
                      <td className="px-3 py-3.5">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="px-3 py-3.5">
                        {doc.anomalies > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-[12px] font-medium text-amber-700">{doc.anomalies}</span>
                          </div>
                        ) : (
                          <span className="text-[12px] text-green-600 font-medium">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/app/documents/${doc.id}`}>
                            <button className="flex items-center gap-1 text-[11px] text-[#1A6B5E] font-medium hover:bg-[#1A6B5E]/8 px-2 py-1 rounded-lg transition-colors">
                              <Eye className="w-3.5 h-3.5" /> Voir
                            </button>
                          </Link>
                          <button className="flex items-center gap-1 text-[11px] text-[#6B6966] font-medium hover:bg-black/[0.04] px-2 py-1 rounded-lg transition-colors">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button className="flex items-center gap-1 text-[11px] text-[#6B6966] font-medium hover:bg-black/[0.04] px-2 py-1 rounded-lg transition-colors">
                            <Bot className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Priority queue */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-[13px] font-semibold text-[#1C1A16]">À traiter maintenant</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {priorityQueue.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F4F3EF]/60 border border-black/[0.04]">
                    <SeverityDot severity={item.severity} />
                    <div className="min-w-0">
                      <div className="text-[12px] font-medium text-[#1C1A16] truncate">{item.docName}</div>
                      <div className="text-[11px] text-[#6B6966] mt-0.5">{item.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-4">
              <span className="text-[13px] font-semibold text-[#1C1A16] block mb-3">Activité récente</span>
              <ActivityFeed entries={activityFeed} maxItems={5} />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
