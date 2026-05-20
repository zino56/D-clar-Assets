import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface SectionCounterProps {
  activeSection: number;
  totalSections: number;
}

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

export function SectionCounter({ activeSection, totalSections }: SectionCounterProps) {
  const shouldReduce = useReducedMotion();
  const displayNumber = formatNumber(activeSection + 1);
  const totalNumber = formatNumber(totalSections);

  return (
    <div
      aria-label={`Section ${activeSection + 1} sur ${totalSections}`}
      className="hidden md:flex items-center rounded-full border border-black/10 bg-white/70 backdrop-blur-sm px-3 py-2"
    >
      <div className="relative h-[18px] w-[24px] overflow-hidden text-right tabular-nums">
        {shouldReduce ? (
          <span className="block text-[13px] font-medium text-[#1C1A16]">
            {displayNumber}
          </span>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={displayNumber}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 block text-[13px] font-medium text-[#1C1A16]"
            >
              {displayNumber}
            </motion.span>
          </AnimatePresence>
        )}
      </div>

      <span className="mx-1.5 text-[13px] text-[#6B6966] tabular-nums">/</span>

      <span className="text-[13px] text-[#6B6966] tabular-nums">
        {totalNumber}
      </span>
    </div>
  );
}
