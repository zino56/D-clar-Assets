export type DocStatus = "READY" | "INCOMPLETE" | "BLOCKED" | "PROCESSING" | "ERROR";
export type DocType = "Facture d'achat" | "Facture de vente" | "Bon de livraison" | "Reçu" | "Inconnu";
export type Severity = "BLOCKING" | "RISK" | "WARNING";

export interface Document {
  id: string;
  filename: string;
  client: string;
  type: DocType;
  date: string;
  supplier: string;
  score: number;
  status: DocStatus;
  anomalies: number;
  amount: { ht: number; tva: number; ttc: number };
  nif?: string;
  rc?: string;
  articleImp?: string;
  adresse?: string;
  numFacture?: string;
  modePaiement?: string;
  regime?: string;
  confidence?: number;
}

export interface Anomaly {
  code: string;
  severity: Severity;
  explanation: string;
  impact: "Bloquant" | "Risque" | "À vérifier";
}

export interface FollowUp {
  id: string;
  documentId: string;
  documentName: string;
  recipient: string;
  severity: Severity;
  status: "pending" | "sent" | "resolved";
  fr: string;
  ar: string;
  createdAt: string;
}

export interface Job {
  id: string;
  name: string;
  status: "running" | "idle" | "error" | "scheduled";
  nextRun: string;
  lastRun: string;
  duration: string;
  description: string;
}

export interface JobLog {
  id: string;
  job: string;
  time: string;
  result: "success" | "error" | "warning";
  affectedDocs: number;
  message: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "idle" | "running" | "error";
  skills: string[];
  outputs: string[];
  lastAction: string;
  usageToday: number;
  description: string;
  recentLog: { time: string; message: string }[];
  tasks: string[];
}

export interface ActivityEntry {
  id: string;
  time: string;
  message: string;
  agent?: string;
}

// ─── DOCUMENTS ───────────────────────────────────────────────
export const documents: Document[] = [
  {
    id: "doc-001",
    filename: "Facture_047_Mai.pdf",
    client: "Cabinet El Amel",
    type: "Facture d'achat",
    date: "12/05/2026",
    supplier: "SARL Nova",
    score: 64,
    status: "INCOMPLETE",
    anomalies: 3,
    amount: { ht: 150000, tva: 28500, ttc: 178500 },
    rc: "16/00-1234567B",
    numFacture: "2026/047",
    modePaiement: undefined,
    regime: "IBS",
    confidence: 0.87,
  },
  {
    id: "doc-002",
    filename: "BL_EntrepriseNour_12-05.pdf",
    client: "Cabinet El Amel",
    type: "Bon de livraison",
    date: "12/05/2026",
    supplier: "Entreprise Nour",
    score: 33,
    status: "BLOCKED",
    anomalies: 5,
    amount: { ht: 220000, tva: 41800, ttc: 261800 },
    nif: "099812340014",
    rc: "16/00-7654321C",
    regime: "IFU",
    confidence: 0.61,
  },
  {
    id: "doc-003",
    filename: "Achat_OfficeExpress.png",
    client: "Cabinet El Amel",
    type: "Facture d'achat",
    date: "10/05/2026",
    supplier: "Office Express Algérie",
    score: 92,
    status: "READY",
    anomalies: 0,
    amount: { ht: 45000, tva: 8550, ttc: 53550 },
    nif: "099345670011",
    rc: "16/00-3456789D",
    articleImp: "07",
    adresse: "12 Rue Didouche Mourad, Alger",
    numFacture: "OEA-2026-088",
    modePaiement: "Virement",
    regime: "IBS",
    confidence: 0.97,
  },
  {
    id: "doc-004",
    filename: "Vente_ClientAtlas.pdf",
    client: "Cabinet El Amel",
    type: "Facture de vente",
    date: "09/05/2026",
    supplier: "EURL Atlas",
    score: 78,
    status: "INCOMPLETE",
    anomalies: 2,
    amount: { ht: 1200000, tva: 228000, ttc: 1428000 },
    nif: "099556780019",
    rc: "16/00-9876543A",
    articleImp: "12",
    adresse: "Cité des Palmiers, Oran",
    numFacture: "V-2026-0401",
    regime: "TVA",
    confidence: 0.82,
  },
  {
    id: "doc-005",
    filename: "Facture_IFU_SARL_Nova.pdf",
    client: "Cabinet El Amel",
    type: "Facture d'achat",
    date: "08/05/2026",
    supplier: "SARL Horizon",
    score: 55,
    status: "INCOMPLETE",
    anomalies: 2,
    amount: { ht: 75000, tva: 14250, ttc: 89250 },
    nif: "099671230016",
    rc: "16/00-1122334E",
    regime: "IFU",
    confidence: 0.74,
  },
  {
    id: "doc-006",
    filename: "Recu_Banque_Algerie.pdf",
    client: "Cabinet El Amel",
    type: "Reçu",
    date: "07/05/2026",
    supplier: "Banque d'Algérie",
    score: 95,
    status: "READY",
    anomalies: 0,
    amount: { ht: 300000, tva: 0, ttc: 300000 },
    nif: "000000000001",
    rc: "N/A",
    regime: "Exonéré",
    confidence: 0.99,
  },
  {
    id: "doc-007",
    filename: "Achat_SARL_Nova_Mai.pdf",
    client: "Cabinet El Amel",
    type: "Facture d'achat",
    date: "06/05/2026",
    supplier: "SARL Nova",
    score: 88,
    status: "READY",
    anomalies: 0,
    amount: { ht: 90000, tva: 17100, ttc: 107100 },
    nif: "099812340014",
    rc: "16/00-5544332F",
    articleImp: "07",
    adresse: "Rue des Frères Bouadou, Alger",
    numFacture: "SN-2026-112",
    modePaiement: "Chèque",
    regime: "IBS",
    confidence: 0.93,
  },
  {
    id: "doc-008",
    filename: "Vente_Horizon_Annaba.pdf",
    client: "Cabinet El Amel",
    type: "Facture de vente",
    date: "05/05/2026",
    supplier: "SARL Horizon",
    score: 21,
    status: "ERROR",
    anomalies: 6,
    amount: { ht: 500000, tva: 95000, ttc: 595000 },
    regime: "IBS",
    confidence: 0.31,
  },
];

// ─── ANOMALIES (for doc-001) ──────────────────────────────────
export const anomaliesDoc001: Anomaly[] = [
  {
    code: "ANOMALIE_NIF_ACHAT",
    severity: "BLOCKING",
    explanation: "Le NIF du fournisseur est absent. La TVA déductible de 28.500 DA sera rejetée.",
    impact: "Bloquant",
  },
  {
    code: "ANOMALIE_ART_ACHAT",
    severity: "RISK",
    explanation: "L'article d'imposition n'a pas été trouvé. La déductibilité est incertaine.",
    impact: "Risque",
  },
  {
    code: "ANOMALIE_ADRESSE_ACHAT",
    severity: "WARNING",
    explanation: "L'adresse du fournisseur est manquante sur le document.",
    impact: "À vérifier",
  },
  {
    code: "ANOMALIE_MODE_PAIEMENT_VENTE",
    severity: "RISK",
    explanation: "Le mode de paiement n'est pas renseigné. Requis pour la conformité G50.",
    impact: "Risque",
  },
  {
    code: "ANOMALIE_RC_ACHAT",
    severity: "WARNING",
    explanation: "Le numéro de RC fournisseur ne correspond pas au format attendu.",
    impact: "À vérifier",
  },
  {
    code: "ANOMALIE_ESPECE_VENTE",
    severity: "BLOCKING",
    explanation: "Paiement en espèces supérieur à 1.000.000 DA détecté — infraction légale.",
    impact: "Bloquant",
  },
];

// ─── FOLLOW-UPS ───────────────────────────────────────────────
export const followUps: FollowUp[] = [
  {
    id: "fu-001",
    documentId: "doc-001",
    documentName: "Facture_047_Mai.pdf",
    recipient: "SARL Nova",
    severity: "BLOCKING",
    status: "pending",
    createdAt: "il y a 2h",
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
    createdAt: "il y a 3h",
    fr: `Madame, Monsieur,\n\nNous revenons vers vous concernant le bon de livraison du 12/05/2026. Plusieurs éléments requis pour la conformité fiscale sont manquants : article d'imposition, adresse complète et mode de paiement.\n\nCes éléments sont indispensables pour valider votre document dans notre système de déclaration G50.\n\nMerci de votre réactivité.\n\nCabinet El Amel`,
    ar: `السيد/السيدة،\n\nنعود إليكم بخصوص وصل الاستلام بتاريخ 12/05/2026. هناك عدة عناصر مطلوبة للامتثال الضريبي مفقودة: مادة الفرض، العنوان الكامل، وطريقة الدفع.\n\nهذه العناصر ضرورية للتحقق من صحة وثيقتكم في نظام تصريح G50.\n\nشكراً لتجاوبكم السريع.\n\nمكتب الأمل`,
  },
  {
    id: "fu-003",
    documentId: "doc-004",
    documentName: "Vente_ClientAtlas.pdf",
    recipient: "EURL Atlas",
    severity: "RISK",
    status: "sent",
    createdAt: "il y a 1j",
    fr: `Madame, Monsieur,\n\nConcernant la facture de vente N°V-2026-0401, nous souhaitons vous signaler que le mode de paiement n'est pas renseigné. Pour un montant de 1.428.000 DA, cette information est obligatoire.\n\nMerci de nous confirmer le mode de règlement utilisé.\n\nCabinet El Amel`,
    ar: `السيد/السيدة،\n\nبخصوص فاتورة البيع رقم V-2026-0401، نود الإشارة إلى أن طريقة الدفع غير مُدونة. لمبلغ يبلغ 1.428.000 دج، هذه المعلومة إلزامية.\n\nنرجو تأكيد طريقة السداد المستخدمة.\n\nمكتب الأمل`,
  },
  {
    id: "fu-004",
    documentId: "doc-005",
    documentName: "Facture_IFU_SARL_Nova.pdf",
    recipient: "SARL Horizon",
    severity: "WARNING",
    status: "resolved",
    createdAt: "il y a 2j",
    fr: `Madame, Monsieur,\n\nNous vous contactons concernant la facture du 08/05/2026. L'adresse de votre établissement n'apparaît pas clairement sur le document fourni.\n\nMerci de nous transmettre une version corrigée.\n\nCabinet El Amel`,
    ar: `السيد/السيدة،\n\nنتواصل معكم بشأن الفاتورة المؤرخة في 08/05/2026. عنوان مؤسستكم لا يظهر بوضوح في الوثيقة المقدمة.\n\nنرجو إرسال نسخة مصححة.\n\nمكتب الأمل`,
  },
];

// ─── JOBS ─────────────────────────────────────────────────────
export const jobs: Job[] = [
  {
    id: "job-001",
    name: "process_pending_documents",
    status: "running",
    nextRun: "Continu",
    lastRun: "il y a 2 min",
    duration: "4.2s",
    description: "Analyse les documents en attente via OCR + extraction Hermes",
  },
  {
    id: "job-002",
    name: "deadline_reminder",
    status: "scheduled",
    nextRun: "Demain 08:00",
    lastRun: "Hier 08:00",
    duration: "0.8s",
    description: "Envoie rappels de délais déclaratifs aux comptables",
  },
  {
    id: "job-003",
    name: "export_ready_summary",
    status: "idle",
    nextRun: "31/05/2026",
    lastRun: "30/04/2026",
    duration: "12.1s",
    description: "Génère le bundle d'export mensuel des documents READY",
  },
];

export const jobLogs: JobLog[] = [
  { id: "jl-001", job: "process_pending_documents", time: "12/05 01:14", result: "success", affectedDocs: 3, message: "3 documents traités avec succès" },
  { id: "jl-002", job: "export_ready_summary", time: "30/04 23:59", result: "success", affectedDocs: 28, message: "Bundle avril généré — 28 docs READY" },
  { id: "jl-003", job: "deadline_reminder", time: "12/05 08:00", result: "success", affectedDocs: 0, message: "Rappel G50 envoyé — échéance dans 18j" },
  { id: "jl-004", job: "process_pending_documents", time: "11/05 22:31", result: "error", affectedDocs: 1, message: "Erreur OCR — fichier corrompu ignoré" },
  { id: "jl-005", job: "process_pending_documents", time: "11/05 18:04", result: "success", affectedDocs: 5, message: "5 documents traités" },
  { id: "jl-006", job: "export_ready_summary", time: "11/05 12:00", result: "warning", affectedDocs: 7, message: "7 docs exclus — statut INCOMPLETE" },
];

// ─── AGENTS ───────────────────────────────────────────────────
export const agents: Agent[] = [
  {
    id: "classifier",
    name: "Classifier Agent",
    role: "Identifie le type de document",
    status: "idle",
    skills: ["Classification facture", "Pertinence déclarative", "Score de confiance", "Détection régime"],
    outputs: ["Facture d'achat", "Bon de livraison", "Reçu", "Inconnu"],
    lastAction: "Classified Facture_047_Mai.pdf as 'Facture d'achat'",
    usageToday: 12,
    description: "Analyse le texte OCR pour identifier la nature du document et son régime fiscal.",
    recentLog: [
      { time: "01:14", message: "Classified Facture_047_Mai.pdf → Facture d'achat (conf. 0.87)" },
      { time: "01:09", message: "Classified BL_EntrepriseNour → Bon de livraison (conf. 0.61)" },
      { time: "00:55", message: "Classified Achat_OfficeExpress → Facture d'achat (conf. 0.97)" },
    ],
    tasks: ["Classifier le document actif", "Expliquer le score de confiance"],
  },
  {
    id: "extractor",
    name: "Extractor Agent",
    role: "Extrait les champs structurés",
    status: "running",
    skills: ["Extraction NIF/RC", "Article d'imposition", "Montants HT/TVA/TTC", "Mode de paiement", "Date et numéro"],
    outputs: ["Jeu de champs JSON structuré"],
    lastAction: "Extracted 12 fields from Facture_047_Mai.pdf",
    usageToday: 17,
    description: "Lit le texte OCR et extrait les champs fiscaux requis pour la déclaration G50.",
    recentLog: [
      { time: "01:15", message: "Parsed Facture_047_Mai.pdf — 12 fields extracted, 3 missing" },
      { time: "01:10", message: "Parsed BL_EntrepriseNour — 8 fields extracted, 5 missing" },
      { time: "00:56", message: "Parsed Achat_OfficeExpress — 15 fields extracted, 0 missing" },
    ],
    tasks: ["Extraire le schéma complet", "Comparer OCR vs champs extraits"],
  },
  {
    id: "fiscal-checker",
    name: "Fiscal Checker Agent",
    role: "Vérifie la conformité fiscale",
    status: "idle",
    skills: ["Vérification champs manquants", "Explication anomalies", "Contrôle TVA", "Risque légal"],
    outputs: ["Avertissements", "Blocages", "Notes de confiance"],
    lastAction: "Flagged ANOMALIE_NIF_ACHAT on Facture_047_Mai.pdf",
    usageToday: 9,
    description: "Applique les règles fiscales algériennes pour détecter anomalies et blocages déclaratifs.",
    recentLog: [
      { time: "01:15", message: "Flagged ANOMALIE_NIF_ACHAT — TVA déductible bloquée" },
      { time: "01:15", message: "Flagged ANOMALIE_ESPECE_VENTE — infraction légale détectée" },
      { time: "01:10", message: "Flagged 5 anomalies on BL_EntrepriseNour" },
    ],
    tasks: ["Analyser les anomalies", "Expliquer le statut BLOCKED"],
  },
  {
    id: "followup-writer",
    name: "Follow-up Writer Agent",
    role: "Rédige les relances fournisseurs",
    status: "idle",
    skills: ["Rédaction française", "Rédaction arabe", "Ton critique", "Formulation urgente"],
    outputs: ["Message FR", "Message AR", "Rappel court"],
    lastAction: "Drafted FR/AR message for SARL Nova",
    usageToday: 6,
    description: "Génère des messages de relance bilingues adaptés au niveau de criticité de l'anomalie.",
    recentLog: [
      { time: "01:16", message: "Generated FR draft for SARL Nova — NIF missing" },
      { time: "01:16", message: "Generated AR draft for SARL Nova" },
      { time: "00:48", message: "Generated urgent reminder for Entreprise Nour" },
    ],
    tasks: ["Rédiger relance FR", "Rédiger relance AR", "Rendre le ton plus urgent"],
  },
  {
    id: "export-agent",
    name: "Export Agent",
    role: "Prépare les bundles d'export G50",
    status: "idle",
    skills: ["Groupement par période", "Filtrage READY", "Résumé comptable", "Exclusion BLOCKED"],
    outputs: ["Aperçu export", "Lignes groupées", "Résumé readiness"],
    lastAction: "Grouped 32 ready docs for May 2026",
    usageToday: 3,
    description: "Consolide les documents READY en bundles mensuels prêts pour la déclaration G50.",
    recentLog: [
      { time: "01:17", message: "Grouped 32 ready docs — Mai 2026 bundle ready" },
      { time: "01:17", message: "Excluded 8 INCOMPLETE + 4 BLOCKED docs" },
      { time: "23:59", message: "Generated April bundle — 28 docs, 79% completeness" },
    ],
    tasks: ["Préparer le bundle Mai", "Lister les documents exclus"],
  },
  {
    id: "general-copilot",
    name: "General Copilot",
    role: "Orchestration et assistance workflow",
    status: "idle",
    skills: ["Explication anomalies", "Prochaines actions", "Checklist révision", "Résumé quotidien"],
    outputs: ["Cartes de guidance", "Prochaines étapes", "Checklist révision"],
    lastAction: "Suggested priority: fix NIF on Facture_047",
    usageToday: 21,
    description: "Orchestre les agents et guide le comptable à travers le workflow déclaratif.",
    recentLog: [
      { time: "01:18", message: "Recommended: fix Facture_047 NIF first — highest impact" },
      { time: "01:05", message: "Summarized 5 blockers for today" },
      { time: "00:30", message: "Guided export preparation for Mai 2026" },
    ],
    tasks: ["Que corriger en premier?", "Résumer les blocages du jour"],
  },
];

// ─── ACTIVITY FEED ────────────────────────────────────────────
export const activityFeed: ActivityEntry[] = [
  { id: "a1", time: "01:17", message: "Export Agent a groupé 32 documents prêts", agent: "Export Agent" },
  { id: "a2", time: "01:16", message: "Follow-up Writer a rédigé le message FR/AR pour SARL Nova", agent: "Follow-up Writer" },
  { id: "a3", time: "01:15", message: "Fiscal Checker a signalé ANOMALIE_NIF_ACHAT", agent: "Fiscal Checker" },
  { id: "a4", time: "01:15", message: "Extractor Agent a analysé 12 champs sur Facture_047_Mai.pdf", agent: "Extractor" },
  { id: "a5", time: "01:14", message: "Classifier a identifié Facture_047_Mai.pdf — Facture d'achat", agent: "Classifier" },
  { id: "a6", time: "00:56", message: "3 documents traités par process_pending_documents", agent: "System" },
];

// ─── PRIORITY QUEUE ───────────────────────────────────────────
export const priorityQueue = [
  { docName: "Facture_047_Mai.pdf", reason: "NIF fournisseur manquant", severity: "BLOCKING" as Severity },
  { docName: "Vente_ClientAtlas.pdf", reason: "Espèces > 1.000.000 DA", severity: "BLOCKING" as Severity },
  { docName: "BL_EntrepriseNour.pdf", reason: "5 anomalies — non déclaratif", severity: "BLOCKING" as Severity },
  { docName: "Facture_IFU_SARL_Nova.pdf", reason: "Article d'imposition absent", severity: "RISK" as Severity },
];

// ─── KPI SUMMARY ─────────────────────────────────────────────
export const kpiSummary = {
  ready: 42,
  incomplete: 11,
  blocked: 5,
  processing: 3,
  exportsThisMonth: 2,
  totalHTMai: 2380000,
  totalTVAMai: 416300,
  totalTTCMai: 2796300,
  avgScore: 71,
  exportCompleteness: 79,
};

// ─── READINESS BOARD COLUMNS ──────────────────────────────────
export const readinessReady = documents.filter(d => d.status === "READY");
export const readinessIncomplete = documents.filter(d => d.status === "INCOMPLETE");
export const readinessBlocked = documents.filter(d => d.status === "BLOCKED" || d.status === "ERROR");
