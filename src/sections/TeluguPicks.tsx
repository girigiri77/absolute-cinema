import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Play, Star, Quote } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import type { Movie } from "../types";

type Props = {
  movies: Movie[];
  onSelect: (m: Movie) => void;
};

const TeluguPicks: React.FC<Props> = ({ movies, onSelect }) => {
  const list = useMemo(() => movies.filter(m => m.isTeluguPick || m.isTelugu).slice(0, 6), [movies]);

  return (
    <section id="telugu" className="relative px-3 sm:px-4 py-16 sm:py-24">
      {/* Cinematic gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.18),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Editorial Picks"
          title="Curated Telugu Picks"
          subtitle="Handpicked cinematic excellence from Telugu cinema — bold storytelling, raw emotion, mass spectacle."
        />

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-sm text-white/45">
            No Telugu films curated yet. Add some from Studio.
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            <FeaturedTeluguCard movie={list[0]} onSelect={onSelect} />
            {list.length > 1 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {list.slice(1).map((m, i) => (
                  <CompactTeluguCard key={m.id} movie={m} index={i} onSelect={onSelect} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const FeaturedTeluguCard: React.FC<{ movie: Movie; onSelect: (m: Movie) => void }> = ({ movie, onSelect }) => (
  <motion.button
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6 }}
    whileHover={{ y: -4, scale: 1.01 }}
    onClick={() => onSelect(movie)}
    className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a0614]/80 p-3 text-left shadow-[0_28px_75px_-28px_rgba(168,85,247,0.55)] backdrop-blur-xl transition hover:border-fuchsia-400/30 hover:shadow-[0_34px_90px_-28px_rgba(217,70,239,0.72)] md:p-4"
  >
    <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-400/10 to-blue-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    <div className="relative grid gap-3 sm:gap-4 md:h-[220px] md:grid-cols-[40%_1fr] lg:h-[260px] lg:grid-cols-[42%_1fr]">
      <div className="relative min-h-[170px] sm:min-h-[200px] overflow-hidden rounded-2xl border border-white/10 md:min-h-0">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
          Telugu Cinema
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center px-1 py-1 md:px-2 lg:px-4">
        <div className="flex flex-wrap items-center gap-2 text-amber-300">
          <Star className="h-4 w-4 fill-amber-300 stroke-amber-300" />
          <span className="text-sm font-semibold">{movie.rating.toFixed(1)}</span>
          <span className="text-xs text-white/55">• {movie.year} • {movie.runtime}m</span>
        </div>
        <h3 className="mt-1 sm:mt-2 font-display text-2xl tracking-cinema text-white sm:text-3xl lg:text-4xl">
          {movie.title}
        </h3>
        <p className="mt-2 sm:mt-3 line-clamp-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/72 md:text-[15px]">
          <Quote className="mr-1 inline h-3.5 w-3.5 text-fuchsia-300" />
          {movie.description}
        </p>
        <div className="mt-2 sm:mt-4 flex flex-wrap items-center gap-2">
          {movie.genres.slice(0, 3).map(g => (
            <span key={g} className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] text-white/80">
              {g}
            </span>
          ))}
          {movie.platforms.slice(0, 2).map(p => (
            <span key={p} className="rounded-md bg-gradient-to-r from-fuchsia-500/80 to-purple-600/80 px-2 py-0.5 text-[10px] font-bold text-white">
              {p}
            </span>
          ))}
        </div>
        <div className="mt-3 sm:mt-5 inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-2.5 sm:px-3 py-2 text-xs font-semibold text-white backdrop-blur transition group-hover:bg-white/20">
          <Play className="h-3.5 w-3.5 fill-white" /> Watch Trailer
        </div>
      </div>
    </div>
  </motion.button>
);

const CompactTeluguCard: React.FC<{ movie: Movie; index: number; onSelect: (m: Movie) => void }> = ({ movie, index, onSelect }) => (
  <motion.button
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.55, delay: index * 0.04 }}
    whileHover={{ y: -5, scale: 1.01 }}
    onClick={() => onSelect(movie)}
    className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0c0817]/80 p-2 text-left shadow-[0_20px_55px_-28px_rgba(168,85,247,0.55)] backdrop-blur transition hover:border-fuchsia-400/30 hover:shadow-[0_28px_70px_-30px_rgba(217,70,239,0.65)]"
  >
    <div className="grid h-full grid-cols-[100px_1fr] gap-2.5 xs:gap-3 sm:grid-cols-[140px_1fr] lg:grid-cols-[150px_1fr]">
      <div className="relative h-[130px] xs:h-[140px] overflow-hidden rounded-xl border border-white/10 sm:h-[160px] lg:h-[170px]">
        <img
          src={movie.poster || movie.backdrop}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
      </div>
      <div className="flex min-w-0 flex-col justify-center py-1 pr-1">
        <div className="flex items-center gap-1.5 text-xs text-amber-300">
          <Star className="h-3.5 w-3.5 fill-amber-300 stroke-amber-300" />
          <span className="font-semibold">{movie.rating.toFixed(1)}</span>
          <span className="text-white/45">• {movie.year}</span>
        </div>
        <h3 className="mt-1 line-clamp-1 font-display text-xl sm:text-2xl tracking-cinema text-white">
          {movie.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/55">
          {movie.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {movie.genres.slice(0, 2).map(g => (
            <span key={g} className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-[10px] text-white/70">
              {g}
            </span>
          ))}
        </div>
        <div className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/15 bg-white/8 px-2.5 py-1.5 text-[11px] font-semibold text-white/85 transition group-hover:bg-white/15">
          <Play className="h-3 w-3 fill-white" /> Trailer
        </div>
      </div>
    </div>
  </motion.button>
);

export default TeluguPicks;
