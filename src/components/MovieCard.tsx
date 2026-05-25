import React from "react";
import { motion } from "framer-motion";
import { Play, Star, Sparkles } from "lucide-react";
import type { Movie } from "../types";

type Props = {
  movie: Movie;
  onClick?: (m: Movie) => void;
  showNew?: boolean;
  size?: "sm" | "md" | "lg";
};

const platformBadge = (p: string) => {
  const map: Record<string, string> = {
    "Netflix": "bg-red-600/90",
    "Prime Video": "bg-sky-500/90",
    "Hotstar": "bg-indigo-600/90",
    "SonyLIV": "bg-blue-700/90",
    "Aha": "bg-orange-600/90",
    "Zee5": "bg-fuchsia-600/90",
    "JioCinema": "bg-violet-600/90",
    "SunNXT": "bg-amber-600/90",
  };
  return map[p] || "bg-white/20";
};

const MovieCard: React.FC<Props> = ({ movie, onClick, showNew, size = "md" }) => {
  const widthCls = size === "sm" ? "w-32 sm:w-40" : size === "lg" ? "w-44 sm:w-56 md:w-64" : "w-36 sm:w-44 md:w-52";
  return (
    <motion.button
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      onClick={() => onClick?.(movie)}
      className={"group relative shrink-0 text-left " + widthCls}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#100820] shadow-[0_15px_45px_-15px_rgba(0,0,0,0.8)] transition-shadow duration-500 group-hover:shadow-[0_25px_60px_-15px_rgba(168,85,247,0.55)]">
        <div className="aspect-poster relative">
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "data:image/svg+xml;utf8," +
                encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 450'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23a855f7'/><stop offset='1' stop-color='%23ec4899'/></linearGradient></defs><rect width='300' height='450' fill='url(%23g)'/><text x='50%' y='50%' fill='white' font-size='20' font-family='Arial' text-anchor='middle'>${movie.title}</text></svg>`
                );
            }}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          {/* Top badges */}
          <div className="absolute left-1.5 sm:left-2 top-1.5 sm:top-2 flex flex-wrap gap-1">
            {showNew && movie.isWeeklyRelease && (
              <span className="rounded-md bg-gradient-to-r from-fuchsia-500 to-pink-500 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-[0_0_15px_rgba(236,72,153,0.6)]">
                NEW
              </span>
            )}
            {movie.isTrending && !showNew && (
              <span className="flex items-center gap-1 rounded-md bg-orange-600/90 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
                <Sparkles className="h-3 w-3" /> HOT
              </span>
            )}
          </div>
          {/* Rating */}
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/65 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
            {movie.rating.toFixed(1)}
          </div>
          {/* OTT badge */}
          {movie.platforms[0] && (
            <div className="absolute right-2 bottom-2">
              <span className={"rounded px-1.5 py-0.5 text-[10px] font-bold text-white " + platformBadge(movie.platforms[0])}>
                {movie.platforms[0]}
              </span>
            </div>
          )}
          {/* Hover play */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="rounded-full bg-white/10 p-3 backdrop-blur-md ring-1 ring-white/30">
              <Play className="h-7 w-7 fill-white text-white" />
            </div>
          </div>
          {/* Hover gradient border */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-fuchsia-400/0 transition group-hover:ring-fuchsia-400/40" />
        </div>
        <div className="p-3">
          <div className="line-clamp-1 text-sm font-semibold text-white">{movie.title}</div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-white/55">
            <span>{movie.year}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span className="line-clamp-1">{movie.genres.slice(0, 2).join(" • ")}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default MovieCard;
