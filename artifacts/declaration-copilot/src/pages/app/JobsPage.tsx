import { Play, Clock, CheckCircle, AlertTriangle, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "../../components/app/AppShell";
import { jobs, jobLogs } from "../../data/mockData";
import type { Job, JobLog } from "../../data/mockData";

const jobStatusConfig = {
  running:   { label: "En cours",    className: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500 animate-pulse" },
  idle:      { label: "Inactif",     className: "bg-gray-50 text-gray-600 border-gray-200",   dot: "bg-gray-400" },
  error:     { label: "Erreur",      className: "bg-red-50 text-red-700 border-red-200",       dot: "bg-red-500" },
  scheduled: { label: "Planifié",    className: "bg-blue-50 text-blue-700 border-blue-200",   dot: "bg-blue-400" },
};

const logResultConfig = {
  success: { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50" },
  error:   { icon: AlertTriangle, color: "text-red-600", bgColor: "bg-red-50" },
  warning: { icon: AlertTriangle, color: "text-amber-600", bgColor: "bg-amber-50" },
};

function JobCard({ job }: { job: Job }) {
  const s = jobStatusConfig[job.status];
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-black/[0.06] p-5 flex flex-col gap-4 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
            <code className="text-[12px] font-mono font-semibold text-[#1C1A16]">{job.name}</code>
          </div>
          <p className="text-[12px] text-[#6B6966] leading-[1.5]">{job.description}</p>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex-shrink-0 ${s.className}`}>{s.label}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Prochain run", value: job.nextRun, icon: Clock },
          { label: "Dernier run", value: job.lastRun, icon: Activity },
          { label: "Durée", value: job.duration, icon: CheckCircle },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-[#F4F3EF]/60 rounded-xl p-2.5">
            <Icon className="w-3 h-3 text-[#6B6966] mb-1" />
            <div className="text-[11px] text-[#6B6966]">{label}</div>
            <div className="text-[12px] font-semibold text-[#1C1A16] mt-0.5">{value}</div>
          </div>
        ))}
      </div>

      <button className="flex items-center gap-2 text-[12px] font-medium text-[#1A6B5E] hover:text-[#145549] transition-colors w-fit">
        <Play className="w-3.5 h-3.5" /> Exécuter maintenant
      </button>
    </motion.div>
  );
}

function LogRow({ log }: { log: JobLog }) {
  const r = logResultConfig[log.result];
  const Icon = r.icon;
  return (
    <tr className="hover:bg-[#F4F3EF]/40 transition-colors">
      <td className="px-4 py-3">
        <code className="text-[11px] font-mono text-[#1C1A16]">{log.job}</code>
      </td>
      <td className="px-4 py-3 text-[11px] text-[#6B6966]">{log.time}</td>
      <td className="px-4 py-3">
        <div className={`flex items-center gap-1.5 w-fit rounded-lg px-2 py-0.5 ${r.bgColor}`}>
          <Icon className={`w-3 h-3 ${r.color}`} />
          <span className={`text-[10px] font-semibold capitalize ${r.color}`}>{log.result}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-[12px] text-[#1C1A16] font-medium">{log.affectedDocs}</td>
      <td className="px-4 py-3 text-[12px] text-[#6B6966]">{log.message}</td>
    </tr>
  );
}

export default function JobsPage() {
  return (
    <AppShell
      title="Jobs"
      subtitle="Tâches planifiées et exécutions récentes"
    >
      <div className="px-6 py-5 max-w-[1200px] mx-auto">
        {/* Scheduled jobs */}
        <div className="mb-6">
          <div className="text-[13px] font-semibold text-[#1C1A16] mb-3">Tâches planifiées</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </div>

        {/* System health strip */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-4 mb-6">
          <div className="text-[12px] font-semibold text-[#1C1A16] mb-3">État du système</div>
          <div className="flex flex-wrap gap-3">
            {[
              { service: "Service OCR", status: "OK", ok: true },
              { service: "Hermes (IA)", status: "Connecté", ok: true },
              { service: "Cache", status: "Warm", ok: true },
              { service: "Export Worker", status: "Inactif", ok: true },
              { service: "Base de données", status: "OK", ok: true },
            ].map(({ service, status, ok }) => (
              <div key={service} className="flex items-center gap-2 bg-[#F4F3EF]/60 border border-black/[0.04] rounded-xl px-3 py-2">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ok ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-[12px] font-medium text-[#1C1A16]">{service}</span>
                <span className="text-[11px] text-[#6B6966]">{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Job logs table */}
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-black/[0.06]">
            <span className="text-[13px] font-semibold text-[#1C1A16]">Historique des exécutions</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-[#F4F3EF]/60">
                  {["Job", "Heure", "Résultat", "Docs affectés", "Message"].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold text-[#6B6966] uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {jobLogs.map(log => <LogRow key={log.id} log={log} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
