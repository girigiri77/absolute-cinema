import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import MovieCard from "./MovieCard";
import type { Movie } from "../types";

type Props = {
  movies: Movie[];
  onSelect: (m: Movie) => void;
  showNew?: boolean;
  size?: "sm" | "md" | "lg";
  emptyText?: string;
};

const CardRow: React.FC<Props> = ({ movies, onSelect, showNew, size, emptyText }) => {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });
  };

  if (!movies.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-sm text-white/45">
        {emptyText || "No films match your filters yet."}
      </div>
    );
  }

  return (
    <div className="group/row relative">
      <button
        onClick={() => scrollBy(-1)}
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 -translate-x-3 rounded-full bg-black/60 p-2 text-white opacity-0 ring-1 ring-white/20 backdrop-blur transition group-hover/row:opacity-100 md:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scrollBy(1)}
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-3 rounded-full bg-black/60 p-2 text-white opacity-0 ring-1 ring-white/20 backdrop-blur transition group-hover/row:opacity-100 md:flex"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
      >
        {movies.map(m => (
          <div key={m.id} className="snap-start">
            <MovieCard movie={m} onClick={onSelect} showNew={showNew} size={size} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default CardRow;
