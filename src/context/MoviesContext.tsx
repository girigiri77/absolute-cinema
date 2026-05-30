import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { MoodCategory, Movie, SectionToggles } from "../types";
import { moviesApi, moodsApi, sectionTogglesApi, subscribeToMovies, subscribeToMoods, subscribeToSectionToggles } from "../lib/supabase-api";
import { deleteImage, isSupabaseStorageUrl, extractBucketFromUrl, verifyStorageBuckets } from "../utils/storage";
import { generateMovieSlug } from "../utils/slug";

type MovieDraft = Omit<Movie, "id" | "createdAt">;
type MoodDraft = Omit<MoodCategory, "id" | "createdAt" | "updatedAt"> & { id?: string };

type Ctx = {
  movies: Movie[];
  moods: MoodCategory[];
  toggles: SectionToggles;
  loading: boolean;
  error: string | null;
  addMovie: (m: MovieDraft) => Promise<void>;
  updateMovie: (id: string, patch: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  getMovieBySlug: (slug: string) => Movie | null;
  addMood: (m: MoodDraft) => Promise<void>;
  updateMood: (id: string, patch: Partial<MoodCategory>) => Promise<void>;
  deleteMood: (id: string) => Promise<void>;
  reorderMoods: (ids: string[]) => Promise<void>;
  setToggles: (t: SectionToggles) => Promise<void>;
  resetData: () => Promise<void>;
  refresh: () => Promise<void>;
};

const MoviesContext = createContext<Ctx | null>(null);

const PLATFORM_ALIASES: Record<string, string> = {
  "Disney+ Hotstar": "JioHotstar",
  "Disney Hotstar": "JioHotstar",
  Hotstar: "JioHotstar",
  ZEE5: "Zee5",
  "Apple TV+": "JioCinema",
};

const normalizeMovie = (movie: Movie): Movie => ({
  ...movie,
  slug: movie.slug || generateMovieSlug(movie.title, movie.year),
  releaseDate: movie.releaseDate || `${movie.year || new Date().getFullYear()}-01-01`,
  platforms: Array.from(new Set((movie.platforms || []).map(p => PLATFORM_ALIASES[p] || p))),
  genres: movie.genres || [],
  moods: movie.moods || [],
  poster: movie.poster || "",
  backdrop: movie.backdrop || movie.poster || "",
  isTelugu: movie.isTelugu ?? movie.isTeluguPick ?? false,
  isTeluguPick: movie.isTeluguPick ?? movie.isTelugu ?? false,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "mood";

export const MoviesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [moods, setMoods] = useState<MoodCategory[]>([]);
  const [toggles, setTogglesState] = useState<SectionToggles>({
    weeklyReleases: true,
    moodDiscovery: true,
    trending: true,
    teluguPicks: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [moviesData, moodsData, togglesData] = await Promise.all([
        moviesApi.getAll(),
        moodsApi.getAll(),
        sectionTogglesApi.get(),
      ]);
      setMovies(moviesData.map(normalizeMovie));
      setMoods(moodsData);
      setTogglesState(togglesData);
      console.log('fetchData - Successfully loaded data:', {
        movies: moviesData.length,
        moods: moodsData.length,
      });
    } catch (err) {
      console.error("fetchData - Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Verify storage buckets on mount
    verifyStorageBuckets();
  }, [fetchData]);

  // Set up real-time subscriptions
  useEffect(() => {
    const moviesSubscription = subscribeToMovies((updatedMovie) => {
      setMovies(prev => {
        const index = prev.findIndex(m => m.id === updatedMovie.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = normalizeMovie(updatedMovie);
          return updated;
        }
        return [normalizeMovie(updatedMovie), ...prev];
      });
    });

    const moodsSubscription = subscribeToMoods((updatedMood) => {
      setMoods(prev => {
        const index = prev.findIndex(m => m.id === updatedMood.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = updatedMood;
          return updated.sort((a, b) => a.sortOrder - b.sortOrder);
        }
        return [...prev, updatedMood].sort((a, b) => a.sortOrder - b.sortOrder);
      });
    });

    const togglesSubscription = subscribeToSectionToggles((updatedToggles) => {
      setTogglesState(updatedToggles);
    });

    return () => {
      moviesSubscription.unsubscribe();
      moodsSubscription.unsubscribe();
      togglesSubscription.unsubscribe();
    };
  }, []);

  const addMovie = useCallback(async (m: MovieDraft) => {
    try {
      console.log('addMovie - Attempting to add movie:', m.title);
      console.log('addMovie - Movie data:', m);
      const movieWithSlug = {
        ...m,
        slug: m.slug || generateMovieSlug(m.title, m.year),
      };
      const newMovie = await moviesApi.create(movieWithSlug);
      console.log('addMovie - Successfully added movie:', newMovie);
      setMovies(prev => [normalizeMovie(newMovie), ...prev]);
    } catch (err) {
      console.error("addMovie - Error adding movie:", err);
      throw err;
    }
  }, []);

  const updateMovie = useCallback(async (id: string, patch: Partial<Movie>) => {
    try {
      console.log('updateMovie - Attempting to update movie:', id, patch);
      
      // Get the current movie to check if images are being replaced
      const currentMovie = movies.find(m => m.id === id);
      
      // Delete old images from Supabase Storage if they're being replaced
      if (currentMovie) {
        if (patch.poster && patch.poster !== currentMovie.poster) {
          if (currentMovie.poster && isSupabaseStorageUrl(currentMovie.poster)) {
            const bucket = extractBucketFromUrl(currentMovie.poster);
            if (bucket) {
              console.log('updateMovie - Deleting old poster from storage:', bucket);
              await deleteImage(currentMovie.poster, bucket === 'posters' ? 'poster' : 'backdrop');
            }
          }
        }
        if (patch.backdrop && patch.backdrop !== currentMovie.backdrop) {
          if (currentMovie.backdrop && isSupabaseStorageUrl(currentMovie.backdrop)) {
            const bucket = extractBucketFromUrl(currentMovie.backdrop);
            if (bucket) {
              console.log('updateMovie - Deleting old backdrop from storage:', bucket);
              await deleteImage(currentMovie.backdrop, bucket === 'posters' ? 'poster' : 'backdrop');
            }
          }
        }
      }

      const updated = await moviesApi.update(id, patch);
      console.log('updateMovie - Successfully updated movie:', updated);
      setMovies(prev => prev.map(m => (m.id === id ? normalizeMovie(updated) : m)));
    } catch (err) {
      console.error("updateMovie - Error updating movie:", err);
      throw err;
    }
  }, [movies]);

  const deleteMovie = useCallback(async (id: string) => {
    try {
      console.log('deleteMovie - Starting deletion for movie id:', id);
      
      // Get the movie first to extract image URLs (for later cleanup)
      const movie = movies.find(m => m.id === id);
      console.log('deleteMovie - Found movie:', movie?.title);
      
      // Step 1: Delete from database FIRST (this is the critical operation)
      await moviesApi.delete(id);
      console.log('deleteMovie - Successfully deleted from database');
      
      // Step 2: Remove movie from mood linked_movie_ids in database
      const moodsToUpdate = moods.filter(mood => (mood.linkedMovieIds || []).includes(id));
      console.log('deleteMovie - Updating moods:', moodsToUpdate.map(m => m.label));
      
      for (const mood of moodsToUpdate) {
        const updatedLinkedIds = (mood.linkedMovieIds || []).filter(movieId => movieId !== id);
        await moodsApi.update(mood.id, { linkedMovieIds: updatedLinkedIds });
      }
      console.log('deleteMovie - Successfully updated mood linked_movie_ids');
      
      // Step 3: Delete images from Supabase Storage (only after DB delete succeeds)
      if (movie) {
        if (movie.poster && isSupabaseStorageUrl(movie.poster)) {
          const bucket = extractBucketFromUrl(movie.poster);
          if (bucket) {
            console.log('deleteMovie - Deleting poster from storage:', bucket);
            await deleteImage(movie.poster, bucket === 'posters' ? 'poster' : 'backdrop');
          }
        }
        if (movie.backdrop && isSupabaseStorageUrl(movie.backdrop)) {
          const bucket = extractBucketFromUrl(movie.backdrop);
          if (bucket) {
            console.log('deleteMovie - Deleting backdrop from storage:', bucket);
            await deleteImage(movie.backdrop, bucket === 'posters' ? 'poster' : 'backdrop');
          }
        }
      }
      console.log('deleteMovie - Successfully deleted images from storage');
      
      // Step 4: Update local state
      setMovies(prev => prev.filter(m => m.id !== id));
      setMoods(prev => prev.map(mood => ({
        ...mood,
        linkedMovieIds: (mood.linkedMovieIds || []).filter(movieId => movieId !== id),
        updatedAt: Date.now(),
      })));
      console.log('deleteMovie - Successfully updated local state');
    } catch (err) {
      console.error("Error deleting movie:", err);
      throw err;
    }
  }, [movies, moods]);

  const addMood = useCallback(async (m: MoodDraft) => {
    try {
      const moodId = m.id || slugify(m.label);
      const newMood = await moodsApi.create({ ...m, id: moodId });
      setMoods(prev => [...prev, newMood].sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (err) {
      console.error("Error adding mood:", err);
      throw err;
    }
  }, []);

  const updateMood = useCallback(async (id: string, patch: Partial<MoodCategory>) => {
    try {
      // Get the current mood to check if banner image is being replaced
      const currentMood = moods.find(m => m.id === id);
      
      // Delete old banner image from Supabase Storage if it's being replaced
      if (currentMood && patch.bannerImage && patch.bannerImage !== currentMood.bannerImage) {
        if (currentMood.bannerImage && isSupabaseStorageUrl(currentMood.bannerImage)) {
          const bucket = extractBucketFromUrl(currentMood.bannerImage);
          if (bucket) await deleteImage(currentMood.bannerImage, bucket === 'posters' ? 'poster' : 'backdrop');
        }
      }

      const updated = await moodsApi.update(id, patch);
      setMoods(prev => prev.map(m => (m.id === id ? updated : m)).sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (err) {
      console.error("Error updating mood:", err);
      throw err;
    }
  }, [moods]);

  const deleteMood = useCallback(async (id: string) => {
    try {
      // Get the mood first to extract banner image URL
      const mood = moods.find(m => m.id === id);
      
      // Delete banner image from Supabase Storage if it's a storage URL
      if (mood && mood.bannerImage && isSupabaseStorageUrl(mood.bannerImage)) {
        const bucket = extractBucketFromUrl(mood.bannerImage);
        if (bucket) await deleteImage(mood.bannerImage, bucket === 'posters' ? 'poster' : 'backdrop');
      }

      await moodsApi.delete(id);
      setMoods(prev => prev.filter(m => m.id !== id));
      // Remove mood tag from movies
      setMovies(prev => prev.map(movie => ({
        ...movie,
        moods: (movie.moods || []).filter(m => m !== id),
      })));
    } catch (err) {
      console.error("Error deleting mood:", err);
      throw err;
    }
  }, [moods]);

  const reorderMoods = useCallback(async (ids: string[]) => {
    try {
      await moodsApi.reorder(ids);
      setMoods(prev => {
        const byId = new Map(prev.map(m => [m.id, m]));
        const ordered = ids
          .map((id, index) => {
            const mood = byId.get(id);
            return mood ? { ...mood, sortOrder: index + 1, updatedAt: Date.now() } : null;
          })
          .filter(Boolean) as MoodCategory[];
        const leftovers = prev.filter(m => !ids.includes(m.id)).map((m, index) => ({ ...m, sortOrder: ordered.length + index + 1 }));
        return [...ordered, ...leftovers].sort((a, b) => a.sortOrder - b.sortOrder);
      });
    } catch (err) {
      console.error("Error reordering moods:", err);
      throw err;
    }
  }, []);

  const setToggles = useCallback(async (t: SectionToggles) => {
    try {
      const updated = await sectionTogglesApi.update(t);
      setTogglesState(updated);
    } catch (err) {
      console.error("Error updating toggles:", err);
      throw err;
    }
  }, []);

  const resetData = useCallback(async () => {
    // This would require a seed function - for now just refresh
    await fetchData();
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const getMovieBySlug = useCallback((slug: string) => {
    return movies.find(m => m.slug === slug) || null;
  }, [movies]);

  const value = useMemo(
    () => ({ movies, moods, toggles, loading, error, addMovie, updateMovie, deleteMovie, getMovieBySlug, addMood, updateMood, deleteMood, reorderMoods, setToggles, resetData, refresh }),
    [movies, moods, toggles, loading, error, addMovie, updateMovie, deleteMovie, getMovieBySlug, addMood, updateMood, deleteMood, reorderMoods, setToggles, resetData, refresh]
  );

  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
};

export const useMovies = () => {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMovies must be used within MoviesProvider");
  return ctx;
};
