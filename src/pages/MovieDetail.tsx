import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Star, Clock, Calendar, Play, Plus, Share2, ArrowLeft } from "lucide-react";
import type { Movie } from "../types";
import { moviesApi } from "../lib/supabase-api";
import { formatReleaseDate, formatMovieRuntime, formatSeriesInfo } from "../utils/runtime";
import PlatformCard from "../components/PlatformCard";

const toEmbed = (url: string) => {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;

  const ytMatch = url.match(/(?:youtu\.be\/|v=)([\w-]+)/);

  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  return url;
};

const MovieDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await moviesApi.getBySlug(slug);
        if (data) {
          setMovie(data);
          // Fetch related movies with relevance scoring
          const allMovies = await moviesApi.getAll();
          const related = allMovies
            .filter(m => m.id !== data.id)
            .map(m => {
              let score = 0;
              
              // +3 points for each matching genre
              const matchingGenres = m.genres.filter(g => data.genres.includes(g));
              score += matchingGenres.length * 3;
              
              // +2 points for each matching language
              if (m.language && data.language && m.language === data.language) {
                score += 2;
              }
              
              // +2 points for matching OTT platform
              const matchingPlatforms = m.platforms.filter(p => data.platforms.includes(p));
              score += matchingPlatforms.length * 2;
              
              // +1 point if rating difference is less than 1.0
              if (Math.abs(m.rating - data.rating) < 1.0) {
                score += 1;
              }
              
              return { movie: m, score };
            })
            .sort((a, b) => {
              // Sort by score descending, then by rating descending for ties
              if (b.score !== a.score) {
                return b.score - a.score;
              }
              return b.movie.rating - a.movie.rating;
            })
            .slice(0, 6)
            .map(item => item.movie);
          setRelatedMovies(related);
        } else {
          setError("Movie not found");
        }
      } catch (err) {
        console.error("Error fetching movie:", err);
        setError("Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08060f] flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#08060f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="text-fuchsia-400 hover:text-fuchsia-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
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
          )}, Telugu movies, Netflix, Prime Video, JioHotstar, streaming`}
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
          content={`https://www.absolutecinema.live/movie/${movie.slug}`}
        />

        <link rel="canonical" href={`https://www.absolutecinema.live/movie/${movie.slug}`} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#08060f]"
      >
        {/* Content Section */}
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-sm text-white/60 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

          <div className="flex flex-col gap-6 md:grid md:gap-8 md:grid-cols-[200px_1fr]">
            {/* Poster */}
            <div className="flex justify-center md:contents">
              <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_50px_-20px_rgba(168,85,247,0.5)] w-[180px] sm:w-[200px] md:w-full">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="aspect-poster w-full object-cover"
                />
              </div>
            </div>

            {/* Movie Details */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-white md:text-4xl">
                {movie.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/65">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
                  {movie.rating.toFixed(1)}
                  <span className="text-white/40">IMDb</span>
                </span>

                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {movie.releaseDate ? formatReleaseDate(movie.releaseDate) : movie.year}
                </span>

                {movie.type === "Movie" ? (
                  movie.runtime ? (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatMovieRuntime(movie.runtime)}
                    </span>
                  ) : null
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatSeriesInfo(movie.totalSeasons, movie.totalEpisodes, movie.episodeRuntime)}
                  </span>
                )}

                <span className="rounded border border-white/15 px-1.5 py-0.5 text-xs">
                  {movie.type}
                </span>

                {movie.language && (
                  <span className="rounded border border-white/15 px-1.5 py-0.5 text-xs">
                    {movie.language}
                  </span>
                )}
              </div>

              <p className="mt-6 text-base leading-relaxed text-white/75 md:text-lg">
                {movie.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {movie.platforms.length > 0 && (
                <div className="mt-8">
                  <div className="text-xs uppercase tracking-wider text-white/40">
                    Streaming on
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 md:gap-3">
                    {movie.platforms.map((p) => (
                      <PlatformCard key={p} platform={p} watchUrl={movie.watchUrl} />
                    ))}
                  </div>
                </div>
              )}

              {movie.watchUrl && (
                <div className="mt-6 sm:mt-8">
                  <a
                    href={movie.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-5px_rgba(168,85,247,0.6)] transition hover:scale-[1.03] min-h-[44px]"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    Watch Now
                  </a>
                </div>
              )}

              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
                {movie.trailerUrl && (
                  <button
                    onClick={() => {
                      const trailerSection = document.getElementById('trailer-section');
                      if (trailerSection) {
                        trailerSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-5px_rgba(168,85,247,0.6)] transition hover:scale-[1.03] min-h-[44px]"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    Watch Trailer
                  </button>
                )}

                <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 min-h-[44px]">
                  <Plus className="h-4 w-4" />
                  My List
                </button>

                <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 min-h-[44px]">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Trailer Section */}
          {movie.trailerUrl && (
            <div id="trailer-section" className="mt-10 sm:mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Trailer</h2>
              <div className="relative aspect-[16/10] md:aspect-video w-full overflow-hidden rounded-xl border border-white/10">
                <iframe
                  src={
                    toEmbed(movie.trailerUrl) +
                    "?autoplay=0&mute=0&controls=1&rel=0"
                  }
                  title={movie.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          )}

          {/* Related Movies Section */}
          {relatedMovies.length > 0 && (
            <div className="mt-10 sm:mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Related Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {relatedMovies.map((relatedMovie) => (
                  <div
                    key={relatedMovie.id}
                    onClick={() => navigate(`/movie/${relatedMovie.slug}`)}
                    className="group cursor-pointer"
                  >
                    <div className="overflow-hidden rounded-lg border border-white/10 transition group-hover:border-fuchsia-500/50">
                      <img
                        src={relatedMovie.poster}
                        alt={relatedMovie.title}
                        className="aspect-poster w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-2 text-xs sm:text-sm font-medium text-white group-hover:text-fuchsia-400 transition line-clamp-1">
                      {relatedMovie.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-white/60">{relatedMovie.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default MovieDetail;
