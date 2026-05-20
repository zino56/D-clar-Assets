import { Download, FileArchive, Calendar } from "lucide-react";
import { AppShell } from "../../components/app/AppShell";
import { exportPeriodsFixture } from "@/data/fixtures";

export default function ExportsPage() {
  return (
    <AppShell title="Exports" subtitle="Bundles G50 alignés — backend export à venir">
      <div className="px-6 py-5 max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {exportPeriodsFixture.map((period) => (
            <div
              key={period.month}
              className="bg-white rounded-2xl border border-black/[0.06] p-5 hover:border-[#1A6B5E]/25 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A6B5E]/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#1A6B5E]" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[#1C1A16]">{period.month}</div>
                  <div className="text-[11px] text-[#6B6966]">{period.readyCount} docs READY</div>
                </div>
              </div>
              <div className="text-[12px] text-[#6B6966] mb-4">
                HT exportable : <span className="font-semibold text-[#1C1A16]">{period.ht}</span>
              </div>
              <button
                type="button"
                disabled={period.status === "coming_soon"}
                className="flex items-center gap-2 text-[12px] font-medium px-3 py-2 rounded-lg border border-black/[0.08] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F4F3EF] transition-colors"
                title="TODO: G50 export generation"
              >
                <Download className="w-3.5 h-3.5" />
                {period.status === "ready" ? "Télécharger bundle" : "Bientôt disponible"}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-[#141210] rounded-2xl border border-white/[0.08] p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <FileArchive className="w-5 h-5 text-[#E8A020]" />
            <h3 className="text-[14px] font-semibold">Aperçu export G50</h3>
          </div>
          <p className="text-[12px] text-gray-400 leading-relaxed mb-4">
            Structure mensuelle : lignes ventes/achats, TVA collectée et déductible, pièces justificatives indexées.
            L'export final sera généré par l'Export Tool une fois le backend branché.
          </p>
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4 font-mono text-[11px] text-gray-400 space-y-1">
            <div>G50_MAI_2026/</div>
            <div className="pl-3">├── ventes_ready.csv</div>
            <div className="pl-3">├── achats_ready.csv</div>
            <div className="pl-3">├── anomalies_exclues.json</div>
            <div className="pl-3">└── manifest.pdf</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
