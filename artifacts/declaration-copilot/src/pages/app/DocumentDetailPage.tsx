import { useParams, Link } from "wouter";
import { ChevronRight, FileText, RotateCcw, Download } from "lucide-react";
import { useGetDocument } from "@workspace/api-client-react";
import { AppShell } from "../../components/app/AppShell";
import { StatusBadge } from "../../components/app/StatusBadge";
import { ScorePill } from "../../components/app/ScorePill";
import { PipelineTimeline } from "../../components/app/PipelineTimeline";
import {
  AnomaliesPanel,
  DeterministicChecksCard,
  ExtractedFieldsPanel,
  FollowUpMessagesPanel,
  ReadinessDecisionCard,
  SkillsUsedCard,
} from "../../components/app/DocumentPanels";
import { ErrorState, PageLoader } from "../../components/app/AsyncStates";

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: doc, isLoading, isError, error, refetch } = useGetDocument(id ?? "");

  if (isLoading) {
    return (
      <AppShell title="Document" subtitle="Chargement…">
        <PageLoader />
      </AppShell>
    );
  }

  if (isError || !doc) {
    return (
      <AppShell title="Document" subtitle="Erreur">
        <ErrorState
          message={error instanceof Error ? error.message : "Document introuvable"}
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      title={doc.filename}
      subtitle={`${doc.documentType} · ${doc.entityName} · ${doc.regime ?? "—"}`}
      hideAgentPanel
    >
      <div className="px-6 py-5 max-w-[1600px] mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 text-[12px] text-[#6B6966]">
            <Link href="/app/inbox">
              <span className="hover:text-[#1A6B5E] cursor-pointer focus:outline-none focus-visible:underline">
                Inbox
              </span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1C1A16] font-medium">{doc.filename}</span>
            <StatusBadge status={doc.status} size="md" />
            <ScorePill score={doc.score} />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled
              className="text-[12px] font-medium text-[#6B6966] bg-[#ECE8E1] border border-black/[0.06] px-3 py-1.5 rounded-lg cursor-not-allowed opacity-70"
              aria-disabled="true"
              title="Relance pipeline — bientôt"
            >
              <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
              Relancer
            </button>
            <button
              type="button"
              disabled
              className="text-[12px] font-medium text-[#6B6966] bg-[#ECE8E1] border border-black/[0.06] px-3 py-1.5 rounded-lg cursor-not-allowed opacity-70"
              aria-disabled="true"
              title="Export G50 — backend à venir"
            >
              <Download className="w-3.5 h-3.5 inline mr-1" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5">
          <div className="flex flex-col gap-5">
            {/* Preview placeholder — TODO: live document preview */}
            <div className="bg-[#ECE8E1] rounded-2xl border border-black/[0.06] aspect-[4/3] max-h-[280px] flex flex-col items-center justify-center relative">
              <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wide text-[#6B6966] bg-white/80 px-2 py-0.5 rounded">
                Aperçu démo
              </span>
              <FileText className="w-12 h-12 text-[#6B6966]/40 mb-2" />
              <span className="text-[13px] font-medium text-[#6B6966]">PDF / image — aperçu non connecté</span>
              <span className="text-[11px] text-[#6B6966]/70 mt-1">{doc.filename}</span>
            </div>

            <ExtractedFieldsPanel fields={doc.extractedFields} />
            <AnomaliesPanel anomalies={doc.anomalies} />
            <FollowUpMessagesPanel followups={doc.followups ?? []} />
          </div>

          <div className="flex flex-col gap-5">
            <ReadinessDecisionCard readiness={doc.readiness} />
            <PipelineTimeline steps={doc.timeline} />
            <SkillsUsedCard skills={doc.skillsUsed} />
            <DeterministicChecksCard checks={doc.deterministicChecks} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
