/** Typed static fixtures for pages without API endpoints yet. */

export const exportPeriodsFixture = [
  { month: "Mai 2026", readyCount: 3, ht: "2,38 M DA", status: "ready" as const },
  { month: "Avril 2026", readyCount: 28, ht: "4,12 M DA", status: "ready" as const },
  { month: "Mars 2026", readyCount: 24, ht: "3,85 M DA", status: "coming_soon" as const },
];

export const jobsFixture = [
  {
    id: "job-001",
    name: "process_pending_documents",
    status: "running" as const,
    nextRun: "Continu",
    lastRun: "il y a 2 min",
    description: "Pipeline OCR + skills + checks déterministes",
  },
  {
    id: "job-002",
    name: "deadline_reminder",
    status: "scheduled" as const,
    nextRun: "Demain 08:00",
    lastRun: "Hier 08:00",
    description: "Rappels échéances déclaratives G50",
  },
  {
    id: "job-003",
    name: "export_ready_summary",
    status: "idle" as const,
    nextRun: "31/05/2026",
    lastRun: "30/04/2026",
    description: "Bundle mensuel documents READY",
  },
];

export const jobLogsFixture = [
  { id: "jl-1", time: "12/05 01:14", result: "success" as const, affectedDocs: 3, message: "3 documents traités" },
  { id: "jl-2", time: "30/04 23:59", result: "success" as const, affectedDocs: 28, message: "Bundle avril généré" },
  { id: "jl-3", time: "11/05 22:31", result: "error" as const, affectedDocs: 1, message: "Erreur OCR — fichier ignoré" },
];
