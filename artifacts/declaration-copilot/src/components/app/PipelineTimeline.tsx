import { Check, Circle, Loader2, X } from "lucide-react";
import type { PipelineStep } from "@workspace/api-client-react";

function StepIcon({ state }: { state: PipelineStep["state"] }) {
  if (state === "completed") return <Check className="w-3.5 h-3.5 text-[#2F7A4A]" />;
  if (state === "current") return <Loader2 className="w-3.5 h-3.5 text-[#1A6B5E] animate-spin" />;
  if (state === "blocked") return <X className="w-3.5 h-3.5 text-[#B83232]" />;
  return <Circle className="w-3 h-3 text-[#6B6966]/50" />;
}

export function PipelineTimeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-5">
      <h3 className="text-[13px] font-semibold text-[#1C1A16] mb-4">Pipeline Timeline</h3>
      <ol className="relative">
        {steps.map((step, i) => (
          <li key={step.id} className="flex gap-3 pb-5 last:pb-0 relative">
            {i < steps.length - 1 && (
              <span
                className={`absolute left-[11px] top-6 w-px h-[calc(100%-12px)] ${
                  step.state === "completed" ? "bg-[#2F7A4A]/40" : "bg-black/[0.08]"
                }`}
              />
            )}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 border ${
                step.state === "completed"
                  ? "bg-green-50 border-green-200"
                  : step.state === "current"
                    ? "bg-[#1A6B5E]/10 border-[#1A6B5E]/30"
                    : step.state === "blocked"
                      ? "bg-red-50 border-red-200"
                      : "bg-[#F4F3EF] border-black/[0.06]"
              }`}
            >
              <StepIcon state={step.state} />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-[#1C1A16]">{step.label}</span>
                <span
                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                    step.actor === "skill"
                      ? "bg-[#1A6B5E]/10 text-[#1A6B5E]"
                      : step.actor === "tool"
                        ? "bg-[#E8A020]/15 text-[#8B6914]"
                        : "bg-[#ECE8E1] text-[#6B6966]"
                  }`}
                >
                  {step.actorName}
                </span>
              </div>
              <p className="text-[11px] text-[#6B6966] mt-0.5 leading-relaxed">{step.explanation}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
