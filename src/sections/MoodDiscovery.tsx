import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import type { MoodCategory, Movie } from "../types";
import { getMoodMovieCount } from "../utils/moodCollections";

type Props = {
  movies: Movie[];
  moods: MoodCategory[];
  selected: string | null;
  onSelect: (id: string | null) => void;
};

const MoodDiscovery: React.FC<Props> = ({ movies, moods, selected, onSelect }) => {
  const visibleMoods = [...moods].filter(m => m.visible).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="moods" className="relative mx-auto max-w-7xl px-3 sm:px-4 py-16 sm:py-20">
      <SectionHeader
        eyebrow="Mood Discovery"
        title="What Are You Feeling Today?"
        subtitle="Cinema speaks the language of emotion. Pick a mood and we'll curate a universe of films just for you."
        right={
          selected && (
            <button
              onClick={() => onSelect(null)}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              Clear mood filter
            </button>
          )
        }
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
        className="grid grid-cols-2 gap-2.5 xs:gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        {visibleMoods.map(m => {
          const active = selected === m.id;
          const count = getMoodMovieCount(m, movies);
          return (
            <motion.button
              key={m.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4 }}
              onClick={() => onSelect(active ? null : m.id)}
              className={
                "group relative overflow-hidden rounded-2xl border p-3 sm:p-4 text-left transition min-h-[130px] xs:min-h-[150px] " +
                (active
                  ? "border-fuchsia-400/60 bg-white/5 shadow-[0_20px_50px_-10px_rgba(168,85,247,0.7)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20")
              }
            >
              {m.bannerImage && (
                <img
                  src={m.bannerImage}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-20 transition duration-500 group-hover:scale-110 group-hover:opacity-30"
                />
              )}
              {/* Glow gradient on hover */}
              <div className={"pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br opacity-0 transition group-hover:opacity-40 " + m.color} />
              <div
                className={"pointer-events-none absolute -bottom-12 -right-8 h-28 w-28 rounded-full bg-gradient-to-br blur-2xl opacity-30 " + m.color}
                style={{ boxShadow: `0 0 42px ${m.glowColor}` }}
              />

              <div className="relative">
                {m.featured && (
                  <div className="mb-2 inline-flex rounded-full border border-fuchsia-300/25 bg-fuchsia-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-fuchsia-100">
                    Featured
                  </div>
                )}
                <div className="text-3xl">{m.emoji}</div>
                <div className="mt-3 text-base font-bold text-white">{m.label}</div>
                {m.description && <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/45">{m.description}</p>}
                <div className="mt-0.5 text-[11px] uppercase tracking-wider text-white/45">
                  {count} {count === 1 ? "film" : "films"}
                </div>
              </div>

              {active && (
                <motion.div
                  layoutId="mood-ring"
                  className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-fuchsia-400/70"
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
};

export default MoodDiscovery;
