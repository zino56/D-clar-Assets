import { useState } from "react";
import { useParams, Link } from "wouter";
import { ChevronRight, CheckCircle, RotateCcw, Copy, Download, Eye, FileText, AlertTriangle, Check } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "../../components/app/AppShell";
import { StatusBadge, SeverityDot, ImpactBadge } from "../../components/app/StatusBadge";
import { ScorePill } from "../../components/app/ScorePill";
import { documents, anomaliesDoc001, followUps } from "../../data/mockData";

function FieldRow({ label, value, missing }: { label: string; value?: string; missing?: boolean }) {
  return (
    <div className={`flex items-start justify-between py-2.5 border-b border-black/[0.04] last:border-0 ${missing ? "bg-red-50/40 -mx-4 px-4 rounded-lg" : ""}`}>
      <span className="text-[12px] text-[#6B6966] font-medium flex-shrink-0 w-40">{label}</span>
      {missing ? (
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-red-500 font-medium">Manquant</span>
          <button className="text-[11px] text-[#1A6B5E] font-medium hover:underline">Demander à l'agent</button>
        </div>
      ) : (
        <span className="text-[13px] text-[#1C1A16] font-medium text-right">{value ?? "—"}</span>
      )}
    </div>
  );
}

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const doc = documents.find(d => d.id === id) ?? documents[0];
  const followup = followUps.find(f => f.documentId === doc.id) ?? followUps[0];

  const [activeTab, setActiveTab] = useState<"fr" | "ar">("fr");
  const [copied, setCopied] = useState<string | null>(null);
  const [ocrToggle, setOcrToggle] = useState(false);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <AppShell title={doc.filename} subtitle={`${doc.type} · ${doc.supplier}`}>
      <div className="px-6 py-5 max-w-[1400px] mx-auto">
        {/* Breadcrumb + actions */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-[12px] text-[#6B6966]">
            <Link href="/app/inbox"><span className="hover:text-[#1A6B5E] cursor-pointer">Inbox</span></Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1C1A16] font-medium">{doc.filename}</span>
            <StatusBadge status={doc.status} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#1A6B5E] bg-[#1A6B5E]/8 hover:bg-[#1A6B5E]/15 px-3 py-1.5 rounded-lg transition-colors">
              <CheckCircle className="w-3.5 h-3.5" /> Marquer résolu
            </button>
            <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B6966] bg-white hover:bg-[#F4F3EF] border border-black/[0.08] px-3 py-1.5 rounded-lg transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Relancer extraction
            </button>
            <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B6966] bg-white hover:bg-[#F4F3EF] border border-black/[0.08] px-3 py-1.5 rounded-lg transition-colors">
              <Copy className="w-3.5 h-3.5" /> Copier le suivi
            </button>
            <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B6966] bg-white hover:bg-[#F4F3EF] border border-black/[0.08] px-3 py-1.5 rounded-lg transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        {/* Section A: Summary strip */}
        <div className="flex items-center gap-3 mb-5 overflow-x-auto pb-1">
          {[
            { label: "Type", value: doc.type },
            { label: "Fournisseur", value: doc.supplier },
            { label: "Date", value: doc.date },
            { label: "NIF", value: doc.nif, missing: !doc.nif },
            { label: "RC", value: doc.rc },
            { label: "Score", value: <ScorePill score={doc.score} /> },
            { label: "Statut", value: <StatusBadge status={doc.status} size="md" /> },
          ].map((item, i) => (
            <div key={i} className={`bg-white rounded-xl border px-4 py-2.5 flex-shrink-0 ${item.missing ? "border-red-200 bg-red-50/40" : "border-black/[0.06]"}`}>
              <div className="text-[10px] text-[#6B6966] font-medium mb-1 uppercase tracking-wider">{item.label}</div>
              {typeof item.value === "string" ? (
                <div className={`text-[13px] font-semibold ${item.missing ? "text-red-500" : "text-[#1C1A16]"}`}>
                  {item.missing ? "Manquant" : item.value}
                </div>
              ) : item.value}
            </div>
          ))}
        </div>

        {/* Section B: Split content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5 mb-5">
          {/* Left: Document preview */}
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-black/[0.06] bg-[#F4F3EF]/50">
              <div className="flex items-center gap-1.5">
                <button className="text-[11px] text-[#6B6966] hover:text-[#1C1A16] px-2 py-1 rounded hover:bg-black/[0.04]">−</button>
                <span className="text-[11px] text-[#6B6966]">100%</span>
                <button className="text-[11px] text-[#6B6966] hover:text-[#1C1A16] px-2 py-1 rounded hover:bg-black/[0.04]">+</button>
              </div>
              <span className="text-[11px] text-[#6B6966]">Page 1 / 1</span>
              <button
                onClick={() => setOcrToggle(v => !v)}
                className={`ml-auto flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-colors ${ocrToggle ? "bg-[#1A6B5E] text-white border-[#1A6B5E]" : "bg-white text-[#6B6966] border-black/[0.08] hover:border-[#1A6B5E]/40"}`}
              >
                <Eye className="w-3 h-3" /> Texte OCR
              </button>
            </div>

            {ocrToggle ? (
              <div className="p-6 font-mono text-[11px] text-[#6B6966] leading-[1.8] bg-[#141210] min-h-[400px] whitespace-pre-wrap">
{`SARL NOVA — Facture d'achat
N° Facture : 2026/047
Date       : 12/05/2026

Fournisseur :
  SARL Nova
  Rue des Frères Bouadou, Alger
  RC : 16/00-1234567B
  NIF : [NON TROUVÉ]

Description            Qté   PU HT       HT
------------------------------------------------
Fournitures bureau      10   15 000 DA   150 000 DA
------------------------------------------------
Total HT                              150 000 DA
TVA 19%                                28 500 DA
Total TTC                             178 500 DA

Mode de paiement : [NON RENSEIGNÉ]

⚠ ANOMALIE_NIF_ACHAT — NIF absent
⚠ ANOMALIE_MODE_PAIEMENT_VENTE`}
              </div>
            ) : (
              <div className="p-8 min-h-[400px] bg-[#FAFAFA] flex items-start justify-center">
                <div className="w-full max-w-[480px] bg-white shadow-md rounded border border-gray-200 p-8 text-[12px] text-[#1C1A16]">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="font-bold text-[16px] mb-1">SARL Nova</div>
                      <div className="text-[#6B6966]">Rue des Frères Bouadou, Alger</div>
                      <div className="text-[#6B6966]">RC : 16/00-1234567B</div>
                      <div className="flex items-center gap-1 mt-1 bg-red-50 border border-red-200 rounded px-2 py-0.5 text-red-600 font-medium w-fit">
                        <AlertTriangle className="w-3 h-3" /> NIF manquant
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">FACTURE</div>
                      <div className="text-[#6B6966]">N° 2026/047</div>
                      <div className="text-[#6B6966]">12/05/2026</div>
                    </div>
                  </div>
                  <table className="w-full mb-6 text-[11px]">
                    <thead><tr className="border-b border-gray-200 text-[#6B6966]">
                      <th className="text-left pb-2">Description</th>
                      <th className="text-right pb-2">HT</th>
                    </tr></thead>
                    <tbody>
                      <tr><td className="py-1.5">Fournitures bureau (x10)</td><td className="text-right">150 000 DA</td></tr>
                    </tbody>
                  </table>
                  <div className="border-t border-gray-200 pt-3 flex flex-col gap-1 text-right">
                    <div className="text-[#6B6966]">Total HT : 150 000 DA</div>
                    <div className="text-[#6B6966]">TVA 19% : 28 500 DA</div>
                    <div className="font-bold">Total TTC : 178 500 DA</div>
                    <div className="bg-red-50 border border-red-200 rounded px-2 py-0.5 text-red-600 text-[11px] font-medium w-fit ml-auto mt-1">
                      Mode de paiement manquant
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Extracted fields */}
          <div className="flex flex-col gap-4">
            {[
              {
                title: "Identité fournisseur",
                fields: [
                  { label: "Nom fournisseur", value: doc.supplier },
                  { label: "NIF", value: doc.nif, missing: !doc.nif },
                  { label: "RC", value: doc.rc },
                  { label: "Article d'imposition", value: doc.articleImp, missing: !doc.articleImp },
                  { label: "Adresse", value: doc.adresse, missing: !doc.adresse },
                ],
              },
              {
                title: "Données facture",
                fields: [
                  { label: "N° Facture", value: doc.numFacture },
                  { label: "Date", value: doc.date },
                  { label: "Mode de paiement", value: doc.modePaiement, missing: !doc.modePaiement },
                ],
              },
              {
                title: "Montants",
                fields: [
                  { label: "HT", value: `${doc.amount.ht.toLocaleString("fr-DZ")} DA` },
                  { label: "TVA", value: `${doc.amount.tva.toLocaleString("fr-DZ")} DA` },
                  { label: "TTC", value: `${doc.amount.ttc.toLocaleString("fr-DZ")} DA` },
                ],
              },
              {
                title: "Méta fiscal",
                fields: [
                  { label: "Régime détecté", value: doc.regime },
                  { label: "Pertinence G50", value: "Oui" },
                  { label: "Confiance", value: doc.confidence ? `${Math.round(doc.confidence * 100)}%` : undefined },
                ],
              },
            ].map((group) => (
              <div key={group.title} className="bg-white rounded-2xl border border-black/[0.06] p-4">
                <div className="text-[11px] font-semibold text-[#6B6966] uppercase tracking-wider mb-3">{group.title}</div>
                {group.fields.map((f) => (
                  <FieldRow key={f.label} label={f.label} value={f.value} missing={f.missing} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Section C: Anomalies */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-[14px] font-semibold text-[#1C1A16]">Anomalies détectées ({anomaliesDoc001.length})</span>
          </div>
          <div className="flex flex-col gap-2">
            {anomaliesDoc001.map((anomaly, i) => (
              <motion.div
                key={anomaly.code}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-black/[0.04] bg-[#F4F3EF]/50 hover:bg-[#F4F3EF] transition-colors"
              >
                <SeverityDot severity={anomaly.severity} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[11px] font-mono font-semibold text-[#1C1A16]">{anomaly.code}</span>
                    <ImpactBadge impact={anomaly.impact} />
                  </div>
                  <div className="text-[12px] text-[#6B6966] leading-[1.5]">{anomaly.explanation}</div>
                </div>
                <button className="text-[11px] text-[#1A6B5E] font-medium hover:underline flex-shrink-0">Expliquer</button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section D: Readiness Score */}
        <div className="bg-[#141210] rounded-2xl p-5 mb-5 text-white">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Score de readiness</div>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-[48px] font-bold text-white leading-none">{doc.score}</span>
                <span className="text-[24px] text-gray-500 pb-1">/100</span>
                <StatusBadge status={doc.status} />
              </div>
              <p className="text-[13px] text-gray-400">3 éléments bloquants empêchent l'export G50</p>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Checklist</div>
              {[
                { label: "NIF manquant", done: false },
                { label: "Adresse fournisseur manquante", done: false },
                { label: "Mode de paiement absent", done: false },
                { label: "RC fournisseur", done: true },
                { label: "Numéro de facture", done: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 mb-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${item.done ? "bg-green-500 border-green-500" : "border-red-400"}`}>
                    {item.done && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className={`text-[12px] ${item.done ? "text-gray-400 line-through" : "text-gray-200"}`}>{item.label}</span>
                </div>
              ))}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
                  <span>Progression</span><span>{doc.score}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${doc.score}%` }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="h-full bg-[#1A6B5E] rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section E: Follow-up drafts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FR */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span>🇫🇷</span>
                <span className="text-[13px] font-semibold text-[#1C1A16]">Message Français</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded font-semibold">CRITIQUE</span>
                <button
                  onClick={() => handleCopy("fr", followup.fr)}
                  className="flex items-center gap-1.5 text-[11px] text-[#1A6B5E] font-medium hover:underline"
                >
                  {copied === "fr" ? <><Check className="w-3 h-3" /> Copié</> : <><Copy className="w-3 h-3" /> Copier</>}
                </button>
              </div>
            </div>
            <div className="text-[12px] leading-[1.75] text-[#6B6966] whitespace-pre-line bg-[#F4F3EF]/60 rounded-xl p-4">
              {followup.fr}
            </div>
          </div>

          {/* AR */}
          <div className="bg-[#141210] rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-3" dir="rtl">
              <div className="flex items-center gap-2">
                <span>🇩🇿</span>
                <span className="text-[13px] font-semibold">رسالة بالعربية</span>
              </div>
              <button
                onClick={() => handleCopy("ar", followup.ar)}
                className="flex items-center gap-1.5 text-[11px] text-[#E8A020] font-medium hover:underline"
              >
                {copied === "ar" ? <><Check className="w-3 h-3" /> نُسخ</> : <><Copy className="w-3 h-3" /> نسخ</>}
              </button>
            </div>
            <div className="text-[12px] leading-[1.9] text-gray-300 whitespace-pre-line text-right dir-rtl bg-white/5 rounded-xl p-4" dir="rtl">
              {followup.ar}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
