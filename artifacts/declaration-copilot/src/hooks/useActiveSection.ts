import { useEffect, useState } from "react";

const SECTION_IDS = [
  "hero",
  "what-it-does",
  "ai-role",
  "anomaly-detection",
  "bilingual-messages",
  "deployment-scale",
  "cta-footer",
];

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const elements = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries[0];
          const id = topEntry.target.id;
          const index = SECTION_IDS.indexOf(id);
          if (index !== -1) setActiveSection(index);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -45% 0px",
        threshold: [0.15, 0.3, 0.45, 0.6, 0.75],
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return {
    activeSection,
    totalSections: SECTION_IDS.length,
  };
}
