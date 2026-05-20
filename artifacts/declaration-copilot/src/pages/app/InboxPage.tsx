import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Upload, Play, Eye, Search, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetInboxSummary,
  useListDocuments,
  type DocumentStatus,
} from "@workspace/api-client-react";
import { AppShell } from "../../components/app/AppShell";
import { StatusBadge } from "../../components/app/StatusBadge";
import { ScorePill } from "../../components/app/ScorePill";
import { MetricCard } from "../../components/app/MetricCard";
import { AgentActivityPanel } from "../../components/app/AgentActivityPanel";
import { EmptyState, ErrorState, LoadingSkeleton, PageLoader } from "../../components/app/AsyncStates";
import { formatDate, formatRelativeTime } from "@/lib/format";

const filters: { label: string; value: DocumentStatus | "ALL" }[] = [
  { label: "Tous", value: "ALL" },
  { label: "Ready", value: "READY" },
  { label: "Incomplete", value: "INCOMPLETE" },
  { label: "Blocked", value: "BLOCKED" },
  { label: "Processing", value: "PROCESSING" },
];

const sortOptions = [
  { label: "Plus récent", value: "newest" },
  { label: "Plus ancien", value: "oldest" },
  { label: "Score ↓", value: "score_desc" },
  { label: "Score ↑", value: "score_asc" },
  { label: "Anomalies ↓", value: "anomalies_desc" },
] as const;

export default function InboxPage() {
  const [activeFilter, setActiveFilter] = useState<DocumentStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<(typeof sortOptions)[number]["value"]>("newest");

  const queryParams = useMemo(
    () => ({
      status: activeFilter === "ALL" ? undefined : activeFilter,
      search: search.trim() || undefined,
      sort,
    }),
    [activeFilter, search, sort],
  );

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useGetInboxSummary();
  const { data, isLoading, isError, error, refetch } = useListDocuments(queryParams);

  const kpiValue = (n: number | undefined) =>
    summaryLoading ? "…" : summaryError ? "—" : (n ?? "—");

  return (
    <AppShell
      title="Inbox"
      subtitle="Centre de commande — documents en attente d'analyse, correction ou export G50"
      hideAgentPanel
    >
      <div className="px-6 py-5 max-w-[1600px] mx-auto">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <MetricCard
            label="Documents aujourd'hui"
            value={kpiValue(summary?.documentsToday)}
            accent="text-[#1A6B5E]"
          />
          <MetricCard
            label="Prêts déclaration"
            value={kpiValue(summary?.readyCount)}
            accent="text-[#2F7A4A]"
          />
          <MetricCard
            label="Incomplets"
            value={kpiValue(summary?.incompleteCount)}
            accent="text-[#E8A020]"
          />
          <MetricCard
            label="Bloqués / risque"
            value={kpiValue(summary?.blockedCount)}
            accent="text-[#B83232]"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            type="button"
            disabled
            className="flex items-center gap-2 bg-[#1A6B5E]/40 text-white/80 text-[13px] font-medium rounded-xl px-4 py-2 cursor-not-allowed"
            aria-disabled="true"
            title="Import — disponible après branchement POST /documents/upload"
          >
            <Upload className="w-4 h-4" />
            Importer
            <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">Bientôt</span>
          </button>
          <button
            type="button"
            disabled
            className="flex items-center gap-2 bg-[#ECE8E1] text-[#6B6966] text-[13px] font-medium rounded-xl px-4 py-2 border border-black/[0.06] cursor-not-allowed"
            aria-disabled="true"
            title="Analyse batch — pipeline backend non connecté en V1"
          >
            <Play className="w-4 h-4" />
            Lancer l'analyse
            <span className="text-[10px] font-semibold uppercase tracking-wide">Bientôt</span>
          </button>

          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6966]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher fichier, fournisseur…"
              className="w-full pl-9 pr-3 py-2 text-[13px] bg-white border border-black/[0.08] rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B5E]/40"
              aria-label="Rechercher documents"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6B6966]" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="text-[12px] font-medium bg-white border border-black/[0.08] rounded-lg px-2 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B5E]"
              aria-label="Trier"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 flex-wrap ml-auto">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setActiveFilter(f.value)}
                className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B5E] ${
                  activeFilter === f.value
                    ? "bg-[#1A6B5E] text-white border-[#1A6B5E]"
                    : "bg-white text-[#6B6966] border-black/[0.08] hover:border-[#1A6B5E]/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
          {/* Queue */}
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden min-h-[400px]">
            <div className="px-5 py-3.5 border-b border-black/[0.06] flex justify-between items-center">
              <span className="text-[13px] font-semibold text-[#1C1A16]">
                {isLoading ? "…" : `${data?.total ?? 0} document${data?.total !== 1 ? "s" : ""}`}
              </span>
              {(summary?.processingCount ?? 0) > 0 && (
                <span className="text-[11px] text-blue-600 font-medium">
                  {summary?.processingCount} en traitement
                </span>
              )}
            </div>

            {isLoading && (
              <div className="p-5">
                <LoadingSkeleton rows={8} />
              </div>
            )}
            {isError && (
              <ErrorState
                message={error instanceof Error ? error.message : "Erreur réseau"}
                onRetry={() => refetch()}
              />
            )}
            {!isLoading && !isError && data?.items.length === 0 && (
              <EmptyState
                title="Aucun document"
                description="Ajustez les filtres ou importez une facture pour démarrer le pipeline."
              />
            )}
            {!isLoading && !isError && (data?.items.length ?? 0) > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-[#F4F3EF]/60 border-b border-black/[0.06]">
                      {["Fichier", "Entité", "Type", "Score", "Anomalies", "Date", "Statut", ""].map((h) => (
                        <th
                          key={h}
                          className="text-left text-[10px] font-semibold text-[#6B6966] uppercase tracking-wider px-4 py-2.5"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04]">
                    {data?.items.map((doc, i) => (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-[#F4F3EF]/50 transition-colors group"
                      >
                        <td className="px-4 py-3">
                          <Link href={`/app/documents/${doc.id}`}>
                            <span className="text-[13px] font-medium text-[#1C1A16] group-hover:text-[#1A6B5E] cursor-pointer">
                              {doc.filename}
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-[#6B6966]">{doc.entityName}</td>
                        <td className="px-4 py-3 text-[12px] text-[#6B6966]">{doc.documentType}</td>
                        <td className="px-4 py-3">
                          <ScorePill score={doc.score} />
                        </td>
                        <td className="px-4 py-3">
                          {doc.anomalyCount > 0 ? (
                            <span className="text-[12px] font-semibold text-[#B83232]">{doc.anomalyCount}</span>
                          ) : (
                            <span className="text-[12px] text-[#2F7A4A]">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[11px] text-[#6B6966]" title={formatDate(doc.createdAt)}>
                          {formatRelativeTime(doc.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={doc.status} />
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/app/documents/${doc.id}`}>
                            <button
                              type="button"
                              className="p-1.5 rounded-lg hover:bg-[#1A6B5E]/10 text-[#1A6B5E] opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B5E]"
                              aria-label={`Ouvrir ${doc.filename}`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <AgentActivityPanel />
        </div>
      </div>
    </AppShell>
  );
}
