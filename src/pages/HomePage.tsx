import React, { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useMovies } from "../context/MoviesContext";
import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import WeeklyReleases from "../sections/WeeklyReleases";
import MoodDiscovery from "../sections/MoodDiscovery";
import Trending from "../sections/Trending";
import TeluguPicks from "../sections/TeluguPicks";
import Footer from "../sections/Footer";
import MovieModal from "../components/MovieModal";
import MoodCollectionModal from "../components/MoodCollectionModal";
import CardRow from "../components/CardRow";
import SectionHeader from "../components/SectionHeader";
import type { Movie } from "../types";
import { getMoviesForMood } from "../utils/moodCollections";

const HomePage: React.FC = () => {
  const { movies, moods, toggles, loading, error } = useMovies();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const selected = useMemo(
    () => movies.find(m => m.id === selectedId) || null,
    [movies, selectedId]
  );

  const weeklyReleaseMovies = useMemo(
    () => movies.filter(movie => movie.isWeeklyRelease),
    [movies]
  );
  const trendingMovies = useMemo(
    () => movies.filter(movie => movie.isTrending),
    [movies]
  );
  const teluguPickMovies = useMemo(
    () => movies.filter(movie => movie.isTeluguPick || movie.isTelugu),
    [movies]
  );

  const getMoviesByMood = useCallback(
    (selectedMood: string) => getMoviesForMood(moods.find(item => item.id === selectedMood), movies),
    [movies, moods]
  );

  const selectedMoodMovies = useMemo(
    () => (mood ? getMoviesByMood(mood) : []),
    [getMoviesByMood, mood]
  );
  const selectedMood = useMemo(
    () => (mood ? moods.find(item => item.id === mood) || null : null),
    [mood, moods]
  );

  const searchMovies = useMemo(() => {
    let list = movies;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.genres?.some(g => g.toLowerCase().includes(q)) ||
        m.platforms?.some(p => p.toLowerCase().includes(q)) ||
        m.moods?.some(md => (moods.find(x => x.id === md)?.label || md).toLowerCase().includes(q)) ||
        m.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [movies, moods, query]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleExploreMoods = () => scrollTo("moods");
  const handleBrowseFilms = () => scrollTo("releases");
  const handleScrollToContent = () => {
    const firstSection = document.querySelector("section[id]") as HTMLElement;
    if (firstSection) {
      firstSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const moodLabel = mood ? moods.find(m => m.id === mood)?.label || mood : null;
  const activeResultCount = mood ? selectedMoodMovies.length : searchMovies.length;
  const selectMovie = useCallback((movie: Movie) => setSelectedId(movie.id), []);
  const handleMoodSelect = useCallback((nextMood: string | null) => {
    setMood(nextMood);
    if (nextMood) {
      window.setTimeout(() => scrollTo("mood-results"), 0);
    }
  }, [scrollTo]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden">
        <div className="pointer-events-none fixed inset-0 -z-10 no-x-overflow">
          <div className="absolute inset-0 cinema-radial" />
        </div>
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-fuchsia-500/30 border-t-fuchsia-500 mx-auto" />
          <p className="text-white/60 text-lg">Loading your cinema...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden">
        <div className="pointer-events-none fixed inset-0 -z-10 no-x-overflow">
          <div className="absolute inset-0 cinema-radial" />
        </div>
        <div className="text-center max-w-md px-4">
          <div className="mb-4 text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Failed to load data</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-6 py-3 text-sm font-bold text-white hover:scale-[1.02] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Persistent ambient gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 no-x-overflow">
        <div className="absolute inset-0 cinema-radial" />
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 h-[30rem] w-[30rem] rounded-full bg-purple-700/15 blur-[140px]" />
      </div>

      <Navbar onSearch={setQuery} onScrollTo={scrollTo} />

      <Hero
        onExploreMoods={handleExploreMoods}
        onBrowseFilms={handleBrowseFilms}
        onScrollToContent={handleScrollToContent}
      />

      {/* Filter banner when filters are active */}
      {(mood || query) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-[80px] z-30 mx-auto mt-6 max-w-7xl px-4"
        >
          <div className="glass-strong flex flex-wrap items-center gap-2 sm:gap-3 rounded-2xl px-3 sm:px-4 py-3 text-xs sm:text-sm">
            <span className="text-white/55">Active filters:</span>
            {mood && (
              <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-fuchsia-200 ring-1 ring-fuchsia-400/30">
                Mood: {moodLabel}
              </span>
            )}
            {query && (
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-200 ring-1 ring-blue-400/30">
                Search: "{query}"
              </span>
            )}
            <span className="text-white/55">{activeResultCount} results</span>
            <button
              onClick={() => { setMood(null); setQuery(""); }}
              className="ml-auto rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 hover:bg-white/10"
            >
              Clear all
            </button>
          </div>
        </motion.div>
      )}

      {query.trim() && (
        <section id="search-results" className="relative mx-auto max-w-7xl px-3 sm:px-4 py-12 sm:py-16">
          <SectionHeader
            eyebrow="Search Results"
            title="Matched From Your Studio Catalog"
            subtitle={`Live results for "${query}" from the same admin-managed movie store.`}
          />
          <CardRow movies={searchMovies} onSelect={selectMovie} emptyText="No movies match your search yet. Add or edit titles in Studio." />
        </section>
      )}

      {toggles.weeklyReleases && (
        <WeeklyReleases movies={weeklyReleaseMovies} onSelect={selectMovie} />
      )}
      {toggles.moodDiscovery && (
        <>
          <MoodDiscovery movies={movies} moods={moods} selected={mood} onSelect={handleMoodSelect} />
          {mood && (
            <section id="mood-results" className="relative mx-auto max-w-7xl px-3 sm:px-4 pb-12">
              <SectionHeader
                eyebrow="Mood Results"
                title={`${moodLabel} Cinema Picks`}
                subtitle="Pulled from the full catalog, independent of weekly release status."
              />
              <CardRow
                movies={selectedMoodMovies}
                onSelect={selectMovie}
                emptyText={`No ${moodLabel} titles yet. Add or edit moods from Studio.`}
              />
            </section>
          )}
        </>
      )}
      {toggles.trending && (
        <Trending movies={trendingMovies} onSelect={selectMovie} />
      )}
      {toggles.teluguPicks && (
        <TeluguPicks movies={teluguPickMovies} onSelect={selectMovie} />
      )}

      <Footer />

      <MovieModal movie={selected} onClose={() => setSelectedId(null)} />
      <MoodCollectionModal
        mood={selectedMood}
        movies={selectedMoodMovies}
        onClose={() => setMood(null)}
        onSelectMovie={selectMovie}
      />
    </div>
  );
};

export default HomePage;
