import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: number | string;
  accent?: string;
  sub?: string;
}

export function MetricCard({ label, value, accent = "text-[#1C1A16]", sub }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="bg-white border border-black/[0.06] rounded-xl px-4 py-3 flex flex-col gap-0.5 min-w-[110px]"
    >
      <span className={`text-[22px] font-bold leading-none ${accent}`}>{value}</span>
      <span className="text-[12px] text-[#6B6966] font-medium">{label}</span>
      {sub && <span className="text-[10px] text-[#6B6966]/70">{sub}</span>}
    </motion.div>
  );
}
