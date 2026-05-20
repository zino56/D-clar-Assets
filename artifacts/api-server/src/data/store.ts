/**
 * In-memory v1 data store.
 * TODO: Replace with DB persistence and live Hermes/OCR pipeline writes.
 */

export type DocumentStatus = "READY" | "INCOMPLETE" | "BLOCKED" | "PROCESSING" | "ERROR";
export type Severity = "BLOCKING" | "RISK" | "WARNING";
export type FollowUpStatus = "pending" | "sent" | "resolved";

export interface DocumentSummary {
  id: string;
  filename: string;
  documentType: string;
  entityName: string;
  clientName: string;
  status: DocumentStatus;
  score: number;
  anomalyCount: number;
  createdAt: string;
  amountTtc?: number;
  regime?: string;
}

export interface ExtractedField {
  key: string;
  label: string;
  value: string | null;
  missing: boolean;
  group?: string;
}

export interface Anomaly {
  code: string;
  severity: Severity;
  description: string;
  impact: string;
}

export interface FollowUpMessage {
  id: string;
  documentId: string;
  documentName: string;
  recipient: string;
  severity: Severity;
  status: FollowUpStatus;
  fr: string;
  ar: string;
  createdAt: string;
  reviewed?: boolean;
}

export interface PipelineStep {
  id: string;
  label: string;
  state: "completed" | "current" | "blocked" | "pending";
  actor: "skill" | "tool" | "system";
  actorName: string;
  explanation: string;
  completedAt?: string | null;
}

export interface SkillRun {
  name: string;
  role: string;
  inputSummary: string;
  outputSummary: string;
  confidence?: number | null;
  status: "success" | "warning" | "error" | "idle";
}

export interface DeterministicCheck {
  name: string;
  verified: string;
  result: "passed" | "failed" | "warning";
  rationale: string;
}

export interface ReadinessDecision {
  score: number;
  status: DocumentStatus;
  blockingFields: string[];
  warnings: string[];
  nextAction: string;
  declarationMonth?: string;
}

export interface DocumentDetail extends DocumentSummary {
  confidence?: number | null;
  amount?: { ht: number; tva: number; ttc: number };
  extractedFields: ExtractedField[];
  anomalies: Anomaly[];
  timeline: PipelineStep[];
  skillsUsed: SkillRun[];
  deterministicChecks: DeterministicCheck[];
  readiness: ReadinessDecision;
  followups: FollowUpMessage[];
}

export interface AgentActivity {
  id: string;
  type: "skill" | "tool" | "status";
  title: string;
  detail: string;
  createdAt: string;
  severity?: Severity;
  skillOrTool?: string;
}

const followUps: FollowUpMessage[] = [
  {
    id: "fu-001",
    documentId: "doc-001",
    documentName: "Facture_047_Mai.pdf",
    recipient: "SARL Nova",
    severity: "BLOCKING",
    status: "pending",
    createdAt: "2026-05-20T01:16:00+01:00",
    reviewed: false,
    fr: `Madame, Monsieur,\n\nSuite à l'examen de votre facture N°2026/047 datée du 12/05/2026, nous constatons l'absence du Numéro d'Identification Fiscale (NIF) de votre établissement.\n\nSans ce document, la TVA déductible d'un montant de 28.500 DA sera rejetée lors de notre déclaration G50.\n\nNous vous remercions de bien vouloir nous transmettre ce document dans les meilleurs délais.\n\nCordialement,\nCabinet El Amel`,
    ar: `السيد/السيدة،\n\nبعد مراجعة الفاتورة رقم 2026/047 بتاريخ 12/05/2026، لاحظنا غياب الرقم الجبائي (NIF) الخاص بمؤسستكم.\n\nبدون هذه الوثيقة، سيتم رفض ضريبة القيمة المضافة القابلة للخصم البالغة 28.500 دج عند تقديم إقرار G50.\n\nنرجو منكم إرسال هذه الوثيقة في أقرب وقت ممكن.\n\nمع التقدير،\nمكتب الأمل`,
  },
  {
    id: "fu-002",
    documentId: "doc-002",
    documentName: "BL_EntrepriseNour_12-05.pdf",
    recipient: "Entreprise Nour",
    severity: "BLOCKING",
    status: "pending",
    createdAt: "2026-05-20T00:48:00+01:00",
    reviewed: false,
    fr: `Madame, Monsieur,\n\nNous revenons vers vous concernant le bon de livraison du 12/05/2026. Plusieurs éléments requis pour la conformité fiscale sont manquants.\n\nCabinet El Amel`,
    ar: `السيد/السيدة،\n\nنعود إليكم بخصوص وصل الاستلام بتاريخ 12/05/2026. هناك عدة عناصر مطلوبة للامتثال الضريبي مفقودة.\n\nمكتب الأمل`,
  },
  {
    id: "fu-003",
    documentId: "doc-004",
    documentName: "Vente_ClientAtlas.pdf",
    recipient: "EURL Atlas",
    severity: "RISK",
    status: "sent",
    createdAt: "2026-05-19T14:00:00+01:00",
    reviewed: true,
    fr: `Madame, Monsieur,\n\nConcernant la facture de vente N°V-2026-0401, le mode de paiement n'est pas renseigné.\n\nCabinet El Amel`,
    ar: `السيد/السيدة،\n\nبخصوص فاتورة البيع رقم V-2026-0401، طريقة الدفع غير مُدونة.\n\nمكتب الأمل`,
  },
  {
    id: "fu-004",
    documentId: "doc-005",
    documentName: "Facture_IFU_SARL_Nova.pdf",
    recipient: "SARL Horizon",
    severity: "WARNING",
    status: "resolved",
    createdAt: "2026-05-18T09:00:00+01:00",
    reviewed: true,
    fr: `Madame, Monsieur,\n\nL'adresse de votre établissement n'apparaît pas clairement sur le document.\n\nCabinet El Amel`,
    ar: `السيد/السيدة،\n\nعنوان مؤسستكم لا يظهر بوضوح في الوثيقة.\n\nمكتب الأمل`,
  },
];

const anomaliesByDoc: Record<string, Anomaly[]> = {
  "doc-001": [
    { code: "ANOMALIE_NIF_ACHAT", severity: "BLOCKING", description: "Le NIF du fournisseur est absent. La TVA déductible de 28.500 DA sera rejetée.", impact: "Bloquant" },
    { code: "ANOMALIE_ART_ACHAT", severity: "RISK", description: "L'article d'imposition n'a pas été trouvé.", impact: "Risque" },
    { code: "ANOMALIE_ADRESSE_ACHAT", severity: "WARNING", description: "L'adresse du fournisseur est manquante.", impact: "À vérifier" },
  ],
  "doc-002": [
    { code: "ANOMALIE_NIF_ACHAT", severity: "BLOCKING", description: "NIF fournisseur non conforme.", impact: "Bloquant" },
    { code: "ANOMALIE_RC_ACHAT", severity: "BLOCKING", description: "RC fournisseur invalide pour déclaration G50.", impact: "Bloquant" },
    { code: "ANOMALIE_ART_ACHAT", severity: "BLOCKING", description: "Article d'imposition absent.", impact: "Bloquant" },
    { code: "ANOMALIE_ADRESSE_ACHAT", severity: "RISK", description: "Adresse incomplète.", impact: "Risque" },
    { code: "ANOMALIE_MODE_PAIEMENT_VENTE", severity: "RISK", description: "Mode de paiement non renseigné.", impact: "Risque" },
  ],
  "doc-004": [
    { code: "ANOMALIE_MODE_PAIEMENT_VENTE", severity: "RISK", description: "Mode de paiement absent pour facture > 1M DA.", impact: "Risque" },
    { code: "ANOMALIE_ADRESSE_ACHAT", severity: "WARNING", description: "Adresse client à vérifier.", impact: "À vérifier" },
  ],
  "doc-008": [
    { code: "ANOMALIE_ESPECE_VENTE", severity: "BLOCKING", description: "Paiement espèces > 1.000.000 DA — infraction légale.", impact: "Bloquant" },
    { code: "ANOMALIE_NIF_ACHAT", severity: "BLOCKING", description: "NIF absent.", impact: "Bloquant" },
  ],
};

function fieldsForDoc(id: string): ExtractedField[] {
  const base: Record<string, ExtractedField[]> = {
    "doc-001": [
      { key: "nif", label: "NIF fournisseur", value: null, missing: true, group: "Identité" },
      { key: "rc", label: "RC fournisseur", value: "16/00-1234567B", missing: false, group: "Identité" },
      { key: "articleImp", label: "Article d'imposition", value: null, missing: true, group: "Fiscal" },
      { key: "supplier", label: "Fournisseur", value: "SARL Nova", missing: false, group: "Identité" },
      { key: "ht", label: "Montant HT", value: "150 000 DA", missing: false, group: "Montants" },
      { key: "tva", label: "TVA", value: "28 500 DA", missing: false, group: "Montants" },
      { key: "ttc", label: "Montant TTC", value: "178 500 DA", missing: false, group: "Montants" },
      { key: "modePaiement", label: "Mode de paiement", value: null, missing: true, group: "Paiement" },
      { key: "numFacture", label: "N° facture", value: "2026/047", missing: false, group: "Référence" },
    ],
    "doc-003": [
      { key: "nif", label: "NIF fournisseur", value: "099345670011", missing: false, group: "Identité" },
      { key: "rc", label: "RC fournisseur", value: "16/00-3456789D", missing: false, group: "Identité" },
      { key: "articleImp", label: "Article d'imposition", value: "07", missing: false, group: "Fiscal" },
      { key: "supplier", label: "Fournisseur", value: "Office Express Algérie", missing: false, group: "Identité" },
      { key: "ht", label: "Montant HT", value: "45 000 DA", missing: false, group: "Montants" },
      { key: "tva", label: "TVA", value: "8 550 DA", missing: false, group: "Montants" },
      { key: "ttc", label: "Montant TTC", value: "53 550 DA", missing: false, group: "Montants" },
      { key: "modePaiement", label: "Mode de paiement", value: "Virement", missing: false, group: "Paiement" },
    ],
  };
  return base[id] ?? [
    { key: "supplier", label: "Entité", value: "—", missing: false, group: "Identité" },
    { key: "ht", label: "Montant HT", value: "—", missing: false, group: "Montants" },
  ];
}

function timelineFor(status: DocumentStatus): PipelineStep[] {
  const steps: Omit<PipelineStep, "state">[] = [
    { id: "intake", label: "Intake", actor: "system", actorName: "Intake", explanation: "Document reçu et indexé" },
    { id: "ocr", label: "OCR", actor: "tool", actorName: "OCR Tool", explanation: "Texte extrait du PDF" },
    { id: "classify", label: "Classification", actor: "skill", actorName: "classify_document_type", explanation: "Type de document identifié" },
    { id: "extract", label: "Extraction", actor: "skill", actorName: "extract_algerian_invoice", explanation: "Champs structurés extraits" },
    { id: "arithmetic", label: "Vérification arithmétique", actor: "tool", actorName: "Arithmetic Tool", explanation: "HT + TVA = TTC vérifié" },
    { id: "missing", label: "Champs manquants", actor: "skill", actorName: "flag_missing_fields", explanation: "Champs obligatoires contrôlés" },
    { id: "scoring", label: "Score readiness", actor: "tool", actorName: "Scorer", explanation: "Score G50 calculé" },
    { id: "followup", label: "Relance bilingue", actor: "skill", actorName: "draft_followup_message", explanation: "Messages FR/AR générés" },
  ];
  const blockedAt = status === "BLOCKED" || status === "ERROR" ? 5 : status === "PROCESSING" ? 3 : 8;
  const currentAt = status === "PROCESSING" ? 3 : -1;
  return steps.map((s, i) => ({
    ...s,
    state: i < blockedAt ? "completed" : i === currentAt ? "current" : i === blockedAt && (status === "BLOCKED" || status === "ERROR") ? "blocked" : "pending",
    completedAt: i < blockedAt ? "2026-05-20T01:1" + i + ":00+01:00" : null,
  }));
}

function buildDetail(summary: DocumentSummary): DocumentDetail {
  const anomalies = anomaliesByDoc[summary.id] ?? [];
  const blocking = fieldsForDoc(summary.id).filter((f) => f.missing).map((f) => f.label);
  return {
    ...summary,
    confidence: summary.id === "doc-003" ? 0.97 : summary.id === "doc-001" ? 0.87 : 0.74,
    amount:
      summary.amountTtc != null
        ? {
            ht: Math.round(summary.amountTtc / 1.19),
            tva: Math.round(summary.amountTtc - summary.amountTtc / 1.19),
            ttc: summary.amountTtc,
          }
        : undefined,
    extractedFields: fieldsForDoc(summary.id),
    anomalies,
    timeline: timelineFor(summary.status),
    skillsUsed: [
      { name: "classify_document_type", role: "Classification document", inputSummary: "Texte OCR brut", outputSummary: summary.documentType, confidence: 0.87, status: "success" },
      { name: "extract_algerian_invoice", role: "Extraction champs", inputSummary: "Type + OCR", outputSummary: `${fieldsForDoc(summary.id).length} champs`, confidence: 0.82, status: anomalies.length ? "warning" : "success" },
      { name: "flag_missing_fields", role: "Champs manquants", inputSummary: "Schéma G50", outputSummary: `${blocking.length} manquant(s)`, status: blocking.length ? "warning" : "success" },
      { name: "draft_followup_message", role: "Relance bilingue", inputSummary: "Anomalies", outputSummary: followUps.some((f) => f.documentId === summary.id) ? "FR + AR" : "Non requis", status: "success" },
    ],
    deterministicChecks: [
      { name: "OCR Tool", verified: "Qualité texte", result: summary.status === "ERROR" ? "failed" : "passed", rationale: "Extraction texte pour pipeline IA" },
      { name: "Arithmetic Tool", verified: "HT + TVA = TTC", result: "passed", rationale: "Cohérence montants avant scoring" },
      { name: "Scorer", verified: "Score readiness G50", result: summary.score >= 80 ? "passed" : summary.score >= 50 ? "warning" : "failed", rationale: "Pondération champs + anomalies" },
      { name: "Status Engine", verified: "READY / INCOMPLETE / BLOCKED", result: summary.status === "READY" ? "passed" : summary.status === "BLOCKED" ? "failed" : "warning", rationale: "Décision finale déterministe" },
    ],
    readiness: {
      score: summary.score,
      status: summary.status,
      blockingFields: blocking,
      warnings: anomalies.filter((a) => a.severity !== "BLOCKING").map((a) => a.code),
      nextAction:
        summary.status === "READY"
          ? "Inclure dans l'export G50 de Mai 2026"
          : blocking.length
            ? `Demander : ${blocking[0]}`
            : "Réviser anomalies et relancer extraction",
      declarationMonth: "Mai 2026",
    },
    followups: followUps.filter((f) => f.documentId === summary.id),
  };
}

const summaries: DocumentSummary[] = [
  { id: "doc-001", filename: "Facture_047_Mai.pdf", documentType: "Facture d'achat", entityName: "SARL Nova", clientName: "Cabinet El Amel", status: "INCOMPLETE", score: 64, anomalyCount: 3, createdAt: "2026-05-20T01:14:00+01:00", amountTtc: 178500, regime: "IBS" },
  { id: "doc-002", filename: "BL_EntrepriseNour_12-05.pdf", documentType: "Bon de livraison", entityName: "Entreprise Nour", clientName: "Cabinet El Amel", status: "BLOCKED", score: 33, anomalyCount: 5, createdAt: "2026-05-20T00:55:00+01:00", amountTtc: 261800, regime: "IFU" },
  { id: "doc-003", filename: "Achat_OfficeExpress.png", documentType: "Facture d'achat", entityName: "Office Express Algérie", clientName: "Cabinet El Amel", status: "READY", score: 92, anomalyCount: 0, createdAt: "2026-05-19T16:00:00+01:00", amountTtc: 53550, regime: "IBS" },
  { id: "doc-004", filename: "Vente_ClientAtlas.pdf", documentType: "Facture de vente", entityName: "EURL Atlas", clientName: "Cabinet El Amel", status: "INCOMPLETE", score: 78, anomalyCount: 2, createdAt: "2026-05-19T11:00:00+01:00", amountTtc: 1428000, regime: "TVA" },
  { id: "doc-005", filename: "Facture_IFU_SARL_Nova.pdf", documentType: "Facture d'achat", entityName: "SARL Horizon", clientName: "Cabinet El Amel", status: "INCOMPLETE", score: 55, anomalyCount: 2, createdAt: "2026-05-18T09:30:00+01:00", amountTtc: 89250, regime: "IFU" },
  { id: "doc-006", filename: "Recu_Banque_Algerie.pdf", documentType: "Reçu", entityName: "Banque d'Algérie", clientName: "Cabinet El Amel", status: "READY", score: 95, anomalyCount: 0, createdAt: "2026-05-17T14:00:00+01:00", amountTtc: 300000, regime: "Exonéré" },
  { id: "doc-007", filename: "Achat_SARL_Nova_Mai.pdf", documentType: "Facture d'achat", entityName: "SARL Nova", clientName: "Cabinet El Amel", status: "READY", score: 88, anomalyCount: 0, createdAt: "2026-05-16T10:00:00+01:00", amountTtc: 107100, regime: "IBS" },
  { id: "doc-008", filename: "Vente_Horizon_Annaba.pdf", documentType: "Facture de vente", entityName: "SARL Horizon", clientName: "Cabinet El Amel", status: "ERROR", score: 21, anomalyCount: 6, createdAt: "2026-05-15T08:00:00+01:00", amountTtc: 595000, regime: "IBS" },
  { id: "doc-009", filename: "Facture_Import_032.pdf", documentType: "Facture d'achat", entityName: "Import DZ", clientName: "Cabinet El Amel", status: "PROCESSING", score: 0, anomalyCount: 0, createdAt: "2026-05-20T02:00:00+01:00", amountTtc: 0, regime: "IBS" },
];

const details = new Map(summaries.map((s) => [s.id, buildDetail(s)]));

export const agentActivity: AgentActivity[] = [
  { id: "act-1", type: "tool", title: "OCR extraction completed", detail: "Facture_047_Mai.pdf — 2 340 caractères", createdAt: "2026-05-20T01:14:12+01:00", skillOrTool: "OCR Tool" },
  { id: "act-2", type: "skill", title: "classify_document_type ran", detail: "Facture d'achat — confiance 87%", createdAt: "2026-05-20T01:14:28+01:00", skillOrTool: "classify_document_type" },
  { id: "act-3", type: "skill", title: "extract_algerian_invoice ran", detail: "12 champs extraits, 3 manquants", createdAt: "2026-05-20T01:14:45+01:00", skillOrTool: "extract_algerian_invoice" },
  { id: "act-4", type: "tool", title: "Arithmetic verification passed", detail: "HT + TVA = TTC validé", createdAt: "2026-05-20T01:14:52+01:00", skillOrTool: "Arithmetic Tool" },
  { id: "act-5", type: "skill", title: "Missing fields detected", detail: "NIF, article d'imposition, mode paiement", createdAt: "2026-05-20T01:15:01+01:00", severity: "BLOCKING", skillOrTool: "flag_missing_fields" },
  { id: "act-6", type: "skill", title: "Bilingual follow-up drafted", detail: "Relance FR/AR pour SARL Nova", createdAt: "2026-05-20T01:16:00+01:00", skillOrTool: "draft_followup_message" },
  { id: "act-7", type: "status", title: "Status determined", detail: "INCOMPLETE — score 64/100", createdAt: "2026-05-20T01:16:08+01:00", skillOrTool: "Status Engine" },
  { id: "act-8", type: "tool", title: "Readiness scoring completed", detail: "Achat_OfficeExpress.png — 92/100 READY", createdAt: "2026-05-19T16:02:00+01:00", skillOrTool: "Scorer" },
];

export const skillsRegistry = [
  { name: "classify_document_type", title: "Classification document", description: "Identifie le type de pièce et le régime fiscal à partir du texte OCR.", inputSchemaSummary: "ocrText, metadata", outputSchemaSummary: "documentType, regime, confidence", stage: "Classification", status: "active" as const, usedWhen: "Après OCR, avant extraction" },
  { name: "extract_algerian_invoice", title: "Extraction facture algérienne", description: "Extrait NIF, RC, montants HT/TVA/TTC et références G50.", inputSchemaSummary: "ocrText, documentType", outputSchemaSummary: "structuredFields", stage: "Extraction", status: "active" as const, usedWhen: "Document classifié comme facture ou BL" },
  { name: "flag_missing_fields", title: "Champs manquants", description: "Compare les champs extraits au schéma obligatoire G50.", inputSchemaSummary: "structuredFields, documentType", outputSchemaSummary: "missingFields[], anomalies[]", stage: "Validation IA", status: "active" as const, usedWhen: "Après extraction" },
  { name: "draft_followup_message", title: "Relance bilingue", description: "Rédige messages FR et AR adaptés aux anomalies détectées.", inputSchemaSummary: "anomalies[], entityName", outputSchemaSummary: "messageFr, messageAr", stage: "Follow-up", status: "active" as const, usedWhen: "INCOMPLETE ou BLOCKED avec relance requise" },
];

export const toolsRegistry = [
  { name: "ocr", title: "OCR Tool", description: "Extraction texte depuis PDF/images.", status: "active" as const, verifies: "Texte machine-readable" },
  { name: "arithmetic", title: "Arithmetic Tool", description: "Vérifie HT + TVA = TTC et arrondis.", status: "active" as const, verifies: "Cohérence montants" },
  { name: "scorer", title: "Scorer", description: "Calcule le score readiness G50 (0–100).", status: "active" as const, verifies: "Score déclaration" },
  { name: "status-engine", title: "Status Engine", description: "Décide READY / INCOMPLETE / BLOCKED de façon déterministe.", status: "active" as const, verifies: "Statut final" },
  { name: "export", title: "Export Tool", description: "Bundle G50 mensuel.", status: "coming_soon" as const, verifies: "Export déclaration" },
  { name: "schedule", title: "Schedule Tool", description: "Jobs planifiés pipeline.", status: "coming_soon" as const, verifies: "Exécution différée" },
];

export function listDocuments(params: {
  status?: DocumentStatus;
  search?: string;
  sort?: string;
}): { items: DocumentSummary[]; total: number } {
  let items = [...summaries];
  if (params.status) items = items.filter((d) => d.status === params.status);
  if (params.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (d) =>
        d.filename.toLowerCase().includes(q) ||
        d.entityName.toLowerCase().includes(q) ||
        d.documentType.toLowerCase().includes(q),
    );
  }
  switch (params.sort) {
    case "oldest":
      items.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      break;
    case "score_desc":
      items.sort((a, b) => b.score - a.score);
      break;
    case "score_asc":
      items.sort((a, b) => a.score - b.score);
      break;
    case "anomalies_desc":
      items.sort((a, b) => b.anomalyCount - a.anomalyCount);
      break;
    default:
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return { items, total: items.length };
}

export function getDocument(id: string): DocumentDetail | undefined {
  return details.get(id);
}

export function getInboxSummary() {
  const today = "2026-05-20";
  const documentsToday = summaries.filter((d) => d.createdAt.startsWith(today)).length;
  return {
    documentsToday,
    readyCount: summaries.filter((d) => d.status === "READY").length,
    incompleteCount: summaries.filter((d) => d.status === "INCOMPLETE").length,
    blockedCount: summaries.filter((d) => d.status === "BLOCKED" || d.status === "ERROR").length,
    processingCount: summaries.filter((d) => d.status === "PROCESSING").length,
  };
}

export function listFollowups(filters: {
  status?: FollowUpStatus;
  severity?: Severity;
  /** Accepted for OpenAPI parity; each row includes FR+AR — filter is a no-op in V1. */
  language?: "fr" | "ar";
}): FollowUpMessage[] {
  let items = [...followUps];
  if (filters.status) items = items.filter((f) => f.status === filters.status);
  if (filters.severity) items = items.filter((f) => f.severity === filters.severity);
  return items;
}

export function getAgentOverview() {
  const scores = summaries.filter((d) => d.score > 0).map((d) => d.score);
  return {
    name: "Declaration Copilot Agent",
    status: "active" as const,
    documentsAnalyzed: summaries.length,
    averageReadinessScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    anomaliesThisWeek: summaries.reduce((a, d) => a + d.anomalyCount, 0),
    skillsActive: 4,
    lastPipelineRun: "2026-05-20T01:17:00+01:00",
  };
}
