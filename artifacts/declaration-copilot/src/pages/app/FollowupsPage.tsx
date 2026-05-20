import { useState } from "react";
import { Link } from "wouter";
import { Copy, Check, MessageSquare, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useListFollowups, type FollowUpMessage, type Severity } from "@workspace/api-client-react";
import { AppShell } from "../../components/app/AppShell";
import { SeverityDot } from "../../components/app/StatusBadge";
import { EmptyState, ErrorState, PageLoader } from "../../components/app/AsyncStates";
import { formatRelativeTime } from "@/lib/format";

const statusConfig = {
  pending: { label: "En attente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  sent: { label: "Envoyé", className: "bg-blue-50 text-blue-700 border-blue-200" },
  resolved: { label: "Résolu", className: "bg-green-50 text-green-700 border-green-200" },
};

function FollowupRow({
  fu,
  selected,
  onSelect,
}: {
  fu: FollowUpMessage;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 border-b border-black/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1A6B5E] ${
        selected ? "bg-[#1A6B5E]/8" : "hover:bg-[#F4F3EF]/60"
      }`}
    >
      <div className="flex items-center gap-2">
        <SeverityDot severity={fu.severity} />
        <span className="text-[13px] font-semibold text-[#1C1A16] truncate">{fu.recipient}</span>
      </div>
      <div className="text-[11px] text-[#6B6966] mt-0.5 truncate">{fu.documentName}</div>
      <div className="flex items-center gap-2 mt-1">
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${statusConfig[fu.status].className}`}>
          {statusConfig[fu.status].label}
        </span>
        <span className="text-[10px] text-[#6B6966]">{formatRelativeTime(fu.createdAt)}</span>
      </div>
    </button>
  );
}

export default function FollowupsPage() {
  const [filter, setFilter] = useState<"ALL" | Severity | "pending" | "sent" | "resolved">("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);

  const query =
    filter === "ALL"
      ? {}
      : filter === "BLOCKING" || filter === "RISK" || filter === "WARNING"
        ? { severity: filter }
        : { status: filter };

  const { data, isLoading, isError, refetch } = useListFollowups(query);
  const items = data?.items ?? [];
  const selected = items.find((f) => f.id === (selectedId ?? items[0]?.id)) ?? items[0];

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  if (isLoading) {
    return (
      <AppShell title="Follow-ups" subtitle="Relances opérationnelles">
        <PageLoader />
      </AppShell>
    );
  }

  return (
    <AppShell title="Follow-ups" subtitle="Revue des relances FR/AR — envoi manuel en V1">
      <div className="px-6 py-5 max-w-[1400px] mx-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { label: "Tous", value: "ALL" as const },
            { label: "Critique", value: "BLOCKING" as const },
            { label: "Risque", value: "RISK" as const },
            { label: "En attente", value: "pending" as const },
            { label: "Envoyé", value: "sent" as const },
            { label: "Résolu", value: "resolved" as const },
          ].map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                filter === f.value
                  ? "bg-[#1A6B5E] text-white border-[#1A6B5E]"
                  : "bg-white text-[#6B6966] border-black/[0.08]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isError && <ErrorState message="Erreur de chargement." onRetry={() => refetch()} />}

        {!isError && items.length === 0 && (
          <EmptyState title="Aucune relance" description="Aucun message dans cette catégorie." icon={MessageSquare} />
        )}

        {!isError && items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 bg-white rounded-2xl border border-black/[0.06] overflow-hidden min-h-[480px]">
            <div className="border-r border-black/[0.06] overflow-y-auto max-h-[70vh]">
              {items.map((fu) => (
                <FollowupRow
                  key={fu.id}
                  fu={fu}
                  selected={selected?.id === fu.id}
                  onSelect={() => setSelectedId(fu.id)}
                />
              ))}
            </div>

            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#1C1A16]">{selected.recipient}</h3>
                    <Link href={`/app/documents/${selected.documentId}`}>
                      <span className="text-[12px] text-[#1A6B5E] hover:underline cursor-pointer flex items-center gap-1 mt-0.5">
                        <Eye className="w-3 h-3" />
                        {selected.documentName}
                      </span>
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReviewed((s) => new Set(s).add(selected.id))}
                    className={`text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                      reviewed.has(selected.id)
                        ? "bg-green-50 text-[#2F7A4A] border-green-200"
                        : "bg-white text-[#1A6B5E] border-[#1A6B5E]/30 hover:bg-[#1A6B5E]/5"
                    }`}
                  >
                    {reviewed.has(selected.id) ? "✓ Revu" : "Marquer revu"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div className="rounded-xl border border-black/[0.06] p-4 bg-[#F4F3EF]/40">
                    <div className="text-[11px] font-semibold text-[#6B6966] mb-2">Français</div>
                    <p className="text-[12px] text-[#6B6966] leading-[1.8] whitespace-pre-line">{selected.fr}</p>
                    <button
                      type="button"
                      onClick={() => copy("fr", selected.fr)}
                      className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#1A6B5E]"
                    >
                      {copied === "fr" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copier
                    </button>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] p-4 bg-[#141210]">
                    <div className="text-[11px] font-semibold text-gray-500 mb-2">العربية</div>
                    <p dir="rtl" className="text-[12px] text-gray-300 leading-[1.9] whitespace-pre-line text-right">
                      {selected.ar}
                    </p>
                    <button
                      type="button"
                      onClick={() => copy("ar", selected.ar)}
                      className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#E8A020]"
                    >
                      {copied === "ar" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      نسخ
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
