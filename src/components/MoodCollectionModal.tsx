import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Play, Star, X } from "lucide-react";
import type { MoodCategory, Movie } from "../types";

type Props = {
  mood: MoodCategory | null;
  movies: Movie[];
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
};

const MoodCollectionModal: React.FC<Props> = ({ mood, movies, onClose, onSelectMovie }) => {
  const [platform, setPlatform] = useState("all");
  const platforms = useMemo(() => Array.from(new Set(movies.flatMap(movie => movie.platforms || []))), [movies]);
  const filtered = useMemo(
    () => (platform === "all" ? movies : movies.filter(movie => movie.platforms?.includes(platform))),
    [movies, platform]
  );

  return (
    <AnimatePresence>
      {mood && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] overflow-y-auto bg-black/80 p-4 backdrop-blur-xl md:p-8"
        >
          <button className="fixed inset-0 z-40 cursor-default" onClick={onClose} aria-label="Close mood collection" />
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="relative z-50 mx-auto my-6 max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#08060f] shadow-[0_50px_140px_-30px_rgba(168,85,247,0.65)] pointer-events-auto"
          >
            <div className="relative min-h-[260px] overflow-hidden p-6 md:p-8">
              {mood.bannerImage && <img src={mood.bannerImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 pointer-events-none" />}
              <div className={"absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gradient-to-br blur-[90px] pointer-events-none " + mood.color} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#08060f] via-[#08060f]/82 to-[#08060f]/35 pointer-events-none" />
              <button
                onClick={onClose}
                onPointerUp={onClose}
                className="absolute top-4 right-4 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-black/40 text-white touch-manipulation"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-fuchsia-200">
                  {mood.emoji} Featured Mood
                </div>
                <h2 className="font-display text-5xl tracking-cinema text-white md:text-7xl">{mood.label}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">{mood.description}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/55">
                  <span className="inline-flex items-center gap-1 text-amber-200"><Star className="h-4 w-4 fill-amber-300 stroke-amber-300" /> {movies.length} films</span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span>Trailers, platforms, and instant mood curation</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-4 md:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/80">
                  <Filter className="h-4 w-4 text-fuchsia-300" /> Collection Filters
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setPlatform("all")} className={"rounded-full px-3 py-1 text-xs font-semibold transition " + (platform === "all" ? "bg-fuchsia-500 text-white" : "border border-white/10 bg-white/5 text-white/65 hover:bg-white/10")}>All</button>
                  {platforms.map(p => (
                    <button key={p} onClick={() => setPlatform(p)} className={"rounded-full px-3 py-1 text-xs font-semibold transition " + (platform === p ? "bg-fuchsia-500 text-white" : "border border-white/10 bg-white/5 text-white/65 hover:bg-white/10")}>{p}</button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-sm text-white/45">
                  No movies match this mood/platform combination yet.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map(movie => (
                    <button key={movie.id} onClick={() => onSelectMovie(movie)} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] text-left transition hover:-translate-y-1 hover:border-fuchsia-400/35 hover:shadow-[0_26px_70px_-30px_rgba(217,70,239,0.7)]">
                      <div className="relative aspect-video overflow-hidden">
                        <img src={movie.backdrop || movie.poster} alt={movie.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                        <div className="absolute bottom-3 left-3 rounded-full bg-white/10 p-2 backdrop-blur ring-1 ring-white/20">
                          <Play className="h-4 w-4 fill-white text-white" />
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="line-clamp-1 text-sm font-bold text-white">{movie.title}</div>
                        <div className="mt-1 text-xs text-white/50">{movie.year} • {movie.platforms.slice(0, 2).join(" / ")}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MoodCollectionModal;