import { Link } from "wouter";
import { motion } from "framer-motion";
import { Download, TrendingUp, AlertTriangle } from "lucide-react";
import { useListDocuments, type DocumentSummary } from "@workspace/api-client-react";
import { AppShell } from "../../components/app/AppShell";
import { ScorePill } from "../../components/app/ScorePill";
import { MetricCard } from "../../components/app/MetricCard";
import { PageLoader, ErrorState } from "../../components/app/AsyncStates";

const MONTH = "Mai 2026";

function BoardCard({ doc }: { doc: DocumentSummary }) {
  const reason =
    doc.status === "READY"
      ? "Champs complets — exportable G50"
      : doc.status === "BLOCKED" || doc.status === "ERROR"
        ? "Bloquant — non exportable"
        : `${doc.anomalyCount} point(s) à corriger`;

  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl border border-black/[0.06] p-4 hover:shadow-sm transition-all">
      <Link href={`/app/documents/${doc.id}`}>
        <span className="text-[12px] font-medium text-[#1C1A16] hover:text-[#1A6B5E] cursor-pointer block mb-2">
          {doc.filename}
        </span>
      </Link>
      <div className="text-[11px] text-[#6B6966] mb-2">{doc.entityName}</div>
      <div className="h-1.5 bg-[#ECE8E1] rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full ${
            doc.score >= 80 ? "bg-[#2F7A4A]" : doc.score >= 50 ? "bg-[#E8A020]" : "bg-[#B83232]"
          }`}
          style={{ width: `${doc.score}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <ScorePill score={doc.score} />
        {doc.anomalyCount > 0 && (
          <span className="flex items-center gap-0.5 text-amber-700 text-[10px] font-medium">
            <AlertTriangle className="w-3 h-3" />
            {doc.anomalyCount}
          </span>
        )}
      </div>
      <p className="text-[10px] text-[#6B6966] mt-2">{reason}</p>
    </motion.div>
  );
}

function Column({
  title,
  docs,
  dot,
}: {
  title: string;
  docs: DocumentSummary[];
  dot: string;
}) {
  return (
    <div className="flex-1 min-w-[220px]">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="text-[12px] font-semibold text-[#1C1A16]">{title}</span>
        <span className="text-[11px] text-[#6B6966] ml-auto">{docs.length}</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {docs.map((d) => (
          <BoardCard key={d.id} doc={d} />
        ))}
        {docs.length === 0 && (
          <div className="py-8 text-center text-[12px] text-[#6B6966] border border-dashed border-black/[0.08] rounded-xl">
            Aucun document
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReadinessPage() {
  const { data, isLoading, isError, refetch } = useListDocuments({ sort: "score_desc" });

  const ready = data?.items.filter((d) => d.status === "READY") ?? [];
  const incomplete = data?.items.filter((d) => d.status === "INCOMPLETE") ?? [];
  const blocked = data?.items.filter((d) => d.status === "BLOCKED" || d.status === "ERROR") ?? [];
  const avg =
    data && data.items.length
      ? Math.round(data.items.reduce((a, d) => a + d.score, 0) / data.items.length)
      : 0;

  if (isLoading) {
    return (
      <AppShell title="Readiness Board" subtitle={MONTH}>
        <PageLoader />
      </AppShell>
    );
  }

  if (isError) {
    return (
      <AppShell title="Readiness Board" subtitle="Erreur">
        <ErrorState message="Impossible de charger le board." onRetry={() => refetch()} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Readiness Board" subtitle={`Vue déclaration G50 — ${MONTH}`}>
      <div className="px-6 py-5 max-w-[1400px] mx-auto">
        <div className="flex justify-between mb-5 flex-wrap gap-3">
          <span className="text-[13px] font-medium text-[#6B6966]">Période : {MONTH}</span>
          <button
            type="button"
            disabled
            className="flex items-center gap-2 bg-[#1A6B5E]/40 text-white/90 text-[13px] font-medium rounded-xl px-4 py-2 cursor-not-allowed"
            aria-disabled="true"
            title="Export G50 — backend à venir"
          >
            <Download className="w-4 h-4" /> Exporter G50
            <span className="text-[10px] uppercase font-semibold opacity-80">Bientôt</span>
          </button>
        </div>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
          <MetricCard label="READY" value={ready.length} accent="text-[#2F7A4A]" />
          <MetricCard label="INCOMPLETE" value={incomplete.length} accent="text-[#E8A020]" />
          <MetricCard label="BLOQUÉ" value={blocked.length} accent="text-[#B83232]" />
          <MetricCard label="Score moyen" value={`${avg}%`} accent="text-[#1A6B5E]" />
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-[#1A6B5E]" />
            <span className="text-[14px] font-semibold text-[#1C1A16]">Board par statut — {MONTH}</span>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-2">
            <Column title="READY" docs={ready} dot="bg-[#2F7A4A]" />
            <Column title="INCOMPLETE" docs={incomplete} dot="bg-[#E8A020]" />
            <Column title="BLOQUÉ / ERREUR" docs={blocked} dot="bg-[#B83232]" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
