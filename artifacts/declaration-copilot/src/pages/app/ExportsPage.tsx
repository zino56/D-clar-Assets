import { Download, FileText, FileSpreadsheet, List } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "../../components/app/AppShell";
import { StatusBadge } from "../../components/app/StatusBadge";
import { MetricCard } from "../../components/app/MetricCard";
import { readinessReady, kpiSummary } from "../../data/mockData";

export default function ExportsPage() {
  return (
    <AppShell
      title="Exports"
      subtitle="Préparation des lots prêts pour G50"
    >
      <div className="px-6 py-5 max-w-[1400px] mx-auto">
        {/* Actions */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#6B6966]">Période :</span>
            <button className="text-[13px] font-semibold text-[#1C1A16] bg-white border border-black/[0.08] rounded-lg px-3 py-1.5 hover:bg-[#F4F3EF]">
              Mai 2026 ▾
            </button>
          </div>
          <button className="flex items-center gap-2 bg-[#1A6B5E] text-white text-[13px] font-medium rounded-xl px-4 py-2 hover:bg-[#145549] transition-colors">
            <Download className="w-4 h-4" /> Générer export
          </button>
        </div>

        {/* KPIs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
          <MetricCard label="Docs READY" value={kpiSummary.ready} accent="text-green-700" />
          <MetricCard label="Total HT" value={`${(kpiSummary.totalHTMai / 1e6).toFixed(2)}M DA`} accent="text-[#1C1A16]" />
          <MetricCard label="Total TVA" value={`${(kpiSummary.totalTVAMai / 1000).toFixed(0)}k DA`} accent="text-[#1A6B5E]" />
          <MetricCard label="Total TTC" value={`${(kpiSummary.totalTTCMai / 1e6).toFixed(2)}M DA`} accent="text-[#1C1A16]" />
          <MetricCard label="Complétude" value={`${kpiSummary.exportCompleteness}%`} accent="text-[#E8A020]" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
          {/* Export table */}
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#1C1A16]">{readinessReady.length} documents exportables</span>
              <span className="text-[11px] text-[#6B6966]">READY uniquement</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-[#F4F3EF]/60">
                    {["Document", "Fournisseur", "Type", "HT", "TVA", "TTC", "Statut"].map(h => (
                      <th key={h} className="text-left text-[10px] font-semibold text-[#6B6966] uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {readinessReady.map((doc, i) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-[#F4F3EF]/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-[12px] font-medium text-[#1C1A16]">{doc.filename}</td>
                      <td className="px-4 py-3 text-[12px] text-[#6B6966]">{doc.supplier}</td>
                      <td className="px-4 py-3 text-[12px] text-[#6B6966]">{doc.type}</td>
                      <td className="px-4 py-3 text-[12px] text-[#1C1A16] font-medium text-right">{doc.amount.ht.toLocaleString("fr-DZ")}</td>
                      <td className="px-4 py-3 text-[12px] text-[#1C1A16] text-right">{doc.amount.tva.toLocaleString("fr-DZ")}</td>
                      <td className="px-4 py-3 text-[12px] text-[#1C1A16] font-semibold text-right">{doc.amount.ttc.toLocaleString("fr-DZ")}</td>
                      <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#F4F3EF]/60 border-t border-black/[0.06]">
                    <td colSpan={3} className="px-4 py-3 text-[12px] font-semibold text-[#1C1A16]">Totaux</td>
                    <td className="px-4 py-3 text-[12px] font-bold text-[#1C1A16] text-right">
                      {readinessReady.reduce((s, d) => s + d.amount.ht, 0).toLocaleString("fr-DZ")}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-bold text-[#1C1A16] text-right">
                      {readinessReady.reduce((s, d) => s + d.amount.tva, 0).toLocaleString("fr-DZ")}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-bold text-[#1C1A16] text-right">
                      {readinessReady.reduce((s, d) => s + d.amount.ttc, 0).toLocaleString("fr-DZ")}
                    </td>
                    <td className="px-4 py-3" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">
            {/* Summary card */}
            <div className="bg-[#141210] rounded-2xl p-5 text-white">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Résumé Mai 2026</div>
              <div className="text-[15px] font-bold text-white mb-4">Bundle d'export</div>
              {[
                { label: "Docs READY inclus", value: `${kpiSummary.ready}` },
                { label: "Incomplets exclus", value: `${kpiSummary.incomplete}`, accent: "text-amber-400" },
                { label: "Bloqués exclus", value: `${kpiSummary.blocked}`, accent: "text-red-400" },
                { label: "Complétude estimée", value: `${kpiSummary.exportCompleteness}%`, accent: "text-[#1A6B5E]" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0">
                  <span className="text-[12px] text-gray-400">{item.label}</span>
                  <span className={`text-[13px] font-semibold ${item.accent ?? "text-white"}`}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Download cards */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-4">
              <div className="text-[13px] font-semibold text-[#1C1A16] mb-3">Artefacts d'export</div>
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: FileSpreadsheet, label: "Export Excel G50", sub: "Toutes lignes READY", color: "text-green-600" },
                  { icon: FileText, label: "Résumé readiness PDF", sub: "Rapport comptable", color: "text-red-500" },
                  { icon: List, label: "Liste relances en attente", sub: "14 fournisseurs", color: "text-amber-600" },
                ].map(({ icon: Icon, label, sub, color }) => (
                  <button
                    key={label}
                    className="flex items-center gap-3 p-3 rounded-xl border border-black/[0.06] hover:bg-[#F4F3EF] hover:border-[#1A6B5E]/30 transition-all group"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-[#F4F3EF] flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-[12px] font-semibold text-[#1C1A16]">{label}</div>
                      <div className="text-[11px] text-[#6B6966]">{sub}</div>
                    </div>
                    <Download className="w-3.5 h-3.5 text-[#6B6966] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
