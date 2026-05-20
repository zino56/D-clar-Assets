import { Clock, Cpu } from "lucide-react";
import { AppShell } from "../../components/app/AppShell";
import { jobsFixture, jobLogsFixture } from "@/data/fixtures";

const statusPill: Record<string, string> = {
  running: "bg-blue-50 text-blue-700 border-blue-200",
  idle: "bg-[#F4F3EF] text-[#6B6966] border-black/[0.08]",
  scheduled: "bg-amber-50 text-amber-800 border-amber-200",
  error: "bg-red-50 text-red-700 border-red-200",
};

export default function JobsPage() {
  return (
    <AppShell title="Jobs" subtitle="Tâches planifiées — exécution backend à venir">
      <div className="px-6 py-5 max-w-[1000px] mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-[12px] text-amber-900">
          <strong>V1 :</strong> Affichage des jobs planifiés. L'intégration Schedule Tool et exécution cron arrivent dans une prochaine version.
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {jobsFixture.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-black/[0.06] p-5 flex flex-wrap items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1A6B5E]/10 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#1A6B5E]" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <code className="text-[12px] font-mono font-semibold text-[#1C1A16]">{job.name}</code>
                <p className="text-[11px] text-[#6B6966] mt-0.5">{job.description}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${statusPill[job.status]}`}>
                {job.status}
              </span>
              <div className="text-right text-[11px] text-[#6B6966]">
                <div className="flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />
                  Prochain : {job.nextRun}
                </div>
                <div>Dernier : {job.lastRun}</div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-[13px] font-semibold text-[#1C1A16] mb-3">Journal récent</h3>
        <div className="bg-white rounded-2xl border border-black/[0.06] divide-y divide-black/[0.04]">
          {jobLogsFixture.map((log) => (
            <div key={log.id} className="px-4 py-3 flex items-center gap-4 text-[12px]">
              <span className="text-[#6B6966] w-20 flex-shrink-0">{log.time}</span>
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  log.result === "success" ? "bg-[#2F7A4A]" : log.result === "error" ? "bg-[#B83232]" : "bg-[#E8A020]"
                }`}
              />
              <span className="font-medium text-[#1C1A16] flex-1">{log.message}</span>
              <span className="text-[#6B6966]">{log.affectedDocs} docs</span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
