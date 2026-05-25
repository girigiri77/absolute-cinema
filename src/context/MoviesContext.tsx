import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { MoodCategory, Movie, SectionToggles } from "../types";
import { SEED_MOVIES, DEFAULT_TOGGLES, DEFAULT_MOODS } from "../data/seed";

type MovieDraft = Omit<Movie, "id" | "createdAt">;
type MoodDraft = Omit<MoodCategory, "id" | "createdAt" | "updatedAt"> & { id?: string };

type Ctx = {
  movies: Movie[];
  moods: MoodCategory[];
  toggles: SectionToggles;
  addMovie: (m: MovieDraft) => void;
  updateMovie: (id: string, patch: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  addMood: (m: MoodDraft) => MoodCategory;
  updateMood: (id: string, patch: Partial<MoodCategory>) => void;
  deleteMood: (id: string) => void;
  reorderMoods: (ids: string[]) => void;
  setToggles: (t: SectionToggles) => void;
  resetData: () => void;
};

const MoviesContext = createContext<Ctx | null>(null);

const LS_MOVIES = "absolute-cinema:movies:v1";
const LS_MOODS = "absolute-cinema:moods:v1";
const LS_TOGGLES = "absolute-cinema:toggles:v1";
const MOVIES_SYNC_EVENT = "absolute-cinema:movies-sync";
const MOODS_SYNC_EVENT = "absolute-cinema:moods-sync";
const INITIAL_MOVIES = SEED_MOVIES;
const INITIAL_MOODS = DEFAULT_MOODS;

const PLATFORM_ALIASES: Record<string, string> = {
  "Disney+ Hotstar": "Hotstar",
  JioHotstar: "Hotstar",
  ZEE5: "Zee5",
  "Apple TV+": "JioCinema",
};

const normalizeMovie = (movie: Movie): Movie => ({
  ...movie,
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

const normalizeMood = (mood: Partial<MoodCategory> & { label?: string; emoji?: string; id?: string }, index = 0): MoodCategory => {
  const now = Date.now();
  const label = mood.label?.trim() || "Untitled Mood";
  return {
    id: mood.id || slugify(label),
    label,
    emoji: mood.emoji || "✨",
    description: mood.description || "A custom cinematic mood collection.",
    color: mood.color || "from-fuchsia-500 to-purple-600",
    glowColor: mood.glowColor || "rgba(168,85,247,0.62)",
    bannerImage: mood.bannerImage || "",
    linkedMovieIds: Array.isArray(mood.linkedMovieIds) ? mood.linkedMovieIds : [],
    autoIncludeByTag: mood.autoIncludeByTag ?? true,
    featured: mood.featured ?? false,
    visible: mood.visible ?? true,
    sortOrder: Number.isFinite(mood.sortOrder) ? Number(mood.sortOrder) : index + 1,
    createdAt: mood.createdAt || now,
    updatedAt: mood.updatedAt || now,
  };
};

const parseMovies = (raw: string | null): Movie[] | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map(normalizeMovie);
  } catch {
    return null;
  }
};

const parseMoods = (raw: string | null): MoodCategory[] | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map(normalizeMood).sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return null;
  }
};

const getInitialMovies = () => {
  const stored = parseMovies(localStorage.getItem(LS_MOVIES));
  return stored || INITIAL_MOVIES.map(normalizeMovie);
};

const getInitialMoods = () => {
  const stored = parseMoods(localStorage.getItem(LS_MOODS));
  return stored || INITIAL_MOODS.map(normalizeMood).sort((a, b) => a.sortOrder - b.sortOrder);
};

const persistMovies = (next: Movie[]) => {
  try {
    localStorage.setItem(LS_MOVIES, JSON.stringify(next));
  } catch (error) {
    console.warn("ABSOLUTE CINEMA: movie catalog could not be persisted to localStorage.", error);
  }
};

const persistMoods = (next: MoodCategory[]) => {
  try {
    localStorage.setItem(LS_MOODS, JSON.stringify(next));
  } catch (error) {
    console.warn("ABSOLUTE CINEMA: mood catalog could not be persisted to localStorage.", error);
  }
};

export const MoviesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>(getInitialMovies);
  const [moods, setMoods] = useState<MoodCategory[]>(getInitialMoods);
  const [toggles, setTogglesState] = useState<SectionToggles>(() => {
    try {
      const raw = localStorage.getItem(LS_TOGGLES);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_TOGGLES;
  });

  useEffect(() => {
    if (!localStorage.getItem(LS_MOVIES)) persistMovies(movies);
  }, [movies]);
  useEffect(() => {
    if (!localStorage.getItem(LS_MOODS)) persistMoods(moods);
  }, [moods]);
  useEffect(() => {
    try { localStorage.setItem(LS_TOGGLES, JSON.stringify(toggles)); } catch {}
  }, [toggles]);

  const commitMovies = useCallback((updater: Movie[] | ((prev: Movie[]) => Movie[])) => {
    setMovies(prev => {
      const result = typeof updater === "function" ? updater(prev) : updater;
      const next = result.map(normalizeMovie);
      persistMovies(next);
      queueMicrotask(() => {
        window.dispatchEvent(new CustomEvent<Movie[]>(MOVIES_SYNC_EVENT, { detail: next }));
      });
      return next;
    });
  }, []);

  const commitMoods = useCallback((updater: MoodCategory[] | ((prev: MoodCategory[]) => MoodCategory[])) => {
    setMoods(prev => {
      const result = typeof updater === "function" ? updater(prev) : updater;
      const next = result
        .map((mood, index) => normalizeMood(mood, index))
        .sort((a, b) => a.sortOrder - b.sortOrder);
      persistMoods(next);
      queueMicrotask(() => {
        window.dispatchEvent(new CustomEvent<MoodCategory[]>(MOODS_SYNC_EVENT, { detail: next }));
      });
      return next;
    });
  }, []);

  // Sync across tabs and across any same-tab provider remounts.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_MOVIES && e.newValue) {
        const next = parseMovies(e.newValue);
        if (next) setMovies(next);
      }
      if (e.key === LS_TOGGLES && e.newValue) {
        try { setTogglesState(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === LS_MOODS && e.newValue) {
        const next = parseMoods(e.newValue);
        if (next) setMoods(next);
      }
    };
    const onMoviesSync = (e: Event) => {
      const next = (e as CustomEvent<Movie[]>).detail;
      if (Array.isArray(next)) setMovies(next.map(normalizeMovie));
    };
    const onMoodsSync = (e: Event) => {
      const next = (e as CustomEvent<MoodCategory[]>).detail;
      if (Array.isArray(next)) setMoods(next.map(normalizeMood).sort((a, b) => a.sortOrder - b.sortOrder));
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(MOVIES_SYNC_EVENT, onMoviesSync);
    window.addEventListener(MOODS_SYNC_EVENT, onMoodsSync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(MOVIES_SYNC_EVENT, onMoviesSync);
      window.removeEventListener(MOODS_SYNC_EVENT, onMoodsSync);
    };
  }, []);

  const addMovie = useCallback((m: MovieDraft) => {
    const newMovie: Movie = {
      ...normalizeMovie(m as Movie),
      id: "m_" + Math.random().toString(36).slice(2, 10),
      createdAt: Date.now(),
    };
    commitMovies(prev => [newMovie, ...prev]);
  }, [commitMovies]);

  const updateMovie = useCallback((id: string, patch: Partial<Movie>) => {
    commitMovies(prev => prev.map(m => (m.id === id ? normalizeMovie({ ...m, ...patch }) : m)));
  }, [commitMovies]);

  const deleteMovie = useCallback((id: string) => {
    commitMovies(prev => prev.filter(m => m.id !== id));
    commitMoods(prev => prev.map(mood => ({
      ...mood,
      linkedMovieIds: (mood.linkedMovieIds || []).filter(movieId => movieId !== id),
      updatedAt: Date.now(),
    })));
  }, [commitMovies, commitMoods]);

  const addMood = useCallback((m: MoodDraft) => {
    const newMood = normalizeMood({
      ...m,
      id: m.id || slugify(m.label),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    commitMoods(prev => [...prev, newMood]);
    return newMood;
  }, [commitMoods]);

  const updateMood = useCallback((id: string, patch: Partial<MoodCategory>) => {
    commitMoods(prev => prev.map(m => (m.id === id ? normalizeMood({ ...m, ...patch, updatedAt: Date.now() }) : m)));
  }, [commitMoods]);

  const deleteMood = useCallback((id: string) => {
    commitMoods(prev => prev.filter(m => m.id !== id));
    commitMovies(prev => prev.map(movie => ({ ...movie, moods: (movie.moods || []).filter(m => m !== id) })));
  }, [commitMoods, commitMovies]);

  const reorderMoods = useCallback((ids: string[]) => {
    commitMoods(prev => {
      const byId = new Map(prev.map(m => [m.id, m]));
      const ordered = ids
        .map((id, index) => {
          const mood = byId.get(id);
          return mood ? { ...mood, sortOrder: index + 1, updatedAt: Date.now() } : null;
        })
        .filter(Boolean) as MoodCategory[];
      const leftovers = prev.filter(m => !ids.includes(m.id)).map((m, index) => ({ ...m, sortOrder: ordered.length + index + 1 }));
      return [...ordered, ...leftovers];
    });
  }, [commitMoods]);

  const setToggles = useCallback((t: SectionToggles) => setTogglesState(t), []);

  const resetData = useCallback(() => {
    commitMovies(INITIAL_MOVIES.map(normalizeMovie));
    commitMoods(INITIAL_MOODS.map(normalizeMood));
    setTogglesState(DEFAULT_TOGGLES);
  }, [commitMovies, commitMoods]);

  const value = useMemo(
    () => ({ movies, moods, toggles, addMovie, updateMovie, deleteMovie, addMood, updateMood, deleteMood, reorderMoods, setToggles, resetData }),
    [movies, moods, toggles, addMovie, updateMovie, deleteMovie, addMood, updateMood, deleteMood, reorderMoods, setToggles, resetData]
  );

  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
};

export const useMovies = () => {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMovies must be used within MoviesProvider");
  return ctx;
};
