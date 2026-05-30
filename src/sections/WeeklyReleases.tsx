import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import CardRow from "../components/CardRow";
import type { Movie } from "../types";

type Props = {
  movies: Movie[];
};

const TABS = [
  { id: "all", label: "All" },
  { id: "movies", label: "Movies" },
  { id: "series", label: "Series" },
  { id: "telugu", label: "Telugu" },
  { id: "trending", label: "Trending" },
] as const;

type TabId = typeof TABS[number]["id"];

const WeeklyReleases: React.FC<Props> = ({ movies }) => {
  const [tab, setTab] = useState<TabId>("all");

  const weekly = useMemo(() => movies.filter(m => m.isWeeklyRelease), [movies]);

  const filtered = useMemo(() => {
    const base = weekly;
    switch (tab) {
      case "movies": return base.filter(m => m.type === "Movie");
      case "series": return base.filter(m => m.type === "Series");
      case "telugu": return base.filter(m => m.isTeluguPick || m.isTelugu);
      case "trending": return base.filter(m => m.isTrending);
      default: return base;
    }
  }, [tab, weekly]);

  return (
    <section id="releases" className="relative mx-auto max-w-[90rem] px-3 sm:px-4 py-16 sm:py-20">
      <SectionHeader
        eyebrow="This Week"
        title="OTT Releases You Can't Miss"
        subtitle="Fresh drops, exclusive premieres, and the most-talked-about titles streaming this week across every platform."
        right={
          <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={
                  "relative shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition min-h-[36px] " +
                  (tab === t.id
                    ? "text-white"
                    : "text-white/55 hover:text-white")
                }
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 -z-0 rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-600 shadow-[0_5px_25px_-5px_rgba(168,85,247,0.7)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        }
      />
      <CardRow movies={filtered} showNew size="xl" gap="lg" emptyText="No new releases in this category. Try another tab." />
    </section>
  );
};

export default WeeklyReleases;
