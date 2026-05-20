import { Copy, Check, Brain, Wrench } from "lucide-react";
import { useState } from "react";
import type {
  Anomaly,
  DeterministicCheck,
  ExtractedField,
  FollowUpMessage,
  ReadinessDecision,
  SkillRun,
} from "@workspace/api-client-react";
import { SeverityDot } from "./StatusBadge";
import { ScorePill } from "./ScorePill";
import { StatusBadge } from "./StatusBadge";

export function ExtractedFieldsPanel({ fields }: { fields: ExtractedField[] }) {
  const groups = [...new Set(fields.map((f) => f.group ?? "Général"))];
  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-5">
      <h3 className="text-[13px] font-semibold text-[#1C1A16] mb-4">Champs extraits</h3>
      {groups.map((group) => (
        <div key={group} className="mb-4 last:mb-0">
          <div className="text-[10px] font-semibold text-[#6B6966] uppercase tracking-wider mb-2">{group}</div>
          {fields
            .filter((f) => (f.group ?? "Général") === group)
            .map((f) => (
              <div
                key={f.key}
                className={`flex justify-between py-2.5 border-b border-black/[0.04] last:border-0 ${
                  f.missing ? "bg-red-50/50 -mx-3 px-3 rounded-lg" : ""
                }`}
              >
                <span className="text-[12px] text-[#6B6966] font-medium">{f.label}</span>
                {f.missing ? (
                  <span className="text-[12px] font-semibold text-[#B83232]">Manquant</span>
                ) : (
                  <span className="text-[13px] font-medium text-[#1C1A16] text-right">{f.value}</span>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export function AnomaliesPanel({ anomalies }: { anomalies: Anomaly[] }) {
  if (anomalies.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-black/[0.06] p-5">
        <h3 className="text-[13px] font-semibold text-[#1C1A16] mb-2">Anomalies</h3>
        <p className="text-[12px] text-[#2F7A4A] font-medium">Aucune anomalie détectée</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-5">
      <h3 className="text-[13px] font-semibold text-[#1C1A16] mb-4">Anomalies fiscales</h3>
      <div className="flex flex-col gap-3">
        {anomalies.map((a) => (
          <div
            key={a.code}
            className="rounded-xl border border-black/[0.06] p-3.5 hover:border-[#1A6B5E]/20 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <SeverityDot severity={a.severity} />
              <code className="text-[11px] font-mono font-semibold text-[#1C1A16]">{a.code}</code>
              <span className="text-[10px] text-[#6B6966] ml-auto">{a.impact}</span>
            </div>
            <p className="text-[12px] text-[#6B6966] leading-relaxed">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FollowUpMessagesPanel({ followups }: { followups: FollowUpMessage[] }) {
  const [copied, setCopied] = useState<string | null>(null);
  const fu = followups[0];
  if (!fu) {
    return (
      <div className="bg-white rounded-2xl border border-black/[0.06] p-5">
        <h3 className="text-[13px] font-semibold text-[#1C1A16]">Relances</h3>
        <p className="text-[12px] text-[#6B6966] mt-2">Aucune relance requise pour ce document.</p>
      </div>
    );
  }

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
      <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-[#1C1A16]">Relances bilingues</h3>
        <SeverityDot severity={fu.severity} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black/[0.06]">
        <div className="p-4">
          <div className="text-[11px] font-semibold text-[#6B6966] mb-2">Français</div>
          <p className="text-[12px] text-[#6B6966] leading-[1.75] whitespace-pre-line bg-[#F4F3EF]/60 rounded-xl p-3">
            {fu.fr}
          </p>
          <button
            type="button"
            onClick={() => copy("fr", fu.fr)}
            className="mt-2 flex items-center gap-1 text-[11px] font-medium text-[#1A6B5E] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B5E] rounded"
          >
            {copied === "fr" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            Copier
          </button>
        </div>
        <div className="p-4 bg-[#141210]">
          <div className="text-[11px] font-semibold text-gray-500 mb-2">العربية</div>
          <p
            dir="rtl"
            className="text-[12px] text-gray-300 leading-[1.9] whitespace-pre-line bg-white/[0.04] rounded-xl p-3 text-right font-[inherit]"
          >
            {fu.ar}
          </p>
          <button
            type="button"
            onClick={() => copy("ar", fu.ar)}
            className="mt-2 flex items-center gap-1 text-[11px] font-medium text-[#E8A020] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] rounded"
          >
            {copied === "ar" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            نسخ
          </button>
        </div>
      </div>
    </div>
  );
}

export function SkillsUsedCard({ skills }: { skills: SkillRun[] }) {
  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-[#1A6B5E]" />
        <h3 className="text-[13px] font-semibold text-[#1C1A16]">Skills utilisées</h3>
      </div>
      <div className="flex flex-col gap-3">
        {skills.map((s) => (
          <div key={s.name} className="rounded-xl bg-[#F4F3EF]/50 border border-black/[0.04] p-3.5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <code className="text-[11px] font-mono font-semibold text-[#1A6B5E]">{s.name}</code>
              <span
                className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  s.status === "success"
                    ? "bg-green-100 text-[#2F7A4A]"
                    : s.status === "warning"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-[#B83232]"
                }`}
              >
                {s.status}
              </span>
            </div>
            <p className="text-[11px] text-[#6B6966] mb-2">{s.role}</p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-[#6B6966]">Entrée</span>
                <p className="text-[#1C1A16] font-medium mt-0.5">{s.inputSummary}</p>
              </div>
              <div>
                <span className="text-[#6B6966]">Sortie</span>
                <p className="text-[#1C1A16] font-medium mt-0.5">{s.outputSummary}</p>
              </div>
            </div>
            {s.confidence != null && (
              <p className="text-[10px] text-[#6B6966] mt-2">Confiance : {Math.round(s.confidence * 100)}%</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeterministicChecksCard({ checks }: { checks: DeterministicCheck[] }) {
  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="w-4 h-4 text-[#E8A020]" />
        <h3 className="text-[13px] font-semibold text-[#1C1A16]">Vérifications déterministes</h3>
      </div>
      <div className="flex flex-col gap-2.5">
        {checks.map((c) => (
          <div key={c.name} className="flex gap-3 p-3 rounded-xl border border-black/[0.05] hover:bg-[#F4F3EF]/40 transition-colors">
            <div
              className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                c.result === "passed" ? "bg-[#2F7A4A]" : c.result === "failed" ? "bg-[#B83232]" : "bg-[#E8A020]"
              }`}
            />
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-[#1C1A16]">{c.name}</div>
              <div className="text-[11px] text-[#6B6966]">{c.verified} → {c.result}</div>
              <p className="text-[10px] text-[#6B6966] mt-1">{c.rationale}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReadinessDecisionCard({ readiness }: { readiness: ReadinessDecision }) {
  return (
    <div className="bg-gradient-to-br from-[#141210] to-[#1D1A17] rounded-2xl border border-white/[0.08] p-5 text-white">
      <h3 className="text-[13px] font-semibold text-gray-200 mb-4">Décision readiness</h3>
      <div className="flex items-end gap-3 mb-4">
        <span className="text-[42px] font-bold leading-none tracking-tight">{readiness.score}</span>
        <span className="text-[14px] text-gray-500 pb-1">/ 100</span>
        <div className="ml-auto">
          <StatusBadge status={readiness.status} size="md" />
        </div>
      </div>
      <div className="mb-4">
        <ScorePill score={readiness.score} />
      </div>
      {readiness.blockingFields.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">Champs bloquants</div>
          <ul className="text-[12px] text-red-300 space-y-0.5">
            {readiness.blockingFields.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
        </div>
      )}
      {readiness.warnings.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">Alertes</div>
          <ul className="text-[11px] text-amber-200/90 space-y-0.5 font-mono">
            {readiness.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-white/[0.08]">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Action recommandée</div>
        <p className="text-[13px] text-[#E8A020] font-medium leading-snug">{readiness.nextAction}</p>
      </div>
    </div>
  );
}
