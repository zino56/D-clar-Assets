interface ScorePillProps {
  score: number;
  total?: number;
}

export function ScorePill({ score, total = 100 }: ScorePillProps) {
  const color =
    score >= 80 ? "bg-green-50 text-green-700 border-green-200" :
    score >= 50 ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-red-50 text-red-700 border-red-200";
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded border ${color}`}>
      {score}<span className="font-normal opacity-60">/{total}</span>
    </span>
  );
}
