import { useState } from "react";
import { Copy, Check, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "../../components/app/AppShell";
import { SeverityDot } from "../../components/app/StatusBadge";
import { followUps } from "../../data/mockData";
import type { FollowUp } from "../../data/mockData";

const statusConfig = {
  pending:  { label: "En attente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  sent:     { label: "Envoyé",     className: "bg-blue-50 text-blue-700 border-blue-200" },
  resolved: { label: "Résolu",     className: "bg-green-50 text-green-700 border-green-200" },
};

function FollowupCard({ fu }: { fu: FollowUp }) {
  const [activeTab, setActiveTab] = useState<"fr" | "ar">("fr");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (lang: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(lang);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-black/[0.06] flex items-center gap-3 flex-wrap">
        <SeverityDot severity={fu.severity} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-semibold text-[#1C1A16]">{fu.recipient}</span>
            <span className="text-[11px] text-[#6B6966]">— {fu.documentName}</span>
          </div>
          <div className="text-[11px] text-[#6B6966] mt-0.5">{fu.createdAt}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusConfig[fu.status].className}`}>
            {statusConfig[fu.status].label}
          </span>
          {fu.status === "pending" && (
            <button className="text-[11px] text-[#1A6B5E] font-medium hover:underline">Marquer envoyé</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black/[0.06]">
        {(["fr", "ar"] as const).map(lang => (
          <button
            key={lang}
            onClick={() => setActiveTab(lang)}
            className={`flex-1 py-2.5 text-[12px] font-medium transition-colors ${
              activeTab === lang
                ? "bg-[#F4F3EF] text-[#1C1A16] border-b-2 border-[#1A6B5E]"
                : "text-[#6B6966] hover:bg-[#F4F3EF]/50"
            }`}
          >
            {lang === "fr" ? "🇫🇷 Français" : "🇩🇿 العربية"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`p-5 ${activeTab === "ar" ? "bg-[#141210]" : "bg-white"}`}>
        <div
          className={`text-[12px] leading-[1.8] whitespace-pre-line rounded-xl p-4 mb-3 ${
            activeTab === "ar"
              ? "text-gray-300 text-right bg-white/5 dir-rtl"
              : "text-[#6B6966] bg-[#F4F3EF]/60"
          }`}
          dir={activeTab === "ar" ? "rtl" : "ltr"}
        >
          {activeTab === "fr" ? fu.fr : fu.ar}
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => fu.status === "pending"
              ? handleCopy(activeTab, activeTab === "fr" ? fu.fr : fu.ar)
              : undefined}
            className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
              activeTab === "ar" ? "text-[#E8A020] hover:underline" : "text-[#1A6B5E] hover:underline"
            }`}
          >
            {copied === activeTab ? <><Check className="w-3 h-3" /> Copié</> : <><Copy className="w-3 h-3" /> Copier</>}
          </button>
          {fu.status === "resolved" && (
            <span className="text-[11px] text-green-600 font-medium">✓ Résolu</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function FollowupsPage() {
  const [filter, setFilter] = useState<"ALL" | "BLOCKING" | "RISK" | "pending" | "sent" | "resolved">("ALL");

  const filtered = followUps.filter(fu => {
    if (filter === "ALL") return true;
    if (filter === "BLOCKING" || filter === "RISK") return fu.severity === filter;
    return fu.status === filter;
  });

  const pending = followUps.filter(f => f.status === "pending").length;
  const critical = followUps.filter(f => f.severity === "BLOCKING").length;
  const sentToday = followUps.filter(f => f.status === "sent").length;

  return (
    <AppShell
      title="Follow-ups"
      subtitle="Relances fournisseurs générées automatiquement"
    >
      <div className="px-6 py-5 max-w-[1200px] mx-auto">
        {/* Header strip */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {[
              { label: "Tous", value: "ALL" },
              { label: "Critique", value: "BLOCKING" },
              { label: "Risque", value: "RISK" },
              { label: "En attente", value: "pending" },
              { label: "Envoyé", value: "sent" },
              { label: "Résolu", value: "resolved" },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as typeof filter)}
                className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  filter === f.value
                    ? "bg-[#1A6B5E] text-white border-[#1A6B5E]"
                    : "bg-white text-[#6B6966] border-black/[0.08] hover:border-[#1A6B5E]/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {[
              { label: "En attente", value: pending, accent: "text-amber-700" },
              { label: "Critiques", value: critical, accent: "text-red-700" },
              { label: "Envoyés", value: sentToday, accent: "text-blue-700" },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-1.5 bg-white border border-black/[0.06] rounded-xl px-3 py-2">
                <span className={`text-[18px] font-bold leading-none ${stat.accent}`}>{stat.value}</span>
                <span className="text-[11px] text-[#6B6966]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {filtered.map((fu) => <FollowupCard key={fu.id} fu={fu} />)}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-[#6B6966]">
              <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
              <div className="text-[14px] font-medium">Aucune relance dans cette catégorie</div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
