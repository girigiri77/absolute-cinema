import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Play, Flame } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import type { Movie } from "../types";
import { formatMovieRuntime, formatSeriesInfo } from "../utils/runtime";

type Props = {
  movies: Movie[];
};

const Trending: React.FC<Props> = ({ movies }) => {
  const list = useMemo(
    () =>
      [...movies]
        .filter(m => m.isTrending)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10),
    [movies]
  );

  return (
    <section id="trending" className="relative mx-auto max-w-7xl px-3 sm:px-4 py-16 sm:py-20">
      <SectionHeader
        eyebrow="Trending Now"
        title="The Most Watched This Week"
        subtitle="Numbered, ranked, undeniable. The cinematic moments everyone's talking about right now."
      />

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-sm text-white/45">
          No trending titles yet. Mark some movies as trending from Studio.
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {list.map((m, idx) => (
            <Link key={m.id} to={`/movie/${m.slug}`}>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0817] text-left shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] transition hover:shadow-[0_30px_70px_-15px_rgba(168,85,247,0.55)]"
              >
                <div className="relative aspect-backdrop overflow-hidden">
                  <img
                    src={m.backdrop || m.poster}
                    alt={m.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  {/* Big rank number */}
                  <div
                    className="absolute -left-2 -bottom-6 font-display text-[7rem] leading-none text-white/15 mix-blend-screen"
                    style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}
                  >
                    {idx + 1 < 10 ? "0" + (idx + 1) : idx + 1}
                  </div>
                  {/* Trending pill */}
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-orange-500 to-red-600 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                    <Flame className="h-3 w-3" /> TRENDING
                  </div>
                  {/* Play */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="rounded-full bg-white/10 p-3 backdrop-blur ring-1 ring-white/30">
                      <Play className="h-7 w-7 fill-white text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="min-w-0">
                      <div className="line-clamp-1 text-sm sm:text-base font-bold text-white">{m.title}</div>
                      <div className="mt-0.5 line-clamp-1 text-xs text-white/55">
                        {m.type} • {m.type === "Movie" ? (m.runtime ? formatMovieRuntime(m.runtime) : "") : formatSeriesInfo(m.currentSeason, m.currentSeasonEpisodeCount, m.episodeRuntime)}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 rounded-md bg-amber-400/15 px-1.5 sm:px-2 py-0.5 text-xs font-semibold text-amber-200">
                      <Star className="h-3 w-3 fill-amber-300 stroke-amber-300" /> {m.rating.toFixed(1)}
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5">
                    {m.platforms.slice(0, 3).map(p => (
                      <span key={p} className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-white/80">{p}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Trending;
