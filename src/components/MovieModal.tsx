import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import { X, Star, Clock, Calendar, Play, Plus, Share2 } from "lucide-react";
import type { Movie } from "../types";
import { useMovies } from "../context/MoviesContext";

type Props = {
  movie: Movie | null;
  onClose: () => void;
};

const toEmbed = (url: string) => {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;

  const ytMatch = url.match(/(?:youtu\.be\/|v=)([\w-]+)/);

  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  return url;
};

const MovieModal: React.FC<Props> = ({ movie, onClose }) => {
  const { moods } = useMovies();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (movie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [movie]);

  return (
    <>
      {movie && (
        <Helmet>
          <title>
            {movie.title} OTT Release Date & Streaming Platform | Absolute
            Cinema
          </title>

          <meta
            name="description"
            content={`Discover ${movie.title} OTT release date, streaming platform, cast, trailer, reviews and latest updates on Absolute Cinema.`}
          />

          <meta
            name="keywords"
            content={`${movie.title}, OTT release, ${movie.platforms.join(
              ", "
            )}, Telugu movies, Netflix, Prime Video, Disney Hotstar, streaming`}
          />

          <meta
            property="og:title"
            content={`${movie.title} | Absolute Cinema`}
          />

          <meta
            property="og:description"
            content={`Watch ${movie.title} OTT updates, reviews and streaming details.`}
          />

          <meta property="og:image" content={movie.poster} />

          <meta property="og:type" content="website" />

          <meta
            property="og:url"
            content={`https://www.absolutecinema.live`}
          />
        </Helmet>
      )}

      <AnimatePresence>
        {movie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] overflow-y-auto p-4 md:p-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={onClose}
            />

            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="relative z-10 mx-auto flex min-h-fit max-h-[90vh] sm:max-h-[85vh] w-full max-w-6xl flex-col overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-[#08060f] shadow-[0_50px_120px_-20px_rgba(168,85,247,0.4)] [scrollbar-color:rgba(217,70,239,0.65)_rgba(255,255,255,0.06)] [scrollbar-width:thin]"
            >
              {/* Backdrop / Trailer area */}
              <div className="relative aspect-video w-full flex-shrink-0 overflow-hidden">
                {movie.trailerUrl ? (
                  <iframe
                    src={
                      toEmbed(movie.trailerUrl) +
                      "?autoplay=1&mute=1&controls=1&rel=0"
                    }
                    title={movie.title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <img
                    src={movie.backdrop || movie.poster}
                    className="h-full w-full object-cover"
                    alt={movie.title}
                  />
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#08060f] to-transparent" />

                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white ring-1 ring-white/15 backdrop-blur hover:bg-black/80"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid flex-shrink-0 gap-4 p-4 pb-10 sm:gap-6 sm:p-6 sm:pb-12 md:grid-cols-[160px_1fr] md:p-8 md:pb-12">
                <div className="hidden md:block">
                  <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_50px_-20px_rgba(168,85,247,0.5)]">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="aspect-poster w-full object-cover"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <h2 className="text-2xl font-bold text-white md:text-3xl">
                    {movie.title}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/65">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
                      {movie.rating.toFixed(1)}
                      <span className="text-white/40">IMDb</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {movie.releaseDate || movie.year}
                    </span>

                    {movie.runtime ? (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {movie.runtime}m
                      </span>
                    ) : null}

                    <span className="rounded border border-white/15 px-1.5 py-0.5 text-xs">
                      {movie.type}
                    </span>

                    {movie.language && (
                      <span className="rounded border border-white/15 px-1.5 py-0.5 text-xs">
                        {movie.language}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
                    {movie.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {movie.genres.map((g) => (
                      <span
                        key={g}
                        className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/80"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  {movie.moods.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {movie.moods.map((mid) => {
                        const m = moods.find((x) => x.id === mid);

                        if (!m) return null;

                        return (
                          <span
                            key={mid}
                            className={
                              "rounded-full bg-gradient-to-r px-2.5 py-1 text-xs font-medium text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] " +
                              m.color
                            }
                          >
                            {m.emoji} {m.label}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {movie.platforms.length > 0 && (
                    <div className="mt-5">
                      <div className="text-xs uppercase tracking-wider text-white/40">
                        Streaming on
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {movie.platforms.map((p) => (
                          <span
                            key={p}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    {movie.trailerUrl && (
                      <a
                        href={movie.trailerUrl.replace(
                          "/embed/",
                          "/watch?v="
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-5px_rgba(168,85,247,0.6)] transition hover:scale-[1.03]"
                      >
                        <Play className="h-4 w-4 fill-white" />
                        Watch Trailer
                      </a>
                    )}

                    <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/10">
                      <Plus className="h-4 w-4" />
                      My List
                    </button>

                    <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/10">
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MovieModal;