import { Link } from "wouter";
import { motion } from "framer-motion";
import { Download, TrendingUp, AlertTriangle, FileText } from "lucide-react";
import { AppShell } from "../../components/app/AppShell";
import { StatusBadge } from "../../components/app/StatusBadge";
import { ScorePill } from "../../components/app/ScorePill";
import { MetricCard } from "../../components/app/MetricCard";
import { readinessReady, readinessIncomplete, readinessBlocked, kpiSummary } from "../../data/mockData";
import type { Document } from "../../data/mockData";

function KanbanCard({ doc }: { doc: Document }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-black/[0.06] p-4 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[12px] font-medium text-[#1C1A16] leading-[1.4] flex-1">{doc.filename}</span>
        <ScorePill score={doc.score} />
      </div>
      <div className="text-[11px] text-[#6B6966] mb-2">{doc.supplier}</div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#6B6966]">{doc.amount.ttc.toLocaleString("fr-DZ")} DA</span>
        {doc.anomalies > 0 && (
          <div className="flex items-center gap-1 text-amber-600">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-[10px] font-medium">{doc.anomalies}</span>
          </div>
        )}
      </div>
      {doc.status === "INCOMPLETE" && (
        <div className="mt-2 text-[10px] text-amber-600 font-medium">
          {doc.anomalies} éléments manquants
        </div>
      )}
      {(doc.status === "BLOCKED" || doc.status === "ERROR") && (
        <div className="mt-2 text-[10px] text-red-600 font-medium">
          Bloqué — non exportable
        </div>
      )}
    </motion.div>
  );
}

function KanbanColumn({ title, docs, accentClass, count }: {
  title: string; docs: Document[]; accentClass: string; count: number;
}) {
  return (
    <div className="flex-1 min-w-[240px]">
      <div className={`flex items-center gap-2 mb-3 px-1`}>
        <div className={`w-2 h-2 rounded-full ${accentClass}`} />
        <span className="text-[12px] font-semibold text-[#1C1A16]">{title}</span>
        <span className="text-[11px] text-[#6B6966] ml-auto">{count}</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {docs.map(doc => <KanbanCard key={doc.id} doc={doc} />)}
        {docs.length === 0 && (
          <div className="text-center py-8 text-[12px] text-[#6B6966] bg-[#F4F3EF]/50 rounded-xl border border-dashed border-black/[0.08]">
            Aucun document
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReadinessPage() {
  const totalTVA = 416300;
  const totalTVADed = 95550;

  return (
    <AppShell
      title="Readiness Board"
      subtitle="Vue mensuelle des documents prêts pour déclaration G50"
    >
      <div className="px-6 py-5 max-w-[1400px] mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-[#6B6966]">Période :</span>
            <button className="text-[13px] font-semibold text-[#1C1A16] bg-white border border-black/[0.08] rounded-lg px-3 py-1.5 hover:bg-[#F4F3EF] transition-colors">
              Mai 2026 ▾
            </button>
          </div>
          <button className="flex items-center gap-2 bg-[#1A6B5E] text-white text-[13px] font-medium rounded-xl px-4 py-2 hover:bg-[#145549] transition-colors">
            <Download className="w-4 h-4" /> Exporter G50
          </button>
        </div>

        {/* KPI strip */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
          <MetricCard label="Docs READY" value={kpiSummary.ready} accent="text-green-700" />
          <MetricCard label="Incomplets" value={kpiSummary.incomplete} accent="text-amber-700" />
          <MetricCard label="Bloqués" value={kpiSummary.blocked} accent="text-red-700" />
          <MetricCard label="Score moyen" value={`${kpiSummary.avgScore}%`} accent="text-[#1A6B5E]" />
          <MetricCard
            label="Total HT exportable"
            value={`${(kpiSummary.totalHTMai / 1000000).toFixed(2)}M DA`}
            accent="text-[#1C1A16]"
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
          {/* Kanban */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-[#1A6B5E]" />
              <span className="text-[14px] font-semibold text-[#1C1A16]">Tableau de readiness — Mai 2026</span>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-2">
              <KanbanColumn title="READY" docs={readinessReady} accentClass="bg-green-500" count={readinessReady.length} />
              <KanbanColumn title="INCOMPLETE" docs={readinessIncomplete} accentClass="bg-amber-500" count={readinessIncomplete.length} />
              <KanbanColumn title="BLOQUÉ / ERREUR" docs={readinessBlocked} accentClass="bg-red-500" count={readinessBlocked.length} />
            </div>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">
            {/* Period summary */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-4">
              <div className="text-[13px] font-semibold text-[#1C1A16] mb-4">Résumé Mai 2026</div>
              {[
                { label: "Docs ventes", value: "18" },
                { label: "Docs achats", value: "26" },
                { label: "TVA à déclarer", value: `${totalTVA.toLocaleString("fr-DZ")} DA` },
                { label: "TVA déductible", value: `${totalTVADed.toLocaleString("fr-DZ")} DA` },
                { label: "Docs bloquants", value: `${kpiSummary.blocked}` },
                { label: "Readiness", value: `${kpiSummary.exportCompleteness}%` },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-black/[0.04] last:border-0">
                  <span className="text-[12px] text-[#6B6966]">{item.label}</span>
                  <span className="text-[13px] font-semibold text-[#1C1A16]">{item.value}</span>
                </div>
              ))}
            </div>

            {/* G50 Export teaser */}
            <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
              <div className="px-4 py-3 border-b border-black/[0.06] flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#1C1A16]">Aperçu export G50</span>
                <Link href="/app/exports">
                  <span className="text-[11px] text-[#1A6B5E] font-medium hover:underline cursor-pointer">Ouvrir export →</span>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] min-w-[340px]">
                  <thead>
                    <tr className="bg-[#F4F3EF]/60">
                      <th className="text-left text-[10px] font-semibold text-[#6B6966] uppercase tracking-wider px-4 py-2">Fournisseur</th>
                      <th className="text-right text-[10px] font-semibold text-[#6B6966] uppercase tracking-wider px-3 py-2">HT</th>
                      <th className="text-right text-[10px] font-semibold text-[#6B6966] uppercase tracking-wider px-3 py-2">TVA</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04]">
                    {readinessReady.slice(0, 4).map(doc => (
                      <tr key={doc.id} className="hover:bg-[#F4F3EF]/40 transition-colors">
                        <td className="px-4 py-2 font-medium text-[#1C1A16] truncate max-w-[100px]">{doc.supplier}</td>
                        <td className="px-3 py-2 text-right text-[#6B6966]">{(doc.amount.ht / 1000).toFixed(0)}k</td>
                        <td className="px-3 py-2 text-right text-[#6B6966]">{(doc.amount.tva / 1000).toFixed(1)}k</td>
                        <td className="px-3 py-2"><StatusBadge status={doc.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
